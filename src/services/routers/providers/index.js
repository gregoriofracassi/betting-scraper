import { Router } from 'express'
import createError from 'http-errors'
import ProviderModel from '../../../_models/provider/index.js'

const providersRouter = Router()

providersRouter.post('/', async (req, res, next) => {
	try {
		const set_new_provider = req.body
		const new_provider = new ProviderModel(set_new_provider)
		const { _id } = await new_provider.save()
		res.status(201).send(_id)
	} catch (error) {
		console.log(error)
		next(createError(500, 'An error occured while saving a provider'))
	}
})

export default providersRouter
