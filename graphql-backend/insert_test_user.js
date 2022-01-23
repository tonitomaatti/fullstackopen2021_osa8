const mongoose = require('mongoose')
const User = require('./models/user')


const password = process.argv[2]
const MONGODB_URI = `mongodb+srv://fullstack2:${password}@cluster0.emt1a.mongodb.net/graphql?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  }
)

const user = new User({
    username: 'test_user',
    favoriteGenre: 'refactoring'
})

user.save()

//mongoose.connection.close()
