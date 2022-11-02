import { NativeBaseProvider, StatusBar } from 'native-base'

import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto'

import { Loader } from './src/components/Loader'

import { SignIn } from './src/screens/SignIn'

import { AuthContextProvider } from './src/contexts/AuthContext'

export default function App() {
	const [isLoadedFonts] = useFonts({
		Roboto_400Regular, 
		Roboto_500Medium, 
		Roboto_700Bold
	})

	return (
		<NativeBaseProvider>
			<AuthContextProvider>
				<StatusBar
					barStyle="light-content" 
					backgroundColor="transparent"
					translucent
				/>

				{isLoadedFonts ? (
					<SignIn />
				) : (
					<Loader />
				)}
			</AuthContextProvider>
		</NativeBaseProvider>
	)
}
