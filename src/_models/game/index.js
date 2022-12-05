import mongoose from "mongoose"

const LogEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: String,
  },
})

const MessageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const GameSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    teamA: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        overAll: {
          type: Number,
        },
      },
    ],
    teamB: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        overAll: {
          type: Number,
        },
      },
    ],
    dateTime: {
      type: Date,
      required: true,
    },
    idealTeamValue: {
      type: Number,
    },
    location: {
      type: String,
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    log: [LogEventSchema],
    chat: [MessageSchema],
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
