import { useState, useEffect } from 'react'
import { HStack, useToast, VStack } from "native-base"
import { useRoute } from "@react-navigation/native"
import { Share } from 'react-native'

import { Header } from "../components/Header"
import { Loader } from '../components/Loader'
import { PollProps } from '../components/PollCard'
import { PollHeader } from '../components/PollHeader'
import { EmptyMyPollList } from '../components/EmptyMyPoolList'
import { Option } from '../components/Option'
import { Guesses } from '../components/Guesses'

import { api } from '../services/api'

interface RouteParams {
	id: string
}

export function Details() {
	const route = useRoute()
	const { id } = route.params as RouteParams

	const toast = useToast()
	
	const [isLoading, setIsLoading] = useState(true)
	const [selectedOption, setSelectedOption] = useState<'guesses'|'ranking'>('guesses')
	const [poll, setPoll] = useState<PollProps>({} as PollProps)

	async function fetchPollDetails() {
		try {
			setIsLoading(true)

			const { data } = await api.get(`polls/${id}`)

			setPoll(data.poll)
		} catch(e) {
			toast.show({
				title: 'Não foi possível carregar as informações do bolão.',
				placement: 'bottom',
				bgColor: 'red.600'
			})
		} finally {
			setIsLoading(false)
		}
	}

	async function handleShare() {
		await Share.share({
			message: poll.code,
			title: poll.title
		})
	}

	useEffect(() => {
		fetchPollDetails()
	}, [id])

	if(isLoading) {
		return <Loader />
	}

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header 
				title={poll.title}
				showBackButton
				showShareButton
				onShare={handleShare}
			/>

			{poll.participants.length ? (
				<VStack flex={1} px={5}>
					<PollHeader data={poll} />

					<HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
						<Option 
							title="Seus palpites" 
							isSelected={selectedOption === 'guesses'}
							onPress={() => setSelectedOption('guesses')}
						/>

						<Option 
							title="Ranking do grupo" 
							isSelected={selectedOption === 'ranking'}
							onPress={() => setSelectedOption('ranking')}
						/>
					</HStack>

					<Guesses pollId={poll.id} code={poll.code} />
				</VStack>
			) : (
				<EmptyMyPollList code={poll.code} />
			)}
		</VStack>
	)
}