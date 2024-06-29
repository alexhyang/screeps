const { obtainResource, transferTo } = require("./role.creepManager");
const { getStorage, getContainers } = require("./util.structureFinder");

const obtainFromOriginRoom = (creep, roomName) => {
  if (creep.room.name == roomName) {
    obtainResource(creep, ["storage"]);
  } else {
    let storage = getStorage(Game.rooms[roomName]);
    creep.moveTo(storage);
  }
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep, originRoomName = "W35N43", dstRoomName = "W36N43") {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      console.log(creep.name, "obtaining...");
      obtainFromOriginRoom(creep, originRoomName);
    } else {
      console.log(creep.name, "transferring...");
      let container = getContainers(Game.rooms[dstRoomName])[0];
      let storage = getStorage(Game.rooms[dstRoomName]);
      if (container.store.getFreeCapacity(RESOURCE_ENERGY) >= 400) {
        transferTo(creep, container);
      } else {
        transferTo(creep, storage);
      }
    }
  },
};