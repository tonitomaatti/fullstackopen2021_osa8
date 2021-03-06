import React, { useState, useEffect } from 'react'

const Recommendations = (props) => {
  const [books, setBooks] = useState(null)

  useEffect(() => {
    if (props.result) {
      if (props.result.data) {
        setBooks(props.result.data.allBooks)
      }
    }
  }, [props.result])

  if (!props.show) {
    return null
  }

  if (!props.currentUser) {
    return null
  }

  if (props.result.loading) {
    return <div>loading...</div>
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