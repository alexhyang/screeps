const {
  structureHasResource,
  getStructures,
  structureHasFreeCapacity,
} = require("./util.structureFinder");

const HARVEST_STROKE = "#ffaa00";
const WITHDRAW_STROKE = "#ffaa00";
const TRANSFER_STOKE = "#ffffff";

/**
 * Calculate the speed of the given creep
 * @param {Creep} creep
 * @returns speed of the creep in ticks per square
 */
const getSpeed = (creep) => {
  // TODO: finish the implementation later
  return 0;
};

/**
 * Find the closest structure of type specified by the find constant
 * @param {Creep} creep
 * @param {number} structureType the STRUCTURE_* constant
 * @returns {Structure} the closest structure with specified type,
 *    or undefined if not found
 */
const findClosestStructureWithResource = (creep, structureType) => {
  let structures = _.filter(
    getStructures(structureType, creep.room),
    structureHasResource
  );
  return creep.pos.findClosestByRange(structures);
};

/**
 * Find the closest structure of type specified by the find constant
 * @param {Creep} creep
 * @param {number} structureType the STRUCTURE_* constant
 * @returns {Structure} the closest structure with specified type,
 *    or undefined if not found
 */
const findClosestStructureWithFreeCapacity = (creep, structureType) => {
  let structures = _.filter(
    getStructures(structureType, creep.room),
    structureHasFreeCapacity
  );
  return creep.pos.findClosestByRange(structures);
};

/**
 * Find the closest dying object of type specified by the find constant,
 *  with the specified resource type
 * @param {Creep} creep
 * @param {(FIND_TOMBSTONES | FIND_RUINS)} findType
 * @param {string} resourceType
 * @returns {(TOMBSTONE | RUIN)} the closest structure with specified type
 *    and resource, or undefined if not found
 */
const findClosestDyingWithResource = (creep, findType, resourceType) => {
  return creep.pos.findClosestByRange(findType, (s) =>
    structureHasResource(s, resourceType)
  );
};

/**
 * Pick up specified resource
 * @param {Creep} creep
 * @param {Resource} target target resource
 * @returns {boolean} true if the pickup is successful, false otherwise
 */
const pickup = (creep, target) => {
  if (target) {
    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
    return true;
  } else {
    return false;
  }
};

/**
 * Withdraw the resource of given type from structure
 * @param {Creep} creep
 * @param {Structure} target target structure to withdraw from
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFrom = (creep, target, resourceType = RESOURCE_ENERGY) => {
  if (
    target !== null &&
    (creep.withdraw(target, resourceType) !== OK ||
      creep.pos.getRangeTo(target) !== 1)
  ) {
    creep.moveTo(target, { visualizePathStyle: { stroke: WITHDRAW_STROKE } });
    return true;
  }
  return false;
};

// TODO: Change the return description later if necessary
/**
 * Harvest resource from the given target
 * @param {Creep} creep
 * @param {(Source | Mineral | Deposit)} target target to harvest from
 */
const harvestFrom = (creep, target) => {
  if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: HARVEST_STROKE } });
  }
};

/**
 * Transfer resource to target structure
 * @param {Creep} creep
 * @param {Structure} target target structure
 * @param {string} resourceType RESOURCE_ENERGY by default
 */
const transferTo = (creep, target, resourceType = RESOURCE_ENERGY) => {
  if (target) {
    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: { stroke: TRANSFER_STOKE },
      });
    }
  }
};

/**
 * Pick up the closest dropped resource
 * @param {Creep} creep
 * @returns {boolean} true if pickup is successful, false otherwise
 */
const pickupDroppedResources = (creep) => {
  let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
  if (droppedResource) {
    return pickup(creep, droppedResource);
  }
  return false;
};

/**
 * Withdraw from the closest tombstone
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromTombstone = (creep) => {
  let closestTombstone = findClosestDyingWithResource(crepe, FIND_TOMBSTONES);
  if (
    closestTombstone &&
    creep.pos.getRangeTo(closestTombstone) < closestTombstone.ticksToDecay
  ) {
    return withdrawFrom(creep, closestTombstone);
  }
  return false;
};

/**
 * Withdraw from the closest ruin
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromRuin = (creep) => {
  let closestRuin = findClosestDyingWithResource(creep, FIND_RUINS);
  if (closestRuin) {
    return withdrawFrom(creep, closestRuin);
  }
  return false;
};

/**
 * Withdraw from the closest container
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromContainer = (creep) => {
  let closestContainer = findClosestStructureWithResource(
    creep,
    STRUCTURE_CONTAINER
  );
  if (closestContainer) {
    return withdrawFrom(creep, closestContainer);
  }
  return false;
};

/**
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromStorage = (creep) => {
  let storage = getStructures(STRUCTURE_STORAGE, creep.room);
  if (storage) {
    return withdrawFrom(creep, storage);
  }
  return false;
};

/**
 * Withdraw from the closest spawn
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromSpawn = (creep) => {
  let closestSpawn = findClosestStructureWithResource(creep, STRUCTURE_SPAWN);
  if (closestSpawn) {
    return withdrawFrom(creep, closestSpawn);
  }
  return false;
};

/**
 * Harvest from the closest source
 * @param {Creep} creep
 * @param {number} sourceId
 */
const harvestFromSource = (creep, sourceId) => {
  let sources = creep.room.find(FIND_SOURCES);
  let closestSource;
  if (sourceId) {
    closestSource = sources[sourceId];
  } else {
    closestSource = creep.findClosestByRange(sources);
  }

  harvestFrom(crepe, closestSource);
};

/**
 * Returns the method to obtain resources
 * @param {string} origin
 * @returns {function(Creep): void} function to obtain resources
 */
const findHarvestMethod = (origin) => {
  switch (origin) {
    case "droppedResources":
      return pickupDroppedResources;
    case "tombstone":
      return withdrawFromTombstone;
    case "ruin":
      return withdrawFromRuin;
    case "container":
      return withdrawFromContainer;
    case "storage":
      return withdrawFromStorage;
    case "spawn":
      return withdrawFromSpawn;
    default:
      return harvestFromSource;
  }
};

// TODO: fix resourceOrigins JSDoc later
/**
 * Obtain resource from the given origins in order
 * @param {Creep} creep
 * @param {("droppedResources" | "tombstone" | "ruin" |
 *    "container" | "storage" | "spawn" | "source")[]} resourceOrigins
 *    an array of origins of resource
 */
const obtainResource = (creep, resourceOrigins, sourceId = 0) => {
  for (var i in resourceOrigins) {
    let origin = resourceOrigins[i];
    let harvestMethod = findHarvestMethod(origin);
    if (harvestMethod(creep, sourceId)) {
      break;
    }
  }
};

/**
 * Repair the given target
 * @param {Creep} creep
 * @param {Structure} target
 */
const repairTarget = (creep, target) => {
  if (target.length > 0) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  }
};

/**
 * Let a creep claim the controller in its room, show error message if not
 *   successful
 * @param {Creep} creep
 */
const claimController = (creep) => {
  if (creep.room.controller) {
    let controller = creep.room.controller;
    if (creep.claimController(controller) == ERR_NO_BODYPART) {
      console.log(`Creep ${creep.name} does not have CLAIM part`);
    } else if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(controller);
    }
  }
};

/**
 * Move a creep to a given position
 * @param {Creep} creep
 * @param {number} x x-coordinate of position: 0 <= x < = 49
 * @param {number} y y-coordinate of position: 0 <= y <= 49
 * @param {string} roomName name of the destination room
 */
const moveToPosition = (creep, x, y, roomName = "") => {
  if (creep) {
    let targetRoomName = roomName !== "" ? roomName : creep.room.name;
    creep.moveTo(new RoomPosition(x, y, targetRoomName));
  }
};

module.exports = {
  obtainResource,
  transferTo,
  repairTarget,
  claimController,
  moveToPosition,
};
