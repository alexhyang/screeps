const { SPAWN_WITHDRAW_THRESHOLD, ROOM_NUMBER } = require("./dashboard");

let resources = {
  /** @returns {number} */
  withdrawFromSpawnOk: function () {
    let energyAvailable = Game.rooms[ROOM_NUMBER].energyAvailable;
    return energyAvailable >= SPAWN_WITHDRAW_THRESHOLD;
  },
  /**
   * @param {Creep} creep
   * @returns {boolean} whether the assignment is successful
   */
  assignCreepToObtainEnergyFromSpawn: function (creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
    if (
      creep.withdraw(spawn, RESOURCE_ENERGY) !== OK ||
      creep.pos.getRangeTo(spawn) !== 1
    ) {
      creep.moveTo(spawn, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
      return true;
    } else {
      return false;
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
  /**
   * @param {Creep} creep
   * @param {number} sourceIndex the index of source
   * @returns {boolean} whether the assignment is successful
   */
  assignCreepToObtainEnergyFromContainer: function (creep) {
    var containers = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) =>
        structure.structureType == STRUCTURE_CONTAINER &&
        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
    _.sortBy(containers, (c) => c.store.getUsedCapacity());
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
  },
};

module.exports = resources;
