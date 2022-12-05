import { Router } from "express"
import createError from "http-errors"
import UserModel from "../../_models/user/index.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"

const ratingsRouter = Router()

ratingsRouter.post("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newRating = { ...req.body, user: req.user }
    const user = await UserModel.findById(req.params.id)
    if (user) {
      const alreadyRated = await UserModel.findOne({
        _id: req.params.id,
        [req.query.type]: {
          $elemMatch: { user: req.user },
        },
      })
      if (!alreadyRated) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              [req.query.type]: newRating,
            },
          },
          {
            runValidators: true,
            new: true,
          }
        )
        res.status(201).send(updatedUser)
      } else {
        next(createError("user already rated"))
      }
    } else {
      next(createError(404, "user not found"))
    }
  } catch (error) {
    next(createError(500, "an error occurred while adding a rating"))
  }
})

// ratingsRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
//   try {
//     const user = await UserModel.findById(req.params.id)
//     if (user) {
//       const alreadyRated = await UserModel.findOne({
//         _id: req.params.id,
//         [req.query.type]: {
//           $elemMatch: { user: req.user },
//         },
//       })
//       if (alreadyRated) {
//         // ---put user----
//       } else {
//         next(createError("user not rated yet"))
//       }
//     } else {
//       next(createError(404, "user not found"))
//     }
//   } catch (error) {
//     next(createError(500, "an error occurred while adding a rating"))
//   }
// })

export default ratingsRouter
