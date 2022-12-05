import cors from "cors"
import express from "express"
import usersRouter from "./services/users/index.js"
import gamesRouter from "./services/games/index.js"
import ratingsRouter from "./services/userRatings/index.js"
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"
import teamsRouter from "./services/teams/index.js"

const server = express()

const whitelist = [process.env.LOCAL_FE]

const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whitelist.includes(origin)) {
      next(null, true)
    } else {
      next(new Error("Origin is not supported!"))
    }
  },
}

server.use(cors(corsOptions))
server.use(express.json())

server.use("/users", usersRouter)
server.use("/ratings", ratingsRouter)
server.use("/games", gamesRouter)
server.use("/teams", teamsRouter)

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(catchAllErrorHandler)

export default server
