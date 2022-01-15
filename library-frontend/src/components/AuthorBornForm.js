import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { EDIT_AUTHOR_BORN, ALL_AUTHORS } from '../queries'

const AuthorBornForm = (props) => {

	
	const [name, setName] = useState(props.authors[0].name)
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
    setSetBornTo('')
  }

  return (
		<div>
			<h2>Set birthyear</h2>

			<form onSubmit={submit}>
				<div>
					<label>
						Name
						<select value={name} onChange={({ target }) => setName(target.value)}>
							{props.authors.map(a =>
								<option key={a.id} value={a.name}>{a.name}</option>
							)}
						</select>
					</label>
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