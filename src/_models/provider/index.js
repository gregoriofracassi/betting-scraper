import mongoose from 'mongoose'

const ProviderSchema = new mongoose.Schema({
	name: {
		type: String,
		enum: ['William Hill', 'Betclic', 'Planetwin365'],
		required: true,
	},
	logo: {
		type: String,
	},
})

ProviderSchema.post('validate', function (error, doc, next) {
	if (error) {
		res.status(400).send(error)
	} else {
		next()
	}
})

export default mongoose.model('Provider', ProviderSchema)
