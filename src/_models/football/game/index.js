import mongoose from 'mongoose'

const OddsSchema = new mongoose.Schema({
	one: {
		type: Number,
	},
	x: {
		type: Number,
	},
	two: {
		type: Number,
	},
	one_x: {
		type: Number,
	},
	one_two: {
		type: Number,
	},
	x_two: {
		type: Number,
	},
	over_1dot5: {
		type: Number,
	},
	under_1dot5: {
		type: Number,
	},
	over_2dot5: {
		type: Number,
	},
	under_2dot5: {
		type: Number,
	},
	goal: {
		type: Number,
	},
	no_goal: {
		type: Number,
	},
	provider: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Provider',
		required: true,
	},
})

const TeamsSchema = new mongoose.Schema({
	team_1: {
		type: String,
	},
	team_2: {
		type: String,
	},
	provider: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Provider',
		required: true,
	},
})

const GameSchema = new mongoose.Schema(
	{
		teams: [TeamsSchema],
		odds: [OddsSchema],
		date: {
			type: Date
		}
	},
	{
		timestamps: true,
	}
)

// GameSchema.post('validate', function (error, doc, next) {
// 	if (error) {
// 		res.status(400).send(error)
// 	} else {
// 		next()
// 	}
// })

export default mongoose.model('FootballGame', GameSchema)
