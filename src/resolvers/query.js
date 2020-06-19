module.exports = {
  notes: async (_, __, { modules }) => await modules.Note.find(),
  note: async (_, { id }, { modules }) => await modules.Note.findById(id),
  me: async (_, __, { modules, user }) => await modules.User.findById(user.id),
  users: async (_, __, { modules }) => await modules.User.find({}),
  user: async (_, { username }, { modules }) =>
    await modules.User.findOne({ username }),
  noteFeed: async (_, { cursor }, { modules }) => {
    const limit = 10;
    let hasNextPage = false;
    let cursorQuery = {};

    if (cursor) cursorQuery = { _id: { $lt: cursor } };

    let notes = await modules.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limit + 1);

    if (notes.length > limit) {
      hasNextPage = true;
      notes = notes.slice(0, -1);
    }

    const newCursor = notes[notes.length - 1]._id;

    return {
      notes,
      cursor: newCursor,
      hasNextPage
    };
  }
};
