const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');

const gavatar = require('../util/gravatar');

require('dotenv').config();

const chechUserAuth = (Model, user, id) => {
  if (!user) {
    throw new AuthenticationError('you must be signed to update notes');
  }

  const note = Model.findById(id);
  if (note && String(note.author) !== user.id) {
    throw new AuthenticationError('permission denied');
  }
};

module.exports = {
  newNote: async (_, { content }, { modules, user }) => {
    if (!user)
      throw new AuthenticationError('You must be signed in to create a note');

    return await modules.Note.create({
      content,
      author: mongoose.Types.ObjectId(user.id)
    });
  },
  updateNote: async (_, { id, content }, { modules, user }) => {
    try {
      chechUserAuth(modules.Note, user, id);

      return await modules.Note.findOneAndUpdate(
        { _id: id },
        { $set: { content } },
        { new: true }
      );
    } catch (err) {
      throw new Error(err);
    }
  },
  deleteNote: async (_, { id }, { modules, user }) => {
    try {
      chechUserAuth(modules.Note, user, id);

      await modules.Note.findOneAndRemove({ _id: id });
      return true;
    } catch (err) {
      return false;
    }
  },
  signup: async (_, { username, email, password }, { modules }) => {
    const trimedUsername = username.trim().toLowerCase();
    const trimedEmail = email.trim().toLowerCase();
    const hash = await bcrypt.hash(password, 10);
    const avatar = gavatar(email);

    try {
      const user = await modules.User.create({
        username: trimedUsername,
        email: trimedEmail,
        password: hash,
        avatar
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Error creating account');
    }
  },
  singin: async (_, { username, email, password }, { modules }) => {
    const trimEmail = email && email.trim().toLowerCase();
    const trimUsername = username && username.trim().toLowerCase();

    const user = await modules.User.findOne({
      $or: [{ email: trimEmail }, { username: trimUsername }]
    });
    console.log(user);

    if (!user) throw new AuthenticationError('Error singning in');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AuthenticationError('Error signing in');

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (_, { id }, { modules, user }) => {
    if (!user) throw new AuthenticationError('You should be logged in first.');

    const noteCheck = await modules.Note.findById(id);
    const hasUser = noteCheck.favoriteBy || [];

    console.log(hasUser);

    if (hasUser.includes(user.id)) {
      return await modules.Note.findOneAndUpdate(
        id,
        {
          $pull: { favoriteBy: user.id },
          $inc: { favoriteCount: -1 }
        },
        {
          new: true
        }
      );
    } else {
      return await modules.Note.findOneAndUpdate(
        id,
        {
          $push: { favoriteBy: user.id },
          $inc: { favoriteCount: 1 }
        },
        {
          new: true
        }
      );
    }
  }
};
