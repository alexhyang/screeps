const { getMyRooms } = require("./configAPI");
const { moveToPosition } = require("./Creep");
const {
  obtainResource,
  transferResource,
  pickupDroppedResources,
  withdrawFromFriendlyTombstone,
  withdrawFromHostileTombstone,
} = require("./CreepResource");
const { getTeam } = require("./squad");
const {
  getFreeCapacity,
  getCapacity,
  storeIsEmpty,
} = require("./util.resourceManager");
const {
  getStorage,
  getContainers,
  getController,
} = require("./util.structureFinder");

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
        break;
      case "W36N43":
        obtainResource(creep, ["link"]);
        break;
      case "W35N44":
        obtainResource(creep, ["droppedResources", "tombstone"]);
        break;
      case "W38N43":
        obtainResource(creep, ["container", "storage"]);
        break;
      default:
        obtainResource(creep, ["storage"]);
    }
  } else {
    let controller = getController(Game.rooms[fromRoomName]);
    if (controller) {
      creep.moveTo(controller);
    } else {
      console.log("Cannot obtain resource from", fromRoomName);
    }
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
    (c) => getFreeCapacity(c) >= getCapacity(creep)
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
    // case "W37N43":
    //   let freeContainers2 = getFreeContainersToTransfer(creep, toRoomName);
    //   if (freeContainers2.length > 0) {
    //     transferResource(creep, freeContainers2[1]);
    //   } else {
    //     transferResource(creep, storage);
    //   }
    default:
      if (storage) {
        transferResource(creep, storage);
      }
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
  run: function (creep, fromRoomName = "W35N43", toRoomName = "W36N43") {
    if (getMyRooms(fromRoomName).includes(fromRoomName)) {
      avoidDangerZone(creep);
      if (convertToHarvesterWhenNecessary(creep, "W36N43")) {
        return;
      }

      if (storeIsEmpty(creep)) {
        console.log(
          creep.name,
          creep.ticksToLive,
          "obtaining...   ",
          creep.pos
        );
        obtainFromRoom(creep, fromRoomName);
      } else {
        console.log(
          creep.name,
          creep.ticksToLive,
          "transferring...",
          creep.pos
        );
        transferToRoom(creep, toRoomName);
      }
    } else {
      moveToPosition(creep, 25, 25, fromRoomName);
      pickupDroppedResources(creep) ||
        withdrawFromHostileTombstone(creep) ||
        withdrawFromFriendlyTombstone(creep);
    }
  },
};
