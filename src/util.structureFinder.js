/**
 * Find all structures of specified type in the room
 * @param {string} structureType
 * @param {Room} room
 * @returns {Structure[]} an array of structures, or empty array if not found
 */
function getStructures(structureType, room) {
  return room.find(FIND_STRUCTURES, {
    filter: { structureType: structureType },
  });
}

/**
 * Find if a given structure has free capacity of specified resource type
 *    greater than the threshold
 * @param {Structure} structure
 * @param {number} [freeCapacityThreshold=0] 0 by default
 * @param {string} [resourceType=RESOURCE_ENERGY] RESOURCE_ENERGY by default
 * @returns {boolean} true if structure has free capacity, false otherwise
 */
function structureHasFreeCapacity(
  structure,
  freeCapacityThreshold = 0,
  resourceType = RESOURCE_ENERGY
) {
  if (structure) {
    return (
      structure.store.getFreeCapacity(resourceType) > freeCapacityThreshold
    );
  }
  return false;
}

/**
 * Find if a given structure has of specified resource type
 * @param {Structure} structure
 * @param {string} [resourceType=RESOURCE_ENERGY] RESOURCE_ENERGY by default
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
 * @param {string} spawnName
 * @returns {(StructureSpawn|undefined)} the spawn with the given name,
 *    or undefined if not found
 */
const getSpawnByName = (spawnName) => {
  return Game.spawns[spawnName];
};

/**
 * Find all spawns in the given room
 * @param {Room} room
 * @returns {StructureSpawn[]} an array of spawns in the room,
 *    or empty array if not found
 */
const getSpawns = (room) => {
  return getStructures(STRUCTURE_SPAWN, room);
};

/**
 * Find the controller in the given room
 * @param {Room} room
 * @returns {(StructureController|undefined)} the controller in the room,
 *    or undefined if not found
 */
const getController = (room) => {
  return room.controller;
};

/**
 * Find all containers in the given room
 * @param {Room} room
 * @returns {StructureContainer[]} an array of containers in the room,
 *    or empty array if not found
 */
const getContainers = (room) => {
  return getStructures(STRUCTURE_CONTAINER, room);
};

/**
 * Find the storage in the given room
 * @param {Room} room
 * @returns {(StructureStorage|undefined)} the storage in the room,
 *    or undefined if not found
 */
const getStorage = (room) => {
  return room.storage;
};

/**
 * Find all towers in the given room
 * @param {Room} room
 * @returns {StructureTower[]} an array of towers in the room,
 *    or empty array if not found
 */
const getTowers = (room) => {
  return getStructures(STRUCTURE_TOWER, room);
};

/** Find all extensions in the given room
 * @param {Room} room
 * @returns {StructureTower[]} an array of extensions in the room,
 *    or empty array if not found
 */
const getExtensions = (room) => {
  return getStructures(STRUCTURE_EXTENSION, room);
};

/** Find all links in the given room
 * @param {Room} room
 * @returns {StructureTower[]} an array of extensions in the room,
 *    or empty array if not found
 */
const getLinks = (room) => {
  return getStructures(STRUCTURE_LINK, room);
};

/**
 * Find all unhealthy walls and ramparts
 * @param {number} minHealthyHits minimum hits of healthy defenses
 * @param {Room} room search in the given room
 * @returns {StructureDefenses[]} an array of unhealthy walls and ramparts,
 *    or empty array if not found
 */
const getUnhealthyDefenses = (minHealthyHits, room) => {
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
 *    or empty array if not found
 */
const getHealthyDefenses = (minHealthyHits, room) => {
  let healthyDefenses = room.find(FIND_STRUCTURES, {
    filter: (s) =>
      (s.structureType == STRUCTURE_WALL ||
        s.structureType == STRUCTURE_RAMPART) &&
      s.hits >= minHealthyHits,
  });
  return healthyDefenses;
};

/**
 * Find all damaged/decayed structures for repair
 * @param {Room} room
 * @param {string} structureType
 * @returns {Structure[]} an array of decayed structures,
 *    or empty array if not found
 */
const getDamagedStructures = (room, structureType) => {
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
  getLinks,
  getUnhealthyDefenses,
  getHealthyDefenses,
  getDamagedStructures,
};
