const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const Book = require("./models/book.js");
const Author = require("./models/author.js");
const User = require("./models/user.js");

const resolvers = {
  Query: {
    dummy: () => 0,
    me: (root, args, context) => {
      return context.currentUser;
    },
    allGenres: async () => {
      const books = await Book.find({});
      const genres = books.flatMap((b) => b.genres.flatMap((g) => g));
      return [...new Set(genres)];
    },
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
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Failed to create a user", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError(
            "Author name must be unique and at least 4 characters long",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.author,
                error,
              },
            }
          );
        }
      }

      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(
          "Book title must be unique and at least 5 characters long",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
              error,
            },
          }
        );
      }

      return book.populate("author");
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

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

module.exports = resolvers;
