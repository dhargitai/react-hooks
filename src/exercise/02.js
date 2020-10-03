// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useEffect, useState} from 'react'

function useLocalStorageState(
  keyName,
  initialValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [value, setValue] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(keyName)
    if (localStorageValue) {
      return deserialize(localStorageValue)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  const previousKeyRef = React.useRef(keyName)

  useEffect(() => {
    const previousKeyName = previousKeyRef.current
    if (previousKeyName !== keyName) {
      window.localStorage.removeItem(previousKeyName)
      previousKeyRef.current = keyName
    }
    window.localStorage.setItem(keyName, serialize(value))
  }, [keyName, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  // const [name, setName] = React.useState(
  //   () => window.localStorage.getItem('name') || initialName,
  // )
  const [name, setName] = useLocalStorageState('name', initialName)

  const defaultPersonalData = {initial: 'dr', age: 34}

  const [key, setKey] = useState('personalData')

  const [personalData, setPersonalData] = useLocalStorageState(
    key,
    defaultPersonalData,
  )

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // useEffect(() => {
  // window.localStorage.setItem('name', name)
  // }, [name])

  function handleChange(event) {
    setName(event.target.value)
  }

  function handlePersonalDataChange(event) {
    setPersonalData({
      ...personalData,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}

      <form>
        <label htmlFor="storageKey">Storage key name</label>
        <input
          type="text"
          name="storageKey"
          id="storageKey"
          value={key}
          onChange={event => setKey(event.target.value)}
        />

        <label htmlFor="initial">Initial</label>
        <input
          type="text"
          name="initial"
          id="initial"
          value={personalData.initial}
          onChange={handlePersonalDataChange}
        />

        <label htmlFor="age">Age</label>
        <input
          type="number"
          name="age"
          id="age"
          value={personalData.age}
          onChange={handlePersonalDataChange}
        />
      </form>
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
