const {
  assignCreepToObtainEnergyFromSource,
} = require("./squad.resourceManager");

const { MINER_SOURCE_INDEX } = require("./dashboard");

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      assignCreepToObtainEnergyFromSource(creep, MINER_SOURCE_INDEX);
    } else {
      let targets = this.findTargets(creep);
      this.transferEnergy(creep, targets);
    }
  },
  findTargets: function (creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_CONTAINER &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });
    return targets;
  },
  transferEnergy: function (creep, targets) {
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  },
};

module.exports = roleHarvester;
