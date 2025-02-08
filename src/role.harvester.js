const { getRoomConfig } = require("./configAPI");
const { findStructuresInRange } = require("./Creep");
const { obtainResource, transferResource } = require("./CreepResource");
const {
  storeHasSpace,
  storeHasResource,
  getCapacity,
  getUsedCapacity,
  getFreeCapacity,
  storeIsFull,
  storeIsEmpty,
} = require("./util.resourceManager");
const {
  getTowers,
  getStorage,
  getTerminal,
  getLabs,
  getNuker,
  getFactory,
} = require("./util.structureFinder");

/**
 * Update the building status of the builder creep
 * @param {Creep} creep
 */
const updateDeliveringStatus = (creep) => {
  if (creep.memory.delivering && storeIsEmpty(creep)) {
    creep.memory.delivering = false;
    creep.say("⛏");
  }

  if (!creep.memory.delivering && storeIsFull(creep)) {
    creep.memory.delivering = true;
    creep.say("🚚");
  }
};

/**
 * Determine if a creep only carries energy
 * @param {Creep} creep
 * @returns {boolean} true if creep only carries energy, or false otherwise
 */
const isCreepOnlyCarryingEnergy = (creep) => {
  return getUsedCapacity(creep) == getUsedCapacity(creep, "all");
};

/**
 * Find spawns and extensions in room that are not full
 * @param {Room} room
 * @returns {Structure[]} an array of spawns and extensions that are not full,
 *    or empty array if not found
 */
const getSpawnsExtensionsNotFull = (room, resourceType = RESOURCE_ENERGY) => {
  return room.find(FIND_STRUCTURES, {
    filter: (s) => {
      return (
        (s.structureType == STRUCTURE_EXTENSION ||
          s.structureType == STRUCTURE_SPAWN) &&
        getFreeCapacity(s, resourceType) > 0
      );
    },
  });
};

/**
 * Get the target structure to deliver energy
 * @param {Creep} creep
 * @returns {Structure} structure to delivery energy
 */
const getTargetToDeliverEnergy = (creep) => {
  let storage = getStorage(creep.room);
  let linkFrom = findStructuresInRange(creep, STRUCTURE_LINK, 10)[0];

  const hasSpace = (s) =>
    storeHasSpace(s, getCapacity(creep) > 500 ? 500 : getCapacity(creep));

  // if (linkFrom && storeHasSpace(linkFrom, 500)) {
  //   creep.memory.deliveryTarget = linkFrom.id;
  //   return linkFrom;
  // }

  let spawnExtensionsNotFull = getSpawnsExtensionsNotFull(creep.room);
  if (spawnExtensionsNotFull.length > 0) {
    let target = creep.pos.findClosestByRange(spawnExtensionsNotFull);
    creep.memory.deliveryTarget = target.id;
    return target;
  }

  let towersNotFull = _.filter(getTowers(creep.room), hasSpace);
  if (towersNotFull.length > 0) {
    return creep.pos.findClosestByRange(towersNotFull);
  }

  let labsNotFull = _.filter(getLabs(creep.room), hasSpace);
  if (labsNotFull.length > 0) {
    return creep.pos.findClosestByRange(labsNotFull);
  }

  let terminal = getTerminal(creep.room);
  if (terminal && getUsedCapacity(terminal) < 30000) {
    return terminal;
  }

  let factory = getFactory(creep.room);
  if (factory && storeHasSpace(factory) > 2000) {
    return factory;
  }

  let nuker = getNuker(creep.room);
  if (
    storage &&
    storeHasResource(storage, 30000) &&
    nuker &&
    storeHasSpace(nuker)
  ) {
    return nuker;
  }

  if (storage) {
    return storage;
  }
};

/**
 * Find the delivery target for the harvester creep
 * @param {Creep} creep
 * @returns {(Structure | undefined)} target to delivery resource,
 *    or undefined if not found
 */
const findDeliveryTarget = (creep) => {
  if (creep) {
    let deliveryTarget = Game.getObjectById(creep.memory.deliveryTarget);
    if (
      deliveryTarget &&
      isCreepOnlyCarryingEnergy(creep) &&
      (deliveryTarget.structureType == STRUCTURE_SPAWN ||
        deliveryTarget.structureType == STRUCTURE_EXTENSION) &&
      storeHasSpace(deliveryTarget)
    ) {
      return deliveryTarget;
    } else {
      delete creep.memory.deliveryTarget;
      let storage = getStorage(creep.room);
      if (isCreepOnlyCarryingEnergy(creep)) {
        return getTargetToDeliverEnergy(creep);
      }

      if (
        creep.memory.resourceTypes.length > 1 &&
        creep.memory.resourceTypes[0] == RESOURCE_ENERGY
      ) {
        creep.memory.resourceTypes.shift();
      }

      let factory = getFactory(creep.room);
      if (factory && getUsedCapacity(factory) < 25000 && !storeIsFull(factory)) {
        return factory;
      }

      if (storage) {
        return storage;
      }
    }
  }
};

const checkResourceTypes = (creep) => {
  creep.memory.resourceTypes = [
    "Z",
    "H",
    "K",
    "O",
    "GO",
    "KO",
    "ZH",
    "UH",
    "LO",
    "energy",
  ];
};

module.exports = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (!creep.memory.resourceTypes) {
      creep.memory.resourceTypes = [];
    }
    updateDeliveringStatus(creep);
    if (creep.memory.delivering) {
      let target = findDeliveryTarget(creep);
      transferResource(creep, target);
    } else {
      const { sourceOrigins, sourceIndex } = getRoomConfig(
        creep.room.name
      ).harvester;
      obtainResource(creep, sourceOrigins, sourceIndex);
    }
  },
};
