/**
 * Get Room Object by id
 * @param {number} id
 * @returns {(RoomObject|null)} room object with the given id, or null if not
 *    found
 */
const getById = (id) => {
  return Game.getObjectById(id);
};

/**
 * Get room by name
 * @param {string} roomName
 * @returns {Room}
 */
const getRoom = (roomName) => {
  return Game.rooms[roomName];
};

module.exports = {
  getById,
  getRoom,
};
