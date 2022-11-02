import Fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'

const prisma = new PrismaClient({
	log: ['query']
})

async function bootstrap() {
	const fastify = Fastify({
		logger: true
	})

	await fastify.register(cors, {
		origin: true
	})

	fastify.get('/pools/count', async () => {
		const poolsCount = await prisma.pool.count()

		return { count: poolsCount  }
	})

	fastify.post('/pools', async (request, reply) => {
		try {
			const createPoolBody = z.object({
				title: z.string({
					required_error: 'O bolão deve ter um nome.',
					invalid_type_error: 'O bolão deve ter um nome.'
				}).min(1, {
					message: 'O bolão deve ter um nome.'
				})
			})

			const { title } = createPoolBody.parse(request.body)

			const uniqueIdGenerate = new ShortUniqueId({ length: 6 })

			const code = String(uniqueIdGenerate()).toUpperCase()

			await prisma.pool.create({
				data: {
					title,
					code
				}
			})

			return reply.status(201).send(code)
		} catch(e) {
			return (e as Error).message
		}
	})

	fastify.get('/users/count', async () => {
		const usersCount = await prisma.user.count()

		return { count: usersCount }
	})

	fastify.get('/guesses/count', async () => {
		const guessesCount = await prisma.guess.count()

		return { count: guessesCount }
	})

	await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

bootstrap()