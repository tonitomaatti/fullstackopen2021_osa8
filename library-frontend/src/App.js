import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery, useSubscription, useApolloClient} from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import AuthorBornForm from './components/AuthorBornForm'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

import { ALL_AUTHORS, ALL_BOOKS, CURRENT_USER, BOOK_ADDED } from './queries'


const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [page, setPage] = useState('authors')
  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const [getCurrentUser, resultCurrentUser] = useLazyQuery(CURRENT_USER)
  const [currentUser, setCurrentUser] = useState(null)

  const [getUserGenreBooks, resultUserGenreBooks] = useLazyQuery(ALL_BOOKS) 

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      window.alert(
        "New Book Has Been Added!\n" + 
        subscriptionData.data.bookAdded.title)
    }
  })

  useEffect(() => {
    if (resultCurrentUser.data) {
      setCurrentUser(resultCurrentUser.data.me)
    } else {
      setCurrentUser(null)
    }
  }, [resultCurrentUser])

  if (resultAuthors.loading || resultBooks.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const displayRecommend = () => {
    getUserGenreBooks({ variables: { genre: currentUser.favoriteGenre } })
    setPage('recommend')
  }

  return (
    <div>  
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : null}
        {token ? null : <button onClick={() => setPage('login')}>login</button>}
        {token ? <button onClick={() => displayRecommend()}>recommend</button> : null}
        {token ? <button onClick={logout}>logout</button> : null}
        <Notify errorMessage={errorMessage} />
      </div>
      
      <Authors
        authors={resultAuthors.data.allAuthors}
        show={page === 'authors'}
      />

      <AuthorBornForm
        authors={resultAuthors.data.allAuthors}
        show={page === 'authors'}
      />

      <Books
        books={resultBooks.data.allBooks}
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <LoginForm 
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
        setError={notify}
        getCurrentUser={getCurrentUser}
      />

      <Recommendations
        currentUser={currentUser}
        result={resultUserGenreBooks}
        show={page === 'recommend'}
      />


    </div>
  )
}

export default App