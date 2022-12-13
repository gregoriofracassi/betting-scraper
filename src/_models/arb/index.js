import mongoose from 'mongoose'

const ArbOddSchema = new mongoose.Schema({
	value: {
        type: Number,
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    }
})

const ArbSchema = new mongoose.Schema({
    game: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Game',
		required: true,
	},
    one: ArbOddSchema,
    x: ArbOddSchema,
    two: ArbOddSchema,
    win_percentage: {
        type: Number,
        required: true
    }
})

export default mongoose.model('Arb', ArbSchema)