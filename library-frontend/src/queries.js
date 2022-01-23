import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

export const EDIT_AUTHOR_BORN = gql`
	mutation EditAuthor($name: String!, $setBornTo: Int!) {
  	editAuthor(
			name: $name,
			setBornTo: $setBornTo
		) {
    	id
  	}
	}
`

export const ALL_BOOKS = gql`
  query AllBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      published
      id
      genres
      author {
        name
        id
        born
        bookCount
      }
    }
  }
`

export const CREATE_BOOK = gql`
	mutation AddBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
			published: $published,
			author: $author,
			genres: $genres
		) {
			title
			published
			author {
        name
        id
        born
        bookCount
      }
			genres
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const CURRENT_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`