const { DEFAULT_ROOM } = require("./dashboard");
let defaultRoom = Game.rooms[DEFAULT_ROOM];

/**
 * Find all structures of specified type in the room
 * @param {string} structureType
 * @param {Room} room Game.rooms[DEFAULT_ROOM] by default
 * @returns {Structure[]} an array of structures, or undefined if not found
 */
function getStructures(structureType, room = defaultRoom) {
  return room.find(FIND_STRUCTURES, {
    filter: { structureType: structureType },
  });
}

/**
 * Find if a given structure has free capacity of specified resource type
 * @param {Structure} structure
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {boolean} true if structure has free capacity, false otherwise
 */
function structureHasFreeCapacity(structure, resourceType = RESOURCE_ENERGY) {
  if (structure) {
    return structure.store.getFreeCapacity(resourceType) > 0;
  }
  return false;
}

/**
 * Find if a given structure has of specified resource type
 * @param {Structure} structure
 * @param {string} resourceType RESOURCE_ENERGY by default
 * @returns {boolean} true if structure has resource, false otherwise
 */
function structureHasResource(structure, resourceType = RESOURCE_ENERGY) {
  if (structure) {
    return structure.store.getUsedCapacity(resourceType) > 0;
  }
  return false;
}

/**
 * Find the spawn with given spawn name
 * @param {string} spawnName "Spawn1" by default
 * @returns {StructureSpawn} the spawn with the given name,
 *    or undefined if not found
 */
const getSpawnByName = (spawnName = "Spawn1") => {
  return Game.spawns[spawnName];
};

/**
 * Find all spawns in the given room
 * @param {Room} room Game.rooms[DEFAULT_ROOM] by default
 * @returns {StructureSpawn[]} an array of spawns in the room,
 *    or undefined if not found
 */
const getSpawns = (room = defaultRoom) => {
  return getStructures(STRUCTURE_SPAWN, room);
};

/**
 * Find the controller in the given room
 * @param {Room} room Game.rooms[DEFAULT_ROOM] by default
 * @returns {StructureController} the controller in the room,
 *    or undefined if not found
 */
const getController = (room = defaultRoom) => {
  return room.controller;
};

/**
 * Find all containers in the given room
 * @param {Room} room Game.rooms[DEFAULT_ROOM] by default
 * @returns {StructureContainer[]} an array of containers in the room,
 *    or undefined if not found
 */
const getContainers = (room = defaultRoom) => {
  return getStructures(STRUCTURE_CONTAINER, room);
};

/**
 * Find the storage in the given room
 * @param {Room} room Game.rooms[DEFAULT_ROOM] by default
 * @returns {StructureStorage} the storage in the room,
 *    or undefined if not found
 */
const getStorage = (room = defaultRoom) => {
  return room.storage;
};

/**
 * Find all towers in the given room
 * @param {Room} room Game.rooms[DEFAULT_ROOM] by default
 * @returns {StructureTower[]} an array of towers in the room,
 *    or undefined if not found
 */
const getTowers = (room = defaultRoom) => {
  return getStructures(STRUCTURE_TOWER, room);
};

/** Find all extensions in the given room
 * @param {Room} room Game.rooms[DEFAULT_ROOM] by default
 * @returns {StructureTower[]} an array of extensions in the room,
 *    or undefined if not found
 */
const getExtensions = (room = defaultRoom) => {
  return getStructures(STRUCTURE_EXTENSION, room);
};

/**
 * Find all unhealthy walls and ramparts
 * @param {number} minHealthyHits minimum hits of healthy defenses
 * @param {Room} room search in the given room
 * @returns {StructureDefenses[]} an array of unhealthy walls and ramparts,
 *    or undefined if not found
 */
const getUnhealthyDefenses = (minHealthyHits, room = defaultRoom) => {
  let unhealthyDefenses = room.find(FIND_STRUCTURES, {
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
 * @param {Room} room search in the given room
 * @returns {StructureDefenses[]} an array of healthy walls and ramparts,
 *    or undefined if not found
 */
const getHealthyDefenses = (minHealthyHits, room = defaultRoom) => {
  let healthyDefenses = room.find(FIND_STRUCTURES, {
    filter: (s) =>
      (s.structureType == STRUCTURE_WALL ||
        s.structureType == STRUCTURE_RAMPART) &&
      s.hits >= minHealthyHits,
  });
  return healthyDefenses;
};

/**
 * Find all decayed structures for repair
 * @param {Room} room
 * @param {string} structureType
 * @returns {Structure[]} an array of decayed structures,
 *    or undefined if not found
 */
const getDecayedStructures = (room, structureType) => {
  let targets = room.find(FIND_STRUCTURES, {
    filter: (structure) =>
      structure.structureType == structureType &&
      structure.hits < structure.hitsMax,
  });
  return targets;
};

module.exports = {
  getStructures,
  structureHasFreeCapacity,
  structureHasResource,
  getSpawnByName,
  getSpawns,
  getExtensions,
  getController,
  getStorage,
  getContainers,
  getTowers,
  getUnhealthyDefenses,
  getHealthyDefenses,
  getDecayedStructures,
};
