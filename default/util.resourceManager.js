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
      creep.pos.getRangeTo(spawn) == 1 &&
      creep.withdraw(spawn, RESOURCE_ENERGY) == OK
    ) {
      // TODO: examine the line below
      creep.memory.building = true;
    } else {
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
};

module.exports = resources;
