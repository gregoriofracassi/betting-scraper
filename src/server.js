import cors from 'cors'
import express from 'express'
import footballRouter from './routers/football/games.js'
import providersRouter from './routers/providers.js'
import arbsRouter from './routers/football/arbs.js'
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler, unauthorizedErrorHandler } from './errorHandlers.js'

const server = express()

const whitelist = [process.env.LOCAL_FE]

const corsOptions = {
	origin: function (origin, next) {
		if (!origin || whitelist.includes(origin)) {
			next(null, true)
		} else {
			next(new Error('Origin is not supported!'))
		}
	},
}

server.use(cors(corsOptions))
server.use(express.json())

server.use('/football', footballRouter)
server.use('/providers', providersRouter)
server.use('/arbs', arbsRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(catchAllErrorHandler)

export default server
