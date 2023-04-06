import express from 'express'
import { green, lightGreen, gray, lightGray, lightCyan, bold, red, lightYellow, yellow } from 'kolorist'
import { returnAbsolutePath } from '../lib/returnPath'
import yargs from 'yargs'
import { config as loadenv } from 'dotenv'
import { Client } from 'redis-om'
import { playlistSchema, createAllIndices } from '../lib/redis'
import { readFileSync } from 'fs'
import YAML from 'yaml'
import { Config, configSchema } from '../lib/validations'

const willError: number = 'testing'

const cwd = process.cwd()

const app = express()
app.disable('x-powered-by')

const redisClient = new Client()

// first write env from config.yml
let config = {} as Config
try {
  const configFile = readFileSync(cwd + '/config.yml', { encoding: 'utf-8' })
  const { value, error } = configSchema.validate(YAML.parse(configFile))
  if(error) {
    console.log(red(`  ➜  Error loading config file: ${error.details[0].message}`))
  } else {
    config = value

    const redisUrl = `redis://${config.redis.user}:${config.redis.password}@${config.redis.host}`
    if(!process.env.REDIS_URL) process.env['REDIS_URL'] = redisUrl
  }
} catch(err) {
  console.error(red(`  ➜  Error loading config file. Does it exists?`))
  process.exit(1)
}

// then write env from .env
loadenv({ path: cwd + '/.env' })

const packageJson = JSON.parse(readFileSync(cwd + '/package.json', { encoding: 'utf-8' }))

/**
 * Connect to the Redis server
 */
const connect = async () => {
  if(!redisClient.isOpen()) {
    if(!process.env.REDIS_URL) throw new Error('Redis URL not specified')
    await redisClient.open(process.env.REDIS_URL)
  }
}

// function needs a better name
/**
 * Store db version in redis and execute index creation if lower
 * @returns Boolean of whether action was run
 */
const storeAppVersion = async (currentVersion: string) => {
  const versionKey = 'dbversion'

  const keyCreated = await redisClient.execute([ 'SETNX', versionKey, currentVersion ]) as number
  if(keyCreated > 0) {
    await createAllIndices(redisClient)
    return true
  }

  const getKey = await redisClient.execute([ 'GET', versionKey ]) as string
  const currentVersionArray = currentVersion.split('.')
  const keyVersion = getKey.split('.')
  let storeNewVersion = false
  for (let i = 0; i < keyVersion.length; i++) {
    if(Number(keyVersion[i]) < Number(currentVersionArray[i])) {
      storeNewVersion = true
      await createAllIndices(redisClient)
      break
    }
  }

  if(storeNewVersion) await redisClient.execute([ 'SET', versionKey, currentVersion ])

  return false
}

interface Args {
  [key: string]: any
}

const args = yargs(process.argv.slice(2)).argv as Args
const development = args['dev'] === 'true' ? true : false

// this is just for testing
// will be removed once api routes are added
app.get("/api/hello", async (_req, res) => {
  try {
    const playlistRepositry = redisClient.fetchRepository(playlistSchema)
    const output = await playlistRepositry.search().return.all()

    res.status(200).json([ ...output ])
  } catch(err) {
    res.status(500).json({ code: 500, message: 'Internal Server Error' })
    console.error(err)
  }
})

// 404 for api routes
app.all("/api/*", (_req, res) => {
  res.status(400).json({ code: 404, message: 'endpoint not found' })
})

// serving client
if(development === false) {
  app.use("/", express.static(returnAbsolutePath("../dist"), {
    setHeaders(res) {
      res.header('X-Robots-Tag', 'noindex')
    },
  }))
  
  app.get("/*", (_req, res) => {
    res.header('X-Robots-Tag', 'noindex')
    res.sendFile(returnAbsolutePath("../dist/index.html"))
  })
} else {
  app.get('/*', (_req, res) => {
    res.status(404).json({ code: 404, message: 'not in production mode' })
  })
}

const { PORT = 5000 } = process.env
app.listen(PORT, async () => {
  console.log()
  console.log(green(`  ➜ `), gray(`Server running on port`), lightGray(`${PORT}`))
  console.log(lightGreen(`  ➜ `), lightGray(`Local:`), lightCyan(`http://localhost:${bold(PORT)}/`))

  if(development !== false) console.log(
    lightYellow('  ➜ '),
    yellow('Currently in development mode')
  )

  console.log()

  try {
    await connect()
    console.log(lightGreen(`  ➜ `), lightGray(`Connected to Redis server`))
    
    // always create new index when env var is set and in dev mode
    const rebuildIndex = process.env.NEW_INDEX && development ? true : false
    if(rebuildIndex) {
      await createAllIndices(redisClient)
    } else {
      await storeAppVersion(packageJson.version)
    }

    console.log()
  } catch(err) {
    console.error(err)
  }
})

// Shutdown handling for Docker and Nodemon

const silentShutdown = () => {
  process.exit()
}

const shutdown = () => {
  console.log()
  console.log(red(`  ➜  Exiting server...`))
  silentShutdown()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
process.on('SIGUSR2', silentShutdown)
