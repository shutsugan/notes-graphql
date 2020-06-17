module.exports = {
  notes: async (_, __, { modules }) => await modules.Note.find(),
  note: async (_, { id }, { modules }) => await modules.Note.findById(id),
  me: async (_, __, { modules, user }) => await modules.User.findById(user.id),
  users: async (_, __, { modules }) => await modules.User.find({}),
  user: async (_, { username }, { modules }) =>
    await modules.User.findOne({ username })
};
