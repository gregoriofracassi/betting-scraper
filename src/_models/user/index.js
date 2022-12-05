import mongoose from "mongoose"
import bcrypt from "bcrypt"

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    min: 0,
    max: 100,
  },
})

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://www.allthetests.com/quiz22/picture/pic_1171831236_1.png",
  },
  technical: [RatingSchema],
  physical: [RatingSchema],
  athletic: [RatingSchema],
  passing: [RatingSchema],
  shooting: [RatingSchema],
  teamPlay: [RatingSchema],
  defOff: [RatingSchema],
  goaly: [RatingSchema],
  isGoaly: {
    type: Boolean,
    required: true,
    default: false,
  },
})

UserSchema.pre("save", async function (next) {
  const newUser = this
  const plainPw = newUser.password

  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(plainPw, 10)
  }
  next()
})

UserSchema.post("validate", function (error, doc, next) {
  if (error) {
    res.status(400).send(error)
  } else {
    next()
  }
})

UserSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

UserSchema.statics.checkCredentials = async function (email, plainPw) {
  const user = await this.findOne({ email })
  console.log("checking credentials...")
  if (user) {
    const hashedPw = user.password
    const isMatch = await bcrypt.compare(plainPw, hashedPw)

    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
}

const skills = [
  "technical",
  "physical",
  "athletic",
  "passing",
  "shooting",
  "teamPlay",
]

UserSchema.statics.overAll = async function (id, type) {
  //if you call this function with just the id param, it'll give you the entire overall
  //if you add the second param you get the specific overall of the chosen skill

  const average = (arr) =>
    arr.length !== 0
      ? arr.reduce((acc, val) => acc + val, 0) / arr.length
      : undefined
  const user = await this.findById(id)
  const typeAvg = (ratingType) => {
    const justRatings =
      user[ratingType].length !== 0
        ? user[ratingType].map((ratingObj) => ratingObj.rating)
        : undefined
    return justRatings ? average(justRatings) : undefined
  }
  if (type) return typeAvg(type)
  if (!user.isGoaly) {
    const averagesArr = skills.map((skill) => typeAvg(skill))
    const globalRating = average(averagesArr.filter((rating) => rating))
    return globalRating
  } else {
    return typeAvg("goaly") ? typeAvg("goaly") + 5 : undefined
  }
}

export default mongoose.model("User", UserSchema)
