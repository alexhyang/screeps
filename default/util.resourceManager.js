const { SPAWN_WITHDRAW_THRESHOLD, ENERGY_AVAILABLE } = require("./dashboard");

let resources = {
  /** @returns {number} */
  withdrawFromSpawnOk: function () {
    return ENERGY_AVAILABLE >= SPAWN_WITHDRAW_THRESHOLD;
  },
  /** @param {Creep} creep **/
  assignCreepToObtainEnergyFromSpawn: function (creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
    if (
      creep.withdraw(spawn, RESOURCE_ENERGY) !== OK ||
      creep.pos.getRangeTo(spawn) !== 1
    ) {
      creep.moveTo(spawn, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
  },
  /** @param {Creep} creep **/
  /** @param {number} sourceIndex the index of source **/
  assignCreepToObtainEnergyFromSource: function (creep, sourceIndex) {
    var sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[sourceIndex]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[sourceIndex], {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
  },
  /** @param {Creep} creep **/
  /** @param {number} sourceIndex the index of source **/
  assignCreepToObtainEnergyFromContainer: function (creep, containerIndex) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.structureType == STRUCTURE_CONTAINER &&
        structure.store.getCapacity(RESOURCE_ENERGY) > 0,
    });
    let container = containers[containerIndex];
    if (
      creep.withdraw(container, RESOURCE_ENERGY) !== OK ||
      creep.pos.getRangeTo(container) !== 1
    ) {
      creep.moveTo(container, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
  },
};

module.exports = resources;
