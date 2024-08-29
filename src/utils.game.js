/**
 * Get Room Object by id
 * @param {number} id
 * @returns {(RoomObject|null)} room object with the given id, or null if not
 *    found
 */
const getById = (id) => {
  return Game.getObjectById(id);
};

module.exports = {
  getById,
};
