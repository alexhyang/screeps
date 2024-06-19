const { ROOM_NUMBER } = require("./dashboard");
let room = Game.rooms[ROOM_NUMBER];

var structureFinder = {
  /**
   * Find the spawn with given spawn name
   * @param {string} spawnName name of the spawn
   * @returns {StructureSpawn} spawn with the given name
   */
  getSpawn: function (spawnName) {
    return Game.spawns[spawnName];
  },
  /**
   * Find all unhealthy walls and ramparts
   * @param {number} minHealthyHits minimum hits of healthy defenses
   * @returns {Object.<string, Structure>} unhealthy walls and ramparts
   */
  getUnhealthyDefenses: function (minHealthyHits) {
    let unhealthyDefenses = room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_WALL ||
          s.structureType == STRUCTURE_RAMPART) &&
        s.hits < minHealthyHits,
    });
    return unhealthyDefenses;
  },
  /**
   * Find all healthy walls and ramparts
   * @param {number} minHealthyHits minimum hits of healthy defenses
   * @returns {Object.<string, Structure>} unhealthy walls and ramparts
   */
  getHealthyDefenses: function (minHealthyHits) {
    let healthyDefenses = room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_WALL ||
          s.structureType == STRUCTURE_RAMPART) &&
        s.hits >= minHealthyHits,
    });
    return healthyDefenses;
  },
  /**
   * Find all towers in room
   * @returns {Object.<string, StructureTower>} all towers in the room
   */
  getTowers: function () {
    let towers = room.find(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_TOWER,
    });
    return towers;
  },
};

module.exports = structureFinder;
