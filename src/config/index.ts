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
  clientId: process.env.BOT_CLIENT_ID ?? '',
  clientSecret: process.env.BOT_CLIENT_SECRET ?? '',
  guildId: process.env.DISCORD_GUILD_ID ?? '',
  token: process.env.BOT_TOKEN ?? '',
  channels: {
    civ7commands: process.env.CHANNEL_COMMANDS_CIV7!,
    civ6commands: process.env.CHANNEL_COMMANDS_CIV6!,
    civ6ffavoting: process.env.CHANNEL_FFA_VOTING_CIV6!,
    civ6teamvoting: process.env.CHANNEL_TEAM_VOTING_CIV6!,
    civ7ffavoting: process.env.CHANNEL_FFA_VOTING_CIV7!,
    civ7teamvoting: process.env.CHANNEL_TEAM_VOTING_CIV7!,
    civ6lobbylinks: process.env.CHANNEL_LOBBYLINKS_CIV6!,
    civ7lobbylinks: process.env.CHANNEL_LOBBYLINKS_CIV7!,
  },
  roles: {
    moderator: process.env.ROLE_MODERATOR!,
    Civ6Rank: process.env.ROLE_CIV6!,
    Civ7Rank: process.env.ROLE_CIV7!,
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
  mongoDb: process.env.MONGODB_URI!,
}
