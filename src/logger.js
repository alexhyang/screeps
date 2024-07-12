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
  let LEFT_ROOM = "W36N43";
  let RIGHT_ROOM = "W35N43";
  let rightRoom = [];
  let leftRoom = [];
  if (Memory.hostiles) {
    for (let i in Memory.hostiles) {
      let { roomName, time } = Memory.hostiles[i];
      switch (roomName) {
        case LEFT_ROOM:
          leftRoom.push(time);
          break;
        case RIGHT_ROOM:
          rightRoom.push(time);
          break;
        default:
          break;
      }
    }
  }
  if (leftRoom.length > 0) {
    console.log(LEFT_ROOM, leftRoom.join(" "));
  }
  if (rightRoom.length > 0) {
    console.log(RIGHT_ROOM, rightRoom.join(" "));
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
