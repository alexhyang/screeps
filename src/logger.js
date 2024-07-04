const roomConfig = require("./dashboard");
const { printSquadInRoom } = require("./logger.squad");
const { getEnergyMeta, getDefenseMeta, getControllerMeta } = require("./Room");

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
      getEnergyMeta(roomName) +
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
  if (Memory.hostiles) {
    for (let i in Memory.hostiles) {
      console.log(Memory.hostiles[i].roomName, Memory.hostiles[i].time);
    }
  }
}

module.exports = {
  run: function () {
    console.log();
    for (let roomName in roomConfig) {
      printRoomSummary(roomName);
      printSquadInRoom(roomName);
    }
    printInvasionRecords();
  },
};
