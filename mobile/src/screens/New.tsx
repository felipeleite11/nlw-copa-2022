import { Heading, Text, VStack, useToast, ScrollView, Box } from 'native-base'
import { useState } from 'react'

import Logo from '../assets/logo.svg'

import { api } from '../services/api'

import { Header } from '../components/Header'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useNavigation } from '@react-navigation/native'

export function New() {
	const toast = useToast()

	const { navigate } = useNavigation()

	const [pollTitle, setPollTitle] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	async function handleCreatePoll() {
		try {
			if(!pollTitle.trim()) {
				return toast.show({
					title: 'Informe um título para o bolão.',
					placement: 'bottom',
					bgColor: 'red.500'
				})
			}

			setIsLoading(true)

			await api.post('polls', {
				title: pollTitle
			})
			
			toast.show({
				title: 'O bolão foi criado!',
				placement: 'bottom',
				bgColor: 'green.500'
			})
			
			setPollTitle('')

			navigate('polls')
		} catch(e) {
			console.log(e)

			toast.show({
				title: 'Não foi possível criar o bolão.',
				placement: 'bottom',
				bgColor: 'red.500'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<VStack flex={1} bgColor="gray.900">
			<Header title="Criar novo bolão" />

			<ScrollView mt={8} mx={5}>
				<Box alignItems="center">
					<Logo />
				</Box>

				<Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
					Crie seu próprio bolão da copa{'\n'}e compartilhe entre amigos!
				</Heading>

				<Input 
					mb={2}
					placeholder="Qual o nome do seu bolão?"
					onChangeText={setPollTitle}
					value={pollTitle}
				/>

				<Button 
					title="Criar meu bolão" 
					onPress={handleCreatePoll} 
					isLoading={isLoading} 
				/>

				<Text color="gray.200" fontSize="sm" textAlign="center" mt={4} mx={10}>
					Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
				</Text>
			</ScrollView>
		</VStack>
	)
}