const { getCreep } = require("./squad");
const {
  withdrawFromSpawnOk,
  withdrawFromContainerOk,
  withdrawFromStorageOk,
  storeHasResource,
  storeHasSpace,
} = require("./util.resourceManager");
const {
  getStructures,
  getStorage,
  getContainers,
  getTerminal,
} = require("./util.structureFinder");

const HARVEST_STROKE = "#9e743e"; // brown
const WITHDRAW_STROKE = "#f7052d"; // red
const PICKUP_STROKE = "#f200ff"; // pink
const TRANSFER_STOKE = "#16ff05"; // green

/**
 * Find the closest structure of type specified by the find constant
 * @param {Creep} creep
 * @param {string} structureType the STRUCTURE_* constant
 * @returns {(Structure|null)} the closest structure with specified type,
 *    or null if not found
 */
const findClosestStructureWithResource = (creep, structureType) => {
  let structures = _.filter(getStructures(structureType, creep.room), (s) =>
    storeHasResource(s)
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
    storeHasSpace(s)
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
  if (target.store.getUsedCapacity(resourceType) == 0) {
    return false;
  }
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
 * @returns {boolean} true if assignment is successful, false otherwise
 */
const harvestFrom = (creep, target) => {
  if (target && target.energy == 0) {
    return false;
  }

  if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: HARVEST_STROKE } });
  }
  return true;
};

/**
 * Transfer specified resource to given target
 * @param {Creep} creep
 * @param {Structure} target
 * @param {string} [resourceType=RESOURCE_ENERGY] RESOURCE_ENERGY by default
 */
const transferTo = (creep, target, resourceType = RESOURCE_ENERGY) => {
  if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: TRANSFER_STOKE },
    });
  }
};

/**
 * Transfer carried resource to target structure
 * @param {Creep} creep
 * @param {Structure} target target structure
 */
const transferResource = (creep, target) => {
  if (target) {
    let resourceTypes = creep.memory.resourceTypes;
    if (resourceTypes && resourceTypes.length > 0) {
      for (let i in resourceTypes) {
        if (creep.store.getUsedCapacity(resourceTypes[i]) == 0) {
          creep.memory.resourceTypes.shift();
        } else {
          break;
        }
      }
      let resourceType = resourceTypes[0];
      if (resourceType) {
        transferTo(creep, target, resourceType);
      }
    } else {
      transferTo(creep, target);
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
  if (
    droppedResource !== null &&
    creep.pos.getRangeTo(droppedResource) < 25 &&
    droppedResource.amount >= 10
  ) {
    resourceType = droppedResource.resourceType;
    if (resourceType !== RESOURCE_ENERGY) {
      if (!creep.memory.resourceTypes) {
        creep.memory.resourceTypes = [];
      }
      if (!creep.memory.resourceTypes.includes(resourceType)) {
        creep.memory.resourceTypes.push(resourceType);
      }
    }
    return pickup(creep, droppedResource);
  }
  return false;
};

/**
 * Withdraw from a hostile creep tombstone
 * @param {Creep} creep
 * @param {StructureTombstone} hostileTombstone
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
// TODO: withdrawal of energy works fine
// TODO: withdrawal other resources doesn't work
const withdrawFromHostileTombstone = (creep, hostileTombstone) => {
  if (!creep.memory.resourceTypes) {
    creep.memory.resourceTypes = [];
  }
  let hostileResources = ["GO", "ZH", "KO", "UH", "LO", "energy"];
  for (let i in hostileResources) {
    let resourceType = hostileResources[i];
    if (hostileTombstone.store.getUsedCapacity(resourceType) > 0) {
      if (!creep.memory.resourceTypes.includes(resourceType)) {
        creep.memory.resourceTypes.push(resourceType);
      }
      return withdrawFrom(creep, hostileTombstone, resourceType);
    }
  }
  return false;
};

/**
 * Withdraw from a friendly creep tombstone
 * @param {Creep} creep
 * @param {StructureTombstone} friendlyTombstone
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
// TODO: withdrawal of energy works fine
// TODO: withdrawal mineral resources doesn't work
const withdrawFromFriendlyTombstone = (creep, friendlyTombstone) => {
  // console.log(creep.room.name, "withdrawing from friendly tombstone");
  if (!creep.memory.resourceTypes) {
    creep.memory.resourceTypes = [];
  }
  let roomMineralType = creep.room.find(FIND_MINERALS)[0].mineralType;
  // following line of code doesn't run when friendly tombstone present in room
  // fix this function later
  // console.log(friendlyTombstone.store.getUsedCapacity(roomMineralType) > 0);
  if (friendlyTombstone.store.getUsedCapacity(roomMineralType) > 0) {
    creep.memory.resourceTypes.push(roomMineralType);
    creep.say(roomMineralType);
    return withdrawFrom(creep, friendlyTombstone, roomMineralType);
  }
  return withdrawFrom(creep, friendlyTombstone);
};

/**
 * Withdraw from the closest tombstone
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromTombstone = (creep) => {
  let closestTombstone = findClosestDyingWithResource(creep, FIND_TOMBSTONES);
  // console.log(creep.name, closestTombstone);
  if (
    closestTombstone !== null &&
    creep.pos.getRangeTo(closestTombstone) < 50
  ) {
    // console.log(closestTombstone);
    if (
      creep.memory.role == "harvester" &&
      ((!closestTombstone.creep.my &&
        withdrawFromHostileTombstone(creep, closestTombstone)) ||
        (closestTombstone.creep.my &&
          withdrawFromFriendlyTombstone(creep, closestTombstone)))
    ) {
      // console.log("withdraw from tombstone true");
      return true;
    } else {
      return withdrawFrom(creep, closestTombstone);
    }
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
  if (closestContainer !== null && withdrawFromContainerOk(creep.room)) {
    return withdrawFrom(creep, closestContainer);
  }
  // let targets = getContainers(creep.room).sort(
  //   (a, b) =>
  //     -(
  //       b.store.getFreeCapacity(RESOURCE_ENERGY) -
  //       a.store.getFreeCapacity(RESOURCE_ENERGY)
  //     )
  // );
  // if (targets.length > 0 && withdrawFromContainerOk(creep.room)) {
  //   return withdrawFrom(creep, targets[0]);
  // }
  return false;
};

/**
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromStorage = (creep) => {
  let storage = getStorage(creep.room);
  if (storage !== undefined && withdrawFromStorageOk(creep.room)) {
    return withdrawFrom(creep, storage);
  }
  return false;
};

/**
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromTerminal = (creep) => {
  let terminal = getTerminal(creep.room);

  if (terminal !== undefined) {
    return withdrawFrom(creep, terminal);
  }
  return false;
};

/**
 * Withdraw from the closest link
 * @param {Creep} creep
 * @returns {boolean} true if the withdraw is successful, false otherwise
 */
const withdrawFromLink = (creep) => {
  let closestLink = findClosestStructureWithResource(creep, STRUCTURE_LINK);
  if (closestLink !== null) {
    return withdrawFrom(creep, closestLink);
  }
  return false;
};

/**
 * Harvest from the closest source
 * @param {Creep} creep
 * @param {number} sourceId
 * @returns {boolean} true if the assignment is successful, false otherwise
 */
const harvestFromSource = (creep, sourceId) => {
  let sources = creep.room.find(FIND_SOURCES);
  let closestSource;
  if (sourceId >= 0) {
    closestSource = sources[sourceId];
  } else {
    closestSource = creep.pos.findClosestByRange(sources);
  }

  return harvestFrom(creep, closestSource);
};

/**
 * Returns the method to obtain resources
 * @param {("droppedResource" | "tombstone" | "ruin" | "container" | "link" |
 *    "storage" | "extension" | "spawn" | "wall" | "source")} origin
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
    case "link":
      return withdrawFromLink;
    case "container":
      return withdrawFromContainer;
    case "storage":
      return withdrawFromStorage;
    case "terminal":
      return withdrawFromTerminal;
    case "wall":
      return;
      return dismantleWalls;
    default:
      return harvestFromSource;
  }
};

/**
 * Obtain resource from the given origins in order
 * @param {Creep} creep
 * @param {("droppedResources" | "tombstone" | "ruin" | "container" | "link" |
 *    "storage" | "extension" | "spawn" | "wall" | "source")[]} resourceOrigins
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

module.exports = {
  harvestFrom,
  withdrawFrom,
  pickupDroppedResources,
  withdrawFromFriendlyTombstone,
  withdrawFromHostileTombstone,
  obtainResource,
  transferResource,
};
