const { obtainResource, transferResource } = require("./Creep");
const { getTeam } = require("./squad");
const { getStorage, getContainers } = require("./util.structureFinder");

/**
 * Obtain energy from storage in the specified room
 * @param {Creep} creep
 * @param {string} fromRoomName
 */
const obtainFromRoom = (creep, fromRoomName) => {
  if (creep.memory.fromRoom) {
    fromRoomName = creep.memory.fromRoom;
  }
  if (creep.room.name == fromRoomName) {
    switch (fromRoomName) {
      case "W35N43":
        obtainResource(creep, ["container", "storage"]);
      default:
        obtainResource(creep, ["storage"]);
    }
  } else {
    let container = getContainers(Game.rooms[fromRoomName])[0];
    creep.moveTo(container);
  }
};

/**
 * Find all free containers to transfer energy to
 * @param {Creep} creep
 * @param {string} roomName
 * @returns {StructureContainer[]} an array of containers that has enough free
 *     capacity for transferrer, or empty array if not found
 */
const getFreeContainersToTransfer = (creep, roomName) => {
  return _.filter(
    getContainers(Game.rooms[roomName]),
    (c) => c.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getCapacity()
  );
};

/**
 * Transfer energy to room
 * @param {Creep} creep
 * @param {string} toRoomName
 */
const transferToRoom = (creep, toRoomName) => {
  if (creep.memory.dstRoom) {
    toRoomName = creep.memory.dstRoom;
  }
  let storage = getStorage(Game.rooms[toRoomName]);
  switch (toRoomName) {
    case "W36N43":
      let freeContainers = getFreeContainersToTransfer(creep, toRoomName);
      if (freeContainers.length > 0) {
        transferResource(creep, freeContainers[0]);
      } else {
        transferResource(creep, storage);
      }
    default:
      transferResource(creep, storage);
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

/**
 * Convert to harvester in specified room when no harvester present
 * @param {Creep} creep
 * @returns {boolean} true if conversion is successful, false otherwise
 */
const convertToHarvesterWhenNecessary = (creep, roomName) => {
  if (
    creep.room.name == roomName &&
    getTeam("harvester", creep.room.name).length == 0
  ) {
    creep.memory = { role: "harvester" };
    return true;
  }
  return false;
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep, fromRoomName = "W34N43", toRoomName = "W35N43") {
    avoidDangerZone(creep);
    if (convertToHarvesterWhenNecessary(creep, "W34N43")) {
      return;
    }

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
      console.log(creep.name, "obtaining...   ", creep.pos);
      obtainFromRoom(creep, fromRoomName);
    } else {
      console.log(creep.name, "transferring...", creep.pos);
      transferToRoom(creep, toRoomName);
    }
  },
};
