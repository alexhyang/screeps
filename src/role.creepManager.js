const {
  withdrawFromSpawnOk,
  withdrawFromContainerOk,
} = require("./util.resourceManager");
const {
  structureHasResource,
  getStructures,
  structureHasFreeCapacity,
} = require("./util.structureFinder");

const HARVEST_STROKE = "#ffaa00";
const WITHDRAW_STROKE = "#ffaa00";
const PICKUP_STROKE = "#ffffff";
const TRANSFER_STOKE = "#ffffff";
const REPAIR_STROKE = "#ffffff";
const BUILD_STROKE = "#ffffff";
const UPGRADE_STROKE = "#ffffff";

/**
 * Get the meta data of a creep
 * @param {Creep} creep
 * @returns {string} the meta data of the given creep
 */
const getCreepMeta = (creep) => {
  let lifeLeft = creep.ticksToLive;
  let fatigue = creep.fatigue;
  let carry = creep.store[RESOURCE_ENERGY];
  let carryMax = creep.store.getCapacity(RESOURCE_ENERGY);
  return `(${lifeLeft}, ${carry}/${carryMax}, ${fatigue})`;
};

/**
 * Get body parts of a creep
 * @param {Creep} creep
 * @returns {string} body parts the given creep
 */
const getCreepBodyParts = (creep) => {
  return creep.body.map((part) => part.type).join(",");
};

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
 * @param {string} structureType the STRUCTURE_* constant
 * @returns {(Structure|null)} the closest structure with specified type,
 *    or null if not found
 */
const findClosestStructureWithResource = (creep, structureType) => {
  let structures = _.filter(getStructures(structureType, creep.room), (s) =>
    structureHasResource(s)
  );
  return creep.pos.findClosestByRange(structures);
};

/**
 * Find the closest structure of type specified by the find constant
 * @param {Creep} creep
 * @param {string} structureType the STRUCTURE_* constant
 * @returns {(Structure|null)} the closest structure with specified type,
 *    or null if not found
 */
const findClosestStructureWithFreeCapacity = (creep, structureType) => {
  let structures = _.filter(getStructures(structureType, creep.room), (s) =>
    structureHasFreeCapacity(s)
  );
  return creep.pos.findClosestByRange(structures);
};

/**
 * Find the closest dying object of type specified by the find constant,
 *  with the specified resource type
 * @param {Creep} creep
 * @param {(FIND_TOMBSTONES | FIND_RUINS)} findType
 * @param {string} resourceType
 * @returns {(Tombstone | Ruin | null)} the closest object and resource,
 *    or null if not found
 */
const findClosestDyingWithResource = (
  creep,
  findType,
  resourceType = RESOURCE_ENERGY
) => {
  let dyings = _.filter(
    creep.room.find(findType),
    (d) => d.store.getUsedCapacity(resourceType) > 0
  );
  return creep.pos.findClosestByRange(dyings);
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
      creep.moveTo(target, { visualizePathStyle: { stroke: PICKUP_STROKE } });
    }
    return true;
  } else {
    return false;
  }
};

/**
 * Withdraw the resource of given type from structure
 * @param {Creep} creep
 * @param {(Structure|Tombstone|Ruin)} target target structure to withdraw from
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
      creep.moveTo(target, { visualizePathStyle: { stroke: TRANSFER_STOKE } });
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
  if (droppedResource !== null) {
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
  let closestTombstone = findClosestDyingWithResource(creep, FIND_TOMBSTONES);
  if (
    closestTombstone !== null &&
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
  let closestRuin = findClosestDyingWithResource(
    creep,
    FIND_RUINS,
    RESOURCE_ENERGY
  );
  if (closestRuin !== null) {
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
  if (closestContainer !== null && withdrawFromContainerOk(creep)) {
    return withdrawFrom(creep, closestContainer);
  }
  return false;
};

/**
 * Withdraw from the closest extension
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromExtension = (creep) => {
  let closestExtension = findClosestStructureWithResource(
    creep,
    STRUCTURE_EXTENSION
  );
  if (closestExtension !== null && withdrawFromSpawnOk(creep)) {
    return withdrawFrom(creep, closestExtension);
  }
  return false;
};

/**
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromStorage = (creep) => {
  let storage = getStructures(STRUCTURE_STORAGE, creep.room);
  if (storage.length > 0) {
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
  if (closestSpawn !== null && withdrawFromSpawnOk(creep)) {
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
    closestSource = creep.pos.findClosestByRange(sources);
  }

  harvestFrom(creep, closestSource);
};

/**
 * Returns the method to obtain resources
 * @param {("droppedResource" | "tombstone" | "ruin" | "container" |
 *    "storage" | "extension" | "spawn" | "source")} origin
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
    case "extension":
      return withdrawFromExtension;
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
 * @param {("droppedResources" | "tombstone" | "ruin" | "container" |
 *    "storage" | "extension" |" "spawn" | "source")[]} resourceOrigins
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
 * Build the given construction site
 * @param {Creep} creep
 * @param {ConstructionSite} target
 */
const buildTarget = (creep, target) => {
  if (target !== null && target !== undefined) {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: BUILD_STROKE } });
    }
  }
};

/**
 * Build the given construction site by its id
 * @param {Creep} creep
 * @param {string} targetId
 */
const buildTargetById = (creep, targetId) => {
  let target = Game.getObjectById(targetId);
  if (target !== null) {
    buildTarget(creep, target);
  }
};

/**
 * Build the closest construction site if any
 * @param {Creep} creep
 */
const buildClosestConstructionSite = (creep, buildingPriority = "none") => {
  let filter =
    buildingPriority == "none"
      ? (s) => true
      : (s) => s.structureType === buildingPriority;

  let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
    filter: filter,
  });

  if (target !== null) {
    buildTarget(creep, target);
  }
};

/**
 * Repair the given target
 * @param {Creep} creep
 * @param {Structure} target
 */
const repairTarget = (creep, target) => {
  if (target !== null) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: REPAIR_STROKE } });
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
 * Upgrade controller
 * @param {Creep} creep
 */
const upgradeController = (creep) => {
  if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, {
      visualizePathStyle: { stroke: UPGRADE_STROKE },
    });
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
  getCreepMeta,
  getCreepBodyParts,
  obtainResource,
  transferTo,
  buildClosestConstructionSite,
  buildTargetById,
  repairTarget,
  claimController,
  upgradeController,
  moveToPosition,
};
