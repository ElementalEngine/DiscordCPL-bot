import { config } from './config'
import discord from './discord/index'
import app from './server'

discord.login(config.discord.token)

app.listen(
  config.port,
  ['127.0.0.1', 'localhost'].includes(config.host) ? config.host : '0.0.0.0',
  () => {
    console.log(`Server running at http://${config.host}:${config.port}/`)
  }
)
