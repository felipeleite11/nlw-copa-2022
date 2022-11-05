import { useState, useCallback } from 'react'
import { VStack, Icon, useToast, FlatList } from 'native-base'
import { Octicons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { Header } from '../components/Header'
import { Loader } from '../components/Loader'
import { Button } from '../components/Button'

import { api } from '../services/api'

import { PollCard, PollProps } from '../components/PollCard'
import { EmptyPollList } from '../components/EmptyPollList'

export function Polls() {
	const [polls, setPolls] = useState<PollProps[]>([])
	const [isLoading, setIsLoading] = useState(true)

	const { navigate } = useNavigation()

	const toast = useToast()

	async function fetchPolls() {
		try {
			setIsLoading(true)

			const { data } = await api.get<{ polls: PollProps[] }>('polls')

			setPolls(data.polls)
		} catch(e) {
			console.log(e)

			toast.show({
				title: 'Erro ao carregar os bolões.',
				placement: 'bottom',
				bgColor: 'red.600'
			})
		} finally {
			setIsLoading(false)
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchPolls()
		}, [])
	)

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Meus bolões" />

			<VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
				<Button 
					title="Buscar bolão por código" 
					leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
					onPress={() => { navigate('find') }}
				/>
			</VStack>

			{isLoading ? (
				<Loader />
			) : (
				<FlatList 
					data={polls}
					keyExtractor={item => item.id}
					renderItem={({ item }) => (
						<PollCard 
							data={item} 
							onPress={() => navigate('details', { id: item.id })}
						/>
					)}
					px={5}
					showsVerticalScrollIndicator={false}
					_contentContainerStyle={{
						pb: 10
					}}
					ListEmptyComponent={<EmptyPollList />}
				/>
			)}
		</VStack>
	)
}