const ALL_USERS = [
  {
    id: 1,
    name: 'Benjie',
    website: 'https://graphile.org',
  },
];

exports.getUserById = async function(id) {
  return ALL_USERS.find(user => user.id === id);
}
