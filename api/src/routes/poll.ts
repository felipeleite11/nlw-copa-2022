import { FastifyInstance } from 'fastify'
import ShortUniqueId from 'short-unique-id'
import { z } from 'zod'

import { prisma } from "../lib/prisma"
import { authenticate } from '../plugins/authenticate'

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

			let userToCreate: any = {
				title,
				code
			}

			try {
				await request.jwtVerify()

				const ownerId = request.user.sub

				userToCreate.ownerId = ownerId
				userToCreate.participants = {
					create: {
						userId: ownerId
					}
				}
			} catch {}

			await prisma.poll.create({
				data: userToCreate
			})

			return reply.status(201).send(code)
		} catch(e) {
			return (e as Error).message
		}
	})

	fastify.post('/polls/:code/join', {
		onRequest: [authenticate]
	}, async (request, reply) => {
		const joinPollBody = z.object({
			code: z.string()
		})

		const { code } = joinPollBody.parse(request.params)
		
		const poll = await prisma.poll.findUnique({
			where: { code },
			include: {
				participants: {
					where: {
						userId: request.user.sub
					}
				}
			}
		})

		if(!poll) {
			return reply.status(400).send({
				message: 'Bolão não encontrado.'
			})
		}

		const isAlreadyParticipating = !!poll.participants.length

		if(isAlreadyParticipating) {
			return reply.status(400).send({
				message: 'Você já está participando deste bolão.'
			})
		}

		if(!poll.ownerId) {
			await prisma.poll.update({
				where: { id: poll.id },
				data: {
					ownerId: request.user.sub
				}
			})
		}

		await prisma.participant.create({
			data: {
				pollId: poll.id,
				userId: request.user.sub
			}
		})

		return reply.status(201).send()
	})

	fastify.get('/polls', {
		onRequest: [authenticate]
	}, async (request) => {
		const polls = await prisma.poll.findMany({
			where: {
				participants: {
					some: {
						userId: request.user.sub
					}
				}
			},
			include: {
				_count: {
					select: {
						participants: true
					}
				},
				participants: {
					select: {
						id: true,
						user: {
							select: {
								avatarURL: true
							}
						}
					},
					take: 4
				},
				owner: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})

		return { polls }
	})

	fastify.get('/polls/:id', {
		onRequest: [authenticate]
	}, async (request) => {
		const getPollParams = z.object({
			id: z.string()
		})

		const { id } = getPollParams.parse(request.params)

		const poll = await prisma.poll.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						participants: true
					}
				},
				participants: {
					select: {
						id: true,
						user: {
							select: {
								avatarURL: true
							}
						}
					},
					take: 4
				},
				owner: {
					select: {
						id: true,
						name: true
					}
				}
			}
		})

		return { poll }
	})
}