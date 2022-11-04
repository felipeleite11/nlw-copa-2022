import { NativeBaseProvider, StatusBar } from 'native-base'

import { useFonts, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto'

import { Loader } from './src/components/Loader'

import { AuthContextProvider } from './src/contexts/AuthContext'
import { Routes } from './src/routes'

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

				{isLoadedFonts ? <Routes /> : <Loader /> }
			</AuthContextProvider>
		</NativeBaseProvider>
	)
}
