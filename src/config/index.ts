import { CorsOptions } from 'cors'
import { config as env } from 'dotenv'
import path from 'path'

export * from './constants'

env({
  path: path.resolve('./.env'),
})

const cors: CorsOptions = {
  origin: process.env.CORS ?? '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
}


const discord = {
  clientId: process.env.DISCORD_CLIENT_ID ?? '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
  guildId: process.env.DISCORD_GUILD_ID ?? '',
  token: process.env.DISCORD_TOKEN ?? '',
  channels: {
    civ7commands: process.env.CIV7_CHANNEL_COMMANDS!,
    civ6commands: process.env.CIV6_CHANNEL_COMMANDS!,
    civ6ffavoting: process.env.CIV6_FFA_CHANNEL_VOTING!,
    civ6teamvoting: process.env.CIV6_TEAM_CHANNEL_VOTING!,
    civ7ffavoting: process.env.CIV7_FFA_CHANNEL_VOTING!,
    civ7teamvoting: process.env.CIV7_TEAM_CHANNEL_VOTING!,
    civ6lobbylinks: process.env.CIV6_CHANNEL_LOBBYLINKS!,
    civ7lobbylinks: process.env.CIV7_CHANNEL_LOBBYLINKS!,
  },
}

const trueskill = {
  MU: 1250,
  SIGMA: 150,
  BETA: 400,
  TAU: 10,
}

export const config = {
  oauth: `https://discord.com/api/oauth2/authorize?client_id=${
    discord.clientId
  }&redirect_uri=http%3A%2F%2F${process.env.HOST!}:${process.env
    .PORT!}&response_type=code&scope=identify%20connections&state=`,
  cors,
  discord,
  host: process.env.HOST!,
  port: Number(process.env.PORT!),
  trueskill,
}
