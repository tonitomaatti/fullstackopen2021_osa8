const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    me: User
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
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
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
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => Book.find({author: root.id}).countDocuments()
  },
  Mutation: {
    addBook: async (root, args, {currentUser}) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

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
    editAuthor: async (root, args, {currentUser}) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

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
    },
    createUser: (root, args) => {
      const user = new User({username: args.username, favoriteGenre: args.favoriteGenre})

      try {
        return user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username})

      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
      
      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
