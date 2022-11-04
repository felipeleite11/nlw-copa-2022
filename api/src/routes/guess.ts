import { FastifyInstance } from 'fastify'
import { date, z } from 'zod'

import { prisma } from '../lib/prisma'

import { authenticate } from '../plugins/authenticate'

export async function guessRoutes(fastify: FastifyInstance) {
	fastify.get('/guesses/count', async () => {
		const guessesCount = await prisma.guess.count()

		return { count: guessesCount }
	})

	fastify.post('/polls/:poll_id/games/:game_id/guesses', {
		onRequest: [authenticate]
	}, async (request, reply) => {
		const createGuessParams = z.object({
			poll_id: z.string(),
			game_id: z.string()
		})

		const createGuessBody = z.object({
			firstTeamPoints: z.number(),
			secondTeamPoints: z.number()
		})
		
		const { game_id, poll_id } = createGuessParams.parse(request.params)
		const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

		const participant = await prisma.participant.findUnique({
			where: {
				userId_pollId: {
					pollId: poll_id,
					userId: request.user.sub
				}
			}
		})

		if(!participant) {
			return reply.status(400).send({ message: 'Você não está parcipando deste bolão.' })
		}

		const guess = await prisma.guess.findUnique({
			where: {
				participantId_gameId: {
					gameId: game_id,
					participantId: participant.id
				}
			}
		})

		if(guess) {
			return reply.status(400).send({ message: 'Você já tem um palpite para este jogo.' })
		}

		const game = await prisma.game.findUnique({
			where: { id: game_id }
		})

		if(!game) {
			return reply.status(404).send({ message: 'O jogo não foi encontrado.' })
		}

		if(game.date < new Date()) {
			return reply.status(404).send({ message: 'Você não pode enviar palpites para jogos encerrados.' })
		}

		const createdGuess = await prisma.guess.create({
			data: {
				firstTeamPoints,
				secondTeamPoints,
				gameId: game_id,
				participantId: participant.id
			}
		})

		return reply.status(201).send()
	})
}