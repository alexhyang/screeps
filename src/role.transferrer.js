const { obtainResource, transferResource } = require("./role.creepManager");
const { getStorage, getContainers } = require("./util.structureFinder");

/**
 * Obtain energy from storage in the specified room
 * @param {Creep} creep
 * @param {string} originRoomName
 */
const obtainFromOriginRoom = (creep, originRoomName) => {
  if (creep.room.name == originRoomName) {
    obtainResource(creep, ["storage"]);
  } else {
    let storage = getStorage(Game.rooms[originRoomName]);
    creep.moveTo(storage);
  }
};

/**
 * Force the transferrer to move down if it is going to W36N44 room
 * @param {Creep} creep
 */
const avoidDangerZone = (creep) => {
  if (creep.room.name == "W36N43" && creep.pos.y <= 3) {
    creep.moveTo(BOTTOM);
  }
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep, originRoomName = "W35N43", dstRoomName = "W36N43") {
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      console.log(creep.name, "obtaining...");
      obtainFromOriginRoom(creep, originRoomName);
      avoidDangerZone(creep);
    } else {
      console.log(creep.name, "transferring...");
      let freeContainers = _.filter(
        getContainers(Game.rooms[dstRoomName]),
        (c) => c.store.getFreeCapacity(RESOURCE_ENERGY) >= 400
      );
      let storage = getStorage(Game.rooms[dstRoomName]);
      avoidDangerZone(creep);
      if (freeContainers.length > 0) {
        transferResource(creep, freeContainers[0]);
      } else {
        transferResource(creep, storage);
      }
    }
  },
};
