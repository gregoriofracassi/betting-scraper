import { Router } from "express"
import createError from "http-errors"
import UserModel from "../../_models/user/index.js"
import GameModel from "../../_models/game/index.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const teamsRouter = Router()

teamsRouter.get("/:id/teamsList", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const game = await GameModel.findById(req.params.id)
    const { participants } = game
    const particIds = participants.map((p) => p.toString())

    // ---------- generatING OBJ with ids and overall values of participants --------------
    const overAllObj = particIds.map(async (p) => {
      return {
        user: p,
        overAll: await UserModel.overAll(p),
      }
    })
    const overAllIdsAndValue = await Promise.all(overAllObj)
    // -------------------------------------------------------------------------------------

    // ---------------- generatING ARRAY with overall values of participants --------------
    const overAllPromises = particIds.map((p) => UserModel.overAll(p))
    const overAllArr = await Promise.all(overAllPromises)
    // ------------------------------------------------------------------------------------

    const idealNum = overAllArr.reduce((acc, val) => acc + val, 0) / 2 // ideal number that's half the total value of the 10 players

    const getAllSubsets = (arr) =>
      arr.reduce(
        (subsets, value) =>
          subsets.concat(subsets.map((set) => [value, ...set])),
        [[]]
      ) // all possible subset arrays from given array
    const combinations = getAllSubsets(overAllArr).filter(
      (set) => set.length === 5
    ) // keeping only the ones of 5 elements
    const sorted = combinations.sort((a, b) =>
      Math.abs(a.reduce((acc, val) => acc + val) - idealNum) >
      Math.abs(b.reduce((acc, val) => acc + val) - idealNum)
        ? 1
        : -1
    ) // sorting them by how close they are to the ideal number
    let topSorted = sorted.slice(0, 10)
    let n = 0
    while (n < 4) {
      // no teams are the exact opposite (that'd be same team combination)
      topSorted = topSorted.filter((team, ind, arr) =>
        team.some((el) => arr[n].includes(el))
      )
      n++
    }

    const topSortedIds = topSorted.map((team) => {
      return team.map((pl) => overAllIdsAndValue.find((p) => p.overAll === pl))
    }) // enhancing the array of teams by value with ids associated with those values

    const generateOtherTeam = (team) => {
      return overAllIdsAndValue.filter(
        (pl) => !team.find((p) => p.user === pl.user)
      )
    } // subtracting the given team from participants to get other team

    const teams = topSortedIds.map((team) => {
      return {
        teamA: team,
        teamB: generateOtherTeam(team),
      }
    })

    res.status(200).send({ teams, idealNum })
  } catch (error) {
    next(
      createError(500, "an error occurred while getting best possible teams")
    )
  }
})

teamsRouter.put("/:id/setTeams", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const game = await GameModel.findById(req.params.id)
    if (game) {
      const updateGame = await GameModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ...req.body },
        },
        {
          runValidators: true,
          new: true,
        }
      )
      res.status(200).send(updateGame)
    } else {
      next(createError(404, "game not found not found"))
    }
  } catch (error) {
    next(createError(500, "an error occurred while adding a rating"))
  }
})

export default teamsRouter
