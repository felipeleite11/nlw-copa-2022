import { useEffect, useState } from 'react';
import { useToast, FlatList } from 'native-base';

import { GameProps, Game } from './Game';
import { Loader } from './Loader';

import { api } from '../services/api';
import { EmptyMyGuessList } from './EmptyMyGuessList';

interface Props {
  pollId: string;
  code: string
}

export function Guesses({ pollId, code }: Props) {
  const toast = useToast()

  const [games, setGames] = useState<GameProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')

  async function fetchGames() {
    try {
      setIsLoading(true)

      const { data } = await api.get(`polls/${pollId}/games`)

      setGames(data.games as GameProps[])
    } catch(e) {
      console.log(e)

      toast.show({
        title: 'Não foi possível carregar os palpites.',
        bgColor: 'red.600',
        placement: 'bottom'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        toast.show({
          title: 'Informe o placar do palpite.',
          bgColor: 'red.600',
          placement: 'bottom'
        })

        return
      }

      setIsLoading(true)

      await api.post(`polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: 'Seu palpite foi enviado. Boa Sorte!',
        bgColor: 'green.600',
        placement: 'bottom'
      })

      fetchGames()
    } catch(e) {
      console.log(e)

      toast.show({
        title: 'Não foi possível confirmar o palpite.',
        bgColor: 'red.600',
        placement: 'bottom'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [pollId])

  if(isLoading) {
    return <Loader />
  }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={handleGuessConfirm}
        />
      )}
      ListEmptyComponent={<EmptyMyGuessList code={code} />}
    />
  )
}
