import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommendations = (props) => {
  const [getBooks, result] = useLazyQuery(ALL_BOOKS) 
  const [books, setBooks] = useState(null)

  useEffect(() => {
    if (props.currentUser) {
      getBooks({ variables: { genre: props.currentUser.favoriteGenre } })
    }
  }, [props.currentUser]) // eslint-disable-line

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  if (!props.show) {
    return null
  }

  if (!props.currentUser) {
    return null
  }

  if (!books) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{props.currentUser.favoriteGenre}</b></p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map(b =>
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

}

export default Recommendations