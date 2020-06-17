module.exports = {
  notes: async (user, __, { modules }) => {
    return await modules.Note.find({ author: user.id }).sort({ _id: -1 });
  },
  favorites: async (user, __, { modules }) => {
    return await modules.Note.find({ favoriteBy: user.id }).sort({ _id: -1 });
  }
};
