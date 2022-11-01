import { Center, Spinner, ISpinnerProps } from 'native-base'

export function Loader({ color = 'yellow.500' }: ISpinnerProps) {
	return (
		<Center flex={1} bg="gray.900">
			<Spinner color={color} />
		</Center>
	)
}