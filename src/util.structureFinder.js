const { ROOM_NUMBER } = require("./dashboard");
let defaultRoom = Game.rooms[ROOM_NUMBER];

/**
 * The shorthand for room.find(FIND_STRUCTURES, filter)
 * @param {string} structureType an array of structure types
 * @returns structure(s) of the given type
 */
function getStructures(structureType, room = defaultRoom) {
  return room.find(FIND_STRUCTURES, {
    filter: { structureType: structureType },
  });
}

/**
 * Find if a given structure has free capacity
 * @param {Structure} structure structure in room
 * @returns true if structure has free capacity, false otherwise
 */
function structureHasFreeCapacity(structure) {
  if (structure) {
    return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
  }
  return false;
}

/**
 * Find the spawn with given spawn name
 * @param {string} spawnName name of the spawn
 * @returns {StructureSpawn} spawn with the given name, "Spawn1" by default
 */
const getSpawnByName = (spawnName = "Spawn1") => {
  return Game.spawns[spawnName];
};

/** Find all spawns in the given room */
const getSpawns = (room = defaultRoom) => {
  return getStructures(STRUCTURE_SPAWN, room);
};

/** Find the controller in the given room */
const getController = (room = defaultRoom) => {
  return room.controller;
};

/** Find all containers in the given room */
const getContainers = (room = defaultRoom) => {
  return getStructures(STRUCTURE_CONTAINER, room);
};

/** Find the storage in the given room */
const getStorage = (room = defaultRoom) => {
  return room.storage;
};

/** Find all towers in the given room */
const getTowers = (room = defaultRoom) => {
  return getStructures(STRUCTURE_TOWER, room);
};

/** Find all extensions in the given room */
const getExtensions = (room = defaultRoom) => {
  return getStructures(STRUCTURE_EXTENSION, room);
};

/**
 * Find all unhealthy walls and ramparts
 * @param {number} minHealthyHits minimum hits of healthy defenses
 * @returns {Object.<string, Structure>} unhealthy walls and ramparts
 */
const getUnhealthyDefenses = (minHealthyHits, roomName = ROOM_NUMBER) => {
  let unhealthyDefenses = Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter: (s) =>
      (s.structureType == STRUCTURE_WALL ||
        s.structureType == STRUCTURE_RAMPART) &&
      s.hits < minHealthyHits,
  });
  return unhealthyDefenses;
};

/**
 * Find all healthy walls and ramparts
 * @param {number} minHealthyHits minimum hits of healthy defenses
 * @returns {Object.<string, Structure>} unhealthy walls and ramparts
 */
const getHealthyDefenses = (minHealthyHits, roomName = ROOM_NUMBER) => {
  let healthyDefenses = Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter: (s) =>
      (s.structureType == STRUCTURE_WALL ||
        s.structureType == STRUCTURE_RAMPART) &&
      s.hits >= minHealthyHits,
  });
  return healthyDefenses;
};

module.exports = {
  getStructures,
  structureHasFreeCapacity,
  getSpawnByName,
  getSpawns,
  getExtensions,
  getController,
  getStorage,
  getContainers,
  getTowers,
  getUnhealthyDefenses,
  getHealthyDefenses,
};
