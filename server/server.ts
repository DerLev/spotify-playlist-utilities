import express from 'express'
import { green, lightGreen, gray, lightGray, lightCyan, bold, red, lightYellow, yellow } from 'kolorist'
import { returnAbsolutePath } from '../lib/returnPath'
import yargs from 'yargs'
import { config as loadenv } from 'dotenv'
import { Client } from 'redis-om'
import { playlistSchema } from '../lib/redis'
import { readFileSync } from 'fs'
import YAML from 'yaml'
import { Config, configSchema } from '../lib/validations'

const cwd = process.cwd()

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

const redisClient = new Client()

const connect = async () => {
  if(!redisClient.isOpen()) {
    if(!process.env.REDIS_URL) throw new Error('Redis URL not specified')
    await redisClient.open(process.env.REDIS_URL)
  }
}

const app = express()
app.disable('x-powered-by')

interface Args {
  [key: string]: any
}

const args = yargs(process.argv.slice(2)).argv as Args
const development = args['dev'] === 'true' ? true : false

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

app.all("/api/*", (_req, res) => {
  res.status(400).json({ code: 404, message: 'endpoint not found' })
})

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
