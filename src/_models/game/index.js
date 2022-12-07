import mongoose from "mongoose"

const OddsSchema = new mongoose.Schema(
  {
    one: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    two: {
      type: Number,
      required: true
    },
  }
)

const GameSchema = new mongoose.Schema(
  {
    team_1: {
      type: String,
      required: true
    },
    team_2: {
      type: String,
      required: true
    },
    odds: OddsSchema
  },
  {
    timestamps: true,
  }
)

GameSchema.post("validate", function (error, doc, next) {
  if (error) {
    res.status(400).send(error)
  } else {
    next()
  }
})

export default mongoose.model("Game", GameSchema)
