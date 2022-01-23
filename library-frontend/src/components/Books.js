
import React, { useState } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState('')

  if (!props.show) {
    return null
  }
  
  const genres = [ ...new Set(props.books.flatMap(b => b.genres))]
  
  let books = props.books
  if (genre) {
    books = props.books.filter(b => b.genres.includes(genre))
  }
  

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
        <button key={g} onClick={() => setGenre(g)}>{g}</button>)}
    </div>
  )
}

export default Books