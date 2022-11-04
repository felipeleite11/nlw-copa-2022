import { FastifyInstance } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'

import { prisma } from "../lib/prisma"

export async function pollRoutes(fastify: FastifyInstance) {
	fastify.get('/polls/count', async () => {
		const pollsCount = await prisma.poll.count()

		return { count: pollsCount  }
	})

	fastify.post('/polls', async (request, reply) => {
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

			await prisma.poll.create({
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
}