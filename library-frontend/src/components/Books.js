
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState('')

  const [getBooks, result] = useLazyQuery(ALL_BOOKS) 
  const [books, setBooks] = useState(props.books)

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks)
    }
  }, [result])

  const filterByGenre = (genre) => {
    getBooks({ variables: { genre: genre } })
    setGenre(genre)
  }

  if (!props.show) {
    return null
  }
  
  const genres = [ ...new Set(props.books.flatMap(b => b.genres))]

  return (
    <div>
      <h2>books</h2>
      {genre ? <p>in genre <b>{genre}</b></p> : null}

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
      {genres.map(g =>
        <button key={g} onClick={() => filterByGenre(g)}>{g}</button>)}
    </div>
  )
}

export default Books