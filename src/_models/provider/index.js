import mongoose from 'mongoose'

const ProviderSchema = new mongoose.Schema({
	name: {
		type: String,
		enum: [
			'William Hill',
			'Betclic',
			'Bet365',
			'Goldbet',
			'Pokerstars',
			'Sisal',
			'Snai',
			'Starcasino',
			'888sport',
			'Betfair',
			'Better',
			'Netbet',
			'Planetwin365',
			'Novibet',
			'Oddschecker',
		],
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
