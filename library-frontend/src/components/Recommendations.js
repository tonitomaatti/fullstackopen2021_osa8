import React from 'react'

const Recommendations = (props) => {
  
  if (!props.show) {
    return null
  }

  if (!props.currentUser) {
    return null
  }

  const books = props.books.filter(b => b.genres.includes(props.currentUser.favoriteGenre))

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