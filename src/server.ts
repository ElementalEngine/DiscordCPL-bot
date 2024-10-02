import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
// import session from 'express-session'

import { config } from './config'
import Routes from './routes'

const app = express()

app.use(cors(config.cors))
// app.use(session(config.session))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', Routes())

export default app
