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

export const gimmick = 'ciao'

export default mongoose.model('Game', GameSchema)
