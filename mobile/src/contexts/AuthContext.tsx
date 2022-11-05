import { createContext, ReactNode, useState, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'

import { api } from '../services/api'

WebBrowser.maybeCompleteAuthSession()

export interface UserProps {
	name: string
	avatarURL: string
}

export interface AuthContextProps {
	user: UserProps
	signIn: () => Promise<void>
	isUserLoading: boolean
}

interface AuthContextProviderProps {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId: process.env.OAUTH_CLIENT_ID,
		redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
		scopes: ['profile', 'email']
	})

	const [isUserLoading, setIsUserLoading] = useState(false)
	const [user, setUser] = useState<UserProps>({} as UserProps)

	async function signIn() {
		try {
			setIsUserLoading(true)

			await promptAsync()
		} catch(e) {
			console.log(e)

			throw e
		} finally {
			setIsUserLoading(false)
		}
	}

	async function signInWithGoogle(access_token: string) {
		try {
			setIsUserLoading(true)

			const { data: tokenResponse } = await api.post('users', { access_token })

			api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.token}`

			const { data: userInfoResponse } = await api.get('me')

			setUser(userInfoResponse.user)
		} catch(e) {
			console.log(e)

			throw e
		} finally {
			setIsUserLoading(false)
		}
	}

	useEffect(() => {
		if(response?.type === 'success' && response.authentication?.accessToken) {
			signInWithGoogle(response.authentication.accessToken)
		}
	}, [response])

	return (
		<AuthContext.Provider value={{
			user,
			signIn,
			isUserLoading
		}}>
			{children}
		</AuthContext.Provider>
	)
}
