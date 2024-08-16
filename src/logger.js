const { getMyRooms } = require("./configAPI");
const { printSquadInRoom } = require("./logger.squad");
const {
  getResourceMeta,
  getDefenseMeta,
  getControllerMeta,
} = require("./Room");

/**
 * Print summary of a room with the given name
 * @param {string} roomName
 */
const printRoomSummary = (roomName) => {
  console.log(
    "=== " +
      (Game.time % 1000000) +
      " " +
      roomName +
      " // " +
      getResourceMeta(roomName) +
      " | " +
      getDefenseMeta(roomName) +
      " | " +
      getControllerMeta(roomName) +
      " ==="
  );
};

/**
 * Print invasion records
 */
function printInvasionRecords() {
  let invasionRecords = {};
  if (Memory.hostiles) {
    for (let i in Memory.hostiles) {
      let { roomName, time } = Memory.hostiles[i];
      if (!(roomName in invasionRecords)) {
        invasionRecords[roomName] = [];
      }
      invasionRecords[roomName].push(time);
    }
  }
  for (roomName in invasionRecords) {
    console.log(roomName, invasionRecords[roomName].join(" "));
  }
}

module.exports = {
  run: function () {
    console.log();
    getMyRooms().forEach(printRoomSummary);
    printInvasionRecords();
  },
};
