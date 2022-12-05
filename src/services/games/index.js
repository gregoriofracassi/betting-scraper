import { Router } from "express"
import createError from "http-errors"
import GameModel from "../../_models/game/index.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const gamesRouter = Router()

// ---------basic routes---------

gamesRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const setNewGame = { ...req.body, creator: req.user }
    const newGame = new GameModel(setNewGame)
    const { _id } = await newGame.save()
    res.status(201).send(_id)
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

gamesRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const game = await GameModel.findById(req.params.id).populate([
      {
        path: "teamA",
        populate: { path: "user" },
      },
      {
        path: "teamB",
        populate: { path: "user" },
      },
    ])
    if (!game) {
      next(createError(404, `ID ${req.params.id} was not found`))
    } else {
      res.status(200).send(game)
    }
  } catch (error) {
    next(error)
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

// --------add/remove players---------

gamesRouter.post(
  "/:id/addPlayer",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const player = req.user
      const game = await GameModel.findById(req.params.id)
      if (game) {
        const updatePlayers = await GameModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              participants: player,
            },
          },
          {
            runValidators: true,
            new: true,
          }
        )
        res.status(201).send(updatePlayers)
      } else {
        next(createError(404, "game not found"))
      }
    } catch (error) {
      next(createError(500, "an error occurred while adding a player"))
    }
  }
)

gamesRouter.delete(
  "/:id/removePlayer",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const game = await GameModel.findById(req.params.id)
      if (game) {
        const deletePlayer = await GameModel.findByIdAndUpdate(
          req.params.id,
          {
            $pull: {
              participants: req.user._id,
            },
          },
          {
            new: true,
          }
        )
        res.status(201).send(deletePlayer)
      } else {
        next(createError(404, "game not found"))
      }
    } catch (error) {
      next(createError(500, "an error occurred while removing a player"))
    }
  }
)

export default gamesRouter
