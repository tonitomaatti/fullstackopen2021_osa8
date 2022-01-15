const { ApolloServer, gql, UserInputError } = require('apollo-server')
const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const author = require('./models/author')

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`


const password = process.argv[2]
const MONGODB_URI = `mongodb+srv://fullstack2:${password}@cluster0.emt1a.mongodb.net/graphql?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filters = {}
      if (args.author) {
        const author = await Author.findOne({name: args.author}, '_id')
        if (author) {
          filters.author = author._id
        }
        else {
          filters.author = null
        }
      }
      if (args.genre) {
        filters.genres = {$in: [args.genre]}
      }

      return Book.find(filters).populate('author')
    },
    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: async (root) => Book.find({author: root.id}).countDocuments()
  },
  Mutation: {
    addBook: async (root, args) => {

      let author = await Author.findOne({ name: args.author})
      if (!author) {
        author = new Author({name: args.author})
      }

      const book = new Book({ ...args, author: author})
      
      try {
        await author.validate()
        await book.validate()
        await book.save()
        await author.save()
      }catch (error) {
        throw new UserInputError(error.message, {
          invaligArgs: args
        })
      }
      
      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({name: args.name})
      
      if (!author) {
        throw new UserInputError("Author not found")
      }

      author.born = args.setBornTo

      try {
        return await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
