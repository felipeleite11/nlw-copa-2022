import Fastify from 'fastify'
import cors from '@fastify/cors'

import { pollRoutes } from './routes/poll'
import { userRoutes } from './routes/user'
import { guessRoutes } from './routes/guess'
import { gameRoutes } from './routes/game'

async function bootstrap() {
	const fastify = Fastify({
		logger: true
	})

	await fastify.register(cors, {
		origin: true
	})

	fastify.register(pollRoutes)
	
	fastify.register(userRoutes)
	
	fastify.register(guessRoutes)
	
	fastify.register(gameRoutes)

	await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()