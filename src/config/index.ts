import { ConnectionOptions } from '@odyssoft/tsorm'
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

const database: ConnectionOptions = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) ?? 3306,
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
}

const discord = {
  clientId: process.env.DISCORD_CLIENT_ID ?? '',
  clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
  guildId: process.env.DISCORD_GUILD_ID ?? '',
  token: process.env.DISCORD_TOKEN ?? '',
  channels: {
    commands: process.env.CHANNEL_COMMANDS!,
    lobbylinks: process.env.CHANNEL_LOBBYLINKS!,
    voting: process.env.CHANNEL_VOTING!,
  },
}

const steam = {
  apiKey: process.env.STEAM_API_KEY ?? '',
  gameId: 289070,
  playTime: 120,
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
  database,
  discord,
  host: process.env.HOST!,
  port: Number(process.env.PORT!),
  steam,
  trueskill,
}
