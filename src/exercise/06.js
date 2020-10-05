// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState(() => ({
    pokemon: null,
    error: null,
    status: 'idle',
  }))

  useEffect(() => {
    setState({
      error: null,
      pokemon: null,
    })

    if (!pokemonName) {
      setState({
        status: 'idle',
      })
      return
    }

    setState({
      status: 'pending',
    })

    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({
          pokemon,
          status: 'resolved',
        })
      })
      .catch(error => {
        setState({
          error,
          status: 'rejected',
        })
      })
  }, [pokemonName])

  switch (state.status) {
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />

    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />

    case 'rejected':
      return (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
        </div>
      )

    default:
      return 'Submit a pokemon'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
