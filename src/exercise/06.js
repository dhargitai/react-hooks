// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useEffect, useState} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [{pokemon, error, status}, setState] = useState(() => ({
    pokemon: null,
    error: null,
    status: pokemonName ? 'pending' : 'idle',
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

  switch (status) {
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />

    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />

    case 'rejected':
      throw new Error(error.message)

    case 'idle':
      return 'Submit a pokemon'

    default:
      throw new Error('This state of application should be impossible')
  }
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <img src="/img/pokemon/sad.jpg" alt="error happened" />
        {/* <button onClick={resetErrorBoundary}>Try again</button> */}
      </div>
    </div>
  )
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
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
