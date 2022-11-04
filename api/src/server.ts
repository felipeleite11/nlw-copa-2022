import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifyEnv from '@fastify/env'

import { pollRoutes } from './routes/poll'
import { userRoutes } from './routes/user'
import { guessRoutes } from './routes/guess'
import { gameRoutes } from './routes/game'
import { authRoutes } from './routes/auth'

const envSchema = {
	type: 'object',
	required: ['JWT_SECRET'],
	properties: {
		JWT_SECRET: {
			type: 'string'
	  	}
	}
}

const envOptions = {
	schema: envSchema,
	dotenv: true,
	data: process.env,
	confKey: 'config'
}

async function bootstrap() {
	const fastify = Fastify({
		logger: false,
		ignoreTrailingSlash: true
	})

	await fastify.register(fastifyEnv, envOptions)

	console.log('JWT_SECRET', process.env.JWT_SECRET)

	await fastify.register(cors, {
		origin: true
	})
	
	await fastify.register(jwt, {
		secret: process.env.JWT_SECRET as string
	})

	fastify.register(authRoutes)

	fastify.register(pollRoutes)
	
	fastify.register(userRoutes)
	
	fastify.register(guessRoutes)
	
	fastify.register(gameRoutes)

	await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()