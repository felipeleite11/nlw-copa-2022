import { createContext, ReactNode } from "react"

export interface UserProps {
	name: string
	avatarURL: string
}

export interface AuthContextProps {
	user: UserProps
	signIn: () => Promise<void>
}

interface AuthContextProviderProps {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	async function signIn() {
		console.log('LOGIN...')
	}

	return (
		<AuthContext.Provider value={{
			user: {
				name: 'Felipe Leite',
				avatarURL: 'https://github.com/felipeleite11.png'
			},
			signIn
		}}>
			{children}
		</AuthContext.Provider>
	)
}