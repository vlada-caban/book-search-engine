const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    //get a single user by either their id or their username
    getSingleUser: async (_, args) => {
      const foundUser = await User.findOne({ email: args.email });
      return foundUser;
    },

    me: async (_, __, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    createUser: async (_, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    // {email, password} are destructured args
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email: email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    // save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
    // user comes from context
    saveBook: async (_, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args.bookToSave } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } 

      throw AuthenticationError;
      
    },

    // remove a book from `savedBooks`
    //user comes from context
    deleteBook: async (_, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookToDelete } } },
          { new: true }
        );

        return updatedUser;
      }
      
      throw AuthenticationError;
    
    },
  },
};

module.exports = resolvers;
