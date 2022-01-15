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
  query {
    allBooks {
      id
      title
      published
      author
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
			author
			genres
    }
  }
`