import { Text, Button as NativeButton, IButtonProps } from 'native-base'

interface ButtonProps extends IButtonProps {
	title: string
	type?: 'PRIMARY' | 'SECONDARY'
}

export function Button({ title, type = 'PRIMARY', ...props }: ButtonProps) {
	return (
		<NativeButton 
			w="full"
			h={12}
			rounded="sm"
			fontSize="md"
			bg={type === 'PRIMARY' ? 'yellow.500' : 'red.500'}
			_pressed={{
				bg: type === 'PRIMARY' ? 'yellow.600' : 'red.600'
			}}
			_loading={{
				_spinner: {
					color: 'black'
				}
			}}
			{...props}
		>
			<Text 
				textTransform="uppercase"
				fontFamily="heading"
				color={type === 'PRIMARY' ? 'black' : 'white'}
				fontSize="sm"
			>
				{title}
			</Text>
		</NativeButton>
	)
}