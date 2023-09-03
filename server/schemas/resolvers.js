const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    //get a single user by either their id or their username
    getSingleUser: async (_, { user = null, params }) => {
      const foundUser = await User.findOne({
        $or: [
          { _id: user ? user._id : params.id },
          { username: params.username },
        ],
      });
      return foundUser;
    },
  },
  Mutation: {
    // create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
    createUser: async (_, { body }) => {
      const user = await User.create({ body });
      const token = signToken(user);

      return { token, user };
    },

    // login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
    // {body} is destructured req.body
    login: async (_, { body }) => {
      const user = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }],
      });

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
    // user comes from `req.user` created in the auth middleware function
    saveBook: async (_, { user, body }) => {
      console.log(user);
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedBooks: body } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },
  },
};

module.exports = resolvers;
