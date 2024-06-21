const { ROOM_NUMBER } = require("./dashboard");
let room = Game.rooms[ROOM_NUMBER];

function getStructure(structureType, filter = true) {
  let targets = room.find(FIND_STRUCTURES, {
    filter: (s) => s.structureType == structureType && filter,
  });
  console.log(targets);
  return targets;
}

/**
 * Find the spawn with given spawn name
 * @param {string} spawnName name of the spawn
 * @returns {StructureSpawn} spawn with the given name
 */
const getSpawn = (spawnName) => {
  return Game.spawns[spawnName];
};

const getController = () => {
  return room.controller;
};

const getStorage = () => {
  return room.storage;
};

/**
 * Find all unhealthy walls and ramparts
 * @param {number} minHealthyHits minimum hits of healthy defenses
 * @returns {Object.<string, Structure>} unhealthy walls and ramparts
 */
const getUnhealthyDefenses = (minHealthyHits) => {
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
 * @returns {Object.<string, Structure>} unhealthy walls and ramparts
 */
const getHealthyDefenses = (minHealthyHits) => {
  let healthyDefenses = room.find(FIND_STRUCTURES, {
    filter: (s) =>
      (s.structureType == STRUCTURE_WALL ||
        s.structureType == STRUCTURE_RAMPART) &&
      s.hits >= minHealthyHits,
  });
  return healthyDefenses;
};

module.exports = {
  getStructure,
  getSpawn,
  getController,
  getStorage,
  getUnhealthyDefenses,
  getHealthyDefenses,
};
