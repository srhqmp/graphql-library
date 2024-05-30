const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
require("dotenv").config();

const Book = require("./models/book.js");
const Author = require("./models/author.js");

const MONGODB_URI = process.env.MONGODB_URI;

console.log("Connecting to ", MONGODB_URI);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB: ", error);
  });

const typeDefs = `
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
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
  }

  type Mutation {
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

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let query = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        query.author = author ? author._id : [];
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }

      return Book.find(query).populate("author");
    },
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }

      const book = new Book({ ...args, author: author._id });
      await book.save();

      return book.populate("author");
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      await author.save();
      return author;
    },
  },
  Book: {
    author: async (root) => Author.findById(root.author),
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name });
      const books = await Book.find({ author: author.id });
      return books.length;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
