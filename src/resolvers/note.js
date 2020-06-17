module.exports = {
  author: async (note, __, { modules }) => {
    return await modules.User.findById(note.author);
  },
  favoriteBy: async (note, __, { modules }) => {
    return await modules.User.find({ _id: { $in: note.favoriteBy } });
  }
};
