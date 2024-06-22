const { ROOM_NUMBER } = require("./dashboard");

/**
 * The shorthand for room.find(FIND_STRUCTURES, filter)
 * @param {string} structureType an array of structure types
 * @returns structure(s) of the given type
 */
function getStructures(structureType, roomName = ROOM_NUMBER) {
  return Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter: { structureType: structureType },
  });
}

/**
 * Find the spawn with given spawn name
 * @param {string} spawnName name of the spawn
 * @returns {StructureSpawn} spawn with the given name
 */
const getSpawn = (spawnName = "Spawn1") => {
  return Game.spawns[spawnName];
};

const getController = (roomName = ROOM_NUMBER) => {
  return Game.rooms[roomName].controller;
};

const getContainers = () => {
  return getStructure(STRUCTURE_CONTAINER);
};

const getStorage = (roomName = ROOM_NUMBER) => {
  return Game.rooms[roomName].storage;
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
  getSpawn,
  getController,
  getStorage,
  getContainers,
  getUnhealthyDefenses,
  getHealthyDefenses,
};
