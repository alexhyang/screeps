const {
  ROOM_NUMBER,
  SPAWN_WITHDRAW_THRESHOLD,
  CONTAINER_WITHDRAW_THRESHOLD,
} = require("./dashboard");
const { getContainer, getSpawn } = require("./util.structureFinder");

/**
 * @param {number} roomName
 * @returns the available energy of room with the given name
 */
const getEnergyAvailable = (roomName = ROOM_NUMBER) => {
  return Game.rooms[roomName].energyAvailable;
};

/**
 * @param {number} roomName
 * @returns the available energy capacity of room with the given name
 */
const getEnergyCapacityAvailable = (roomNumber = ROOM_NUMBER) => {
  return Game.rooms[roomNumber].energyCapacityAvailable;
};

/**
 * @returns {boolean} true if it is okay to withdraw from spawn(s)
 **/
const withdrawFromSpawnOk = () => {
  let energyAvailable = getEnergyAvailable();
  return energyAvailable >= SPAWN_WITHDRAW_THRESHOLD;
};

/**
 * @returns {boolean} true if it is okay to withdraw from container(s)
 **/
const withdrawFromContainerOk = () => {
  let container = getContainer()[0];
  if (container) {
    return (
      container.store.getUsedCapacity(RESOURCE_ENERGY) >=
      CONTAINER_WITHDRAW_THRESHOLD
    );
  }
  return false;
};

const transferEnergyToTarget = (creep, target) => {
  if (target) {
    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  }
};

const harvestFromClosestDead = (creep, findCode) => {
  var target = creep.pos.findClosestByRange(findCode, {
    filter: (t) => t.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
  });
  if (
    (target && creep.withdraw(target, RESOURCE_ENERGY) !== OK) ||
    creep.pos.getRangeTo(target) !== 1
  ) {
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffaa00" },
    });
    return true;
  }
  return false;
};

const assignCreepToObtainEnergyFromRuin = (creep) => {
  return harvestFromClosestDead(creep, FIND_RUINS);
};

const assignCreepToObtainEnergyFromTombstone = (creep) => {
  return harvestFromClosestDead(creep, FIND_TOMBSTONES);
};

/**
 * @param {Creep} creep
 * @returns {boolean} whether the assignment is successful
 */
const assignCreepToObtainEnergyFromSpawn = (creep) => {
  var spawn = getSpawn();
  if (
    creep.withdraw(spawn, RESOURCE_ENERGY) !== OK ||
    creep.pos.getRangeTo(spawn) !== 1
  ) {
    creep.moveTo(spawn, {
      visualizePathStyle: { stroke: "#ffaa00" },
    });
    return true;
  }
  return false;
};

/** @param {Creep} creep **/
/** @param {number} sourceIndex the index of source **/
const assignCreepToObtainEnergyFromSource = (creep, sourceIndex) => {
  var sources = creep.room.find(FIND_SOURCES);
  if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
    creep.moveTo(sources[sourceIndex], {
      visualizePathStyle: { stroke: "#ffaa00" },
    });
  }
};

/**
 * @param {Creep} creep
 * @param {number} sourceIndex the index of source
 * @returns {boolean} whether the assignment is successful
 */
const assignCreepToObtainEnergyFromContainer = (creep) => {
  var containers = creep.room.find(FIND_STRUCTURES, {
    filter: (structure) =>
      structure.structureType == STRUCTURE_CONTAINER &&
      structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
  });
  _.sortBy(containers, (c) => c.store.getFreeCapacity());
  if (containers.length > 0) {
    let container = containers[containers.length - 1];
    if (
      creep.withdraw(container, RESOURCE_ENERGY) !== OK ||
      creep.pos.getRangeTo(container) !== 1
    ) {
      creep.moveTo(container, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
    return true;
  } else {
    return false;
  }
};

/**
 * @param {Creep} creep
 * @param {number} sourceIndex the index of source
 * @returns {boolean} whether the assignment is successful
 */
const assignCreepToObtainEnergyFromStorage = (creep) => {
  return harvestFromClosestDead();
};

const pickupDroppedResources = (creep) => {
  const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
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

module.exports = {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  pickupDroppedResources,
  assignCreepToObtainEnergyFromTombstone,
  assignCreepToObtainEnergyFromRuin,
  assignCreepToObtainEnergyFromContainer,
  assignCreepToObtainEnergyFromStorage,
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
  withdrawFromContainerOk,
  withdrawFromSpawnOk,
  transferEnergyToTarget,
};
