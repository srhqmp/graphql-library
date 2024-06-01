const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    bookCount: Int!
    id: ID!
    born: Int
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]
    id: ID!
  }

  type Query {
    dummy: Int
    me: User
    allGenres: [String]
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
  }

  type Mutation {
    createUser(
        username: String!
        favoriteGenre: String!
    ):User
    login(
        username: String!
        password: String!
    ):Token
    addBook(
        title: String!
        author: String!
        published: Int!
        genres: [String!]
    ):Book
    editAuthor(
        name: String!
        setBornTo: Int!
    ):Author
  }
`;

module.exports = typeDefs;
