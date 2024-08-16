const configW35N43 = require("./config.W35N43");
const configW36N43 = require("./config.W36N43");
const configW34N43 = require("./config.W34N43");
const configW38N43 = require("./config.W38N43");
const configW37N43 = require("./config.W37N43");

const W35N43 = "W35N43";
const W36N43 = "W36N43";
const W34N43 = "W34N43";
const W38N43 = "W38N43";
const W37N43 = "W37N43";

/**
 * Get names of my rooms
 * @returns an array of names of my rooms
 */
const getMyRooms = () => {
  return [W35N43, W36N43, W34N43, W38N43, W37N43];
};

/**
 * Get config of room with given name
 * @param {string} myRoomName
 * @returns {(RoomConfig|undefined)} configuration object of the specified
 *    room, undefined if room not found
 */
const getRoomConfig = (myRoomName) => {
  switch (myRoomName) {
    case W35N43:
      return configW35N43;
    case W36N43:
      return configW36N43;
    case W34N43:
      return configW34N43;
    case W38N43:
      return configW38N43;
    case W37N43:
      return configW37N43;
    default:
  }
};

module.exports = {
  getMyRooms,
  getRoomConfig,
};
