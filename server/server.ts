import express from 'express'
import { green, lightGreen, gray, lightGray, lightCyan, bold, red, lightYellow, yellow } from 'kolorist'
import { returnAbsolutePath } from '../lib/returnPath'
import yargs from 'yargs'
import { config as loadenv } from 'dotenv'

const cwd = process.cwd()
loadenv({ path: cwd + '/.env' })

const app = express()
app.disable('x-powered-by')

interface Args {
  [key: string]: any
}

const args = yargs(process.argv.slice(2)).argv as Args
const development = args['dev'] === 'true' ? true : false

app.get("/api/hello", (_req, res) => {
  res.status(200).json({ code: 200, message: process.env.HELLO_MESSAGE })
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
app.listen(PORT, () => {
  console.log()
  console.log(green(`  ➜ `), gray(`Server running on port`), lightGray(`${PORT}`))
  console.log(lightGreen(`  ➜ `), lightGray(`Local:`), lightCyan(`http://localhost:${bold(PORT)}/`))

  if(development !== false) console.log(
    lightYellow('  ➜ '),
    yellow('Currently in development mode')
  )

  console.log()
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
