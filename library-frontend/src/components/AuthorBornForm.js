import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_AUTHOR_BORN, ALL_AUTHORS } from '../queries'

const AuthorBornForm = (props) => {
	
	const [name, setName] = useState('')
  const [setBornTo, setSetBornTo] = useState('')

  const [ changeBorn ] = useMutation(EDIT_AUTHOR_BORN, {
		refetchQueries: [ { query: ALL_AUTHORS } ]
	})

	if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
		changeBorn({ variables: { name, setBornTo } })

    setName('')
    setSetBornTo('')
  }

  return (
		<div>
			<h2>Set birthyear</h2>

			<form onSubmit={submit}>
				<div>
					name <input
						value={name}
						onChange={({ target }) => setName(target.value)}
					/>
				</div>
				<div>
					born <input
						type='number'
						value={setBornTo}
						onChange={({ target }) => setSetBornTo(parseInt(target.value))}
					/>
				</div>
				<button type='submit'>update author</button>
			</form>
		</div>
	)
}

export default AuthorBornForm