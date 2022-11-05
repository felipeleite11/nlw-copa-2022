import { useState } from 'react'
import { Heading, Icon, useToast, VStack } from 'native-base'
import { Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'

import { api } from '../services/api'

export function Find() {
	const toast = useToast()

	const { navigate } = useNavigation()

	const [code, setCode] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	async function handleJoinPoll() {
		try {
			if(!code) {
				return toast.show({
					title: 'Informa um código',
					placement: 'bottom',
					bgColor: 'red.600'
				})
			}

			await api.post(`polls/${code}/join`)

			toast.show({
				title: 'Você entrou no bolão e já pode fazer seus palpites.',
				placement: 'bottom',
				bgColor: 'green.600'
			})

			setCode('')

			navigate('polls')
		} catch(e) {
			let message = 'Não foi possível encontrar o bolão.'

			if(e.response?.data?.message) {
				message = e.response.data.message
			}

			toast.show({
				title: message,
				placement: 'bottom',
				bgColor: 'red.500'
			})

			setIsLoading(false)
		}
	}

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Buscar por código" showBackButton />

			<VStack mt={8} mx={5} alignItems="center">
				<Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
					Encontre um bolão através de{'\n'}seu código único
				</Heading>

				<Input 
					mb={2}
					placeholder="Qual o código do bolão?"
					value={code}
					onChangeText={setCode}
					autoCapitalize="characters"
				/>

				<Button 
					title="Buscar bolão" 
					leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
					isLoading={isLoading}
					onPress={handleJoinPoll}
				/>
			</VStack>
		</VStack>
	)
}