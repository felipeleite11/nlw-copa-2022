import { FormEvent, useState } from 'react'
import { GetStaticProps } from 'next'
import toast from 'react-hot-toast'
import Image from 'next/image'

import logoImage from '../assets/logo.svg'
import mobileImage from '../assets/mobiles.png'
import avatarsImage from '../assets/avatars.png'
import iconCheck from '../assets/check.svg'
import { api } from '../lib/axios'

interface HomeProps {
	pollCount: number
	guessCount: number
	userCount: number
}

export default function Home({ pollCount, guessCount, userCount }: HomeProps) {
	const [pollTitle, setPollTitle] = useState('')

	async function handleCreatePoll(event: FormEvent) {
		event.preventDefault()

		try {
			const { data } = await api.post('polls', {
				title: pollTitle
			})

			await navigator.clipboard.writeText(data)

			toast.success('Bolão criado com sucesso! Código copiado para a área de transferência.')

			setPollTitle('')
		} catch(e) {
			toast.error('Falha ao criar o bolão.')
		}
	}

	return (
		<div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
			<main>
				<Image
					src={logoImage}
					alt="Logo do app."
				/>

				<h1 className="mt-14 text-white text-5xl font-bold leading-tight">Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

				<div className="mt-10 flex items-center gap-2">
					<Image src={avatarsImage} alt="" />

					<strong className="text-gray-100 text-xl">
						<span className="text-ignite-500">+{userCount}</span> pessoas já estão usando
					</strong>
				</div>

				<form
					onSubmit={handleCreatePoll} 
					className="mt-10 flex gap-2"
				>
					<input
						type="text"
						required
						placeholder="Qual nome do seu bolão?"
						className="flex-1 py-4 px-6 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
						onChange={e => {
							setPollTitle(e.target.value)
						}}
						value={pollTitle}
					/>

					<button
						type="submit"
						className="bg-yellow-500 py-4 px-6 rounded uppercase font-bold text-sm hover:bg-yellow-700 transition-colors"
					>
						Criar meu bolão
					</button>
				</form>

				<p className="text-gray-300 text-sm mt-4 leading-relaxed">
					Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
				</p>

				<div className="mt-10 pt-10 border-t border-gray-600 grid grid-cols-2 divide-x divide-gray-600 text-gray-100">
					<div className="flex justify-start gap-6">
						<Image src={iconCheck} alt="" />

						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{pollCount}</span>
							<span>Bolões criados</span>
						</div>
					</div>

					<div className="flex justify-end gap-6">
						<Image src={iconCheck} alt="" />

						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{guessCount}</span>
							<span>Palpites enviados</span>
						</div>
					</div>
				</div>
			</main>

			<Image
				src={mobileImage}
				alt="Dois celular exibindo telas do app."
				quality={100}
			/>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const [pollCount, guessCount, userCount] = await Promise.all([
		api.get('polls/count'),
		api.get('guesses/count'),
		api.get('users/count')
	])

	return {
		props: {
			pollCount: pollCount.data.count,
			guessCount: guessCount.data.count,
			userCount: userCount.data.count
		},
		revalidate: 10
	}
}