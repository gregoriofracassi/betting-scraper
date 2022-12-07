import { Router } from "express"
import createError from "http-errors"
import GameModel from "../../_models/game/index.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { URL_SET } from "../../utils/william_hill.js"
import { getWeekData, getDayData } from "../scrapers/william_hill.js"

const gamesRouter = Router()

// ---------basic routes---------

gamesRouter.post("/", async (req, res, next) => {
  try {
    const setNewGame = req.body
    const newGame = new GameModel(setNewGame)
    const { _id } = await newGame.save()
    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new game"))
  }
})

gamesRouter.post("/williamhill", async (req, res, next) => {
  try {
    const week_games = []
    for (const url of URL_SET) {
      const day_games = await getDayData(url)
      week_games.push(...day_games)
    }
    console.info(`William Hill total week games - ${week_games.length}`)
    GameModel.insertMany(week_games)
    console.info('Games saved in db in db')
    res.status(201).send(`Saved ${week_games.length} games`)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new game"))
  }
})

gamesRouter.post("/betclic", async (req, res, next) => {
  try {
    const week_games = []
    for (const url of URL_SET) {
      const day_games = await getDayData(url)
      week_games.push(...day_games)
    }
    console.info(`William Hill total week games - ${week_games.length}`)
    GameModel.insertMany(week_games)
    console.info('Games saved in db in db')
    res.status(201).send(`Saved ${week_games.length} games`)
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new game"))
  }
})

gamesRouter.delete("/williamhill", async (req, res, next) => {
  try {
    GameModel.deleteMany({ team_1: 'arzignano' })
    res.status(201).send('ciao')
  } catch (error) {
    console.log(error)
    next(createError(500, "An error occurred while saving new game"))
  }
})

gamesRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const games = await GameModel.find()
    res.status(200).send(games)
  } catch (error) {
    next(createError(500, { message: error.message }))
  }
})

gamesRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updateGame = await GameModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        runValidators: true,
        new: true,
      }
    )
    res.status(201).send(updateGame)
  } catch (error) {
    next(error)
  }
})

gamesRouter.delete("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const deleteGame = await GameModel.findByIdAndDelete(req.params.id)
    if (deleteGame) res.status(201).send("Game deleted")
    else next(createError(400, "Bad Request"))
  } catch (error) {
    next(error)
  }
})

export default gamesRouter
