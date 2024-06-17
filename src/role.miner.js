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
      let containers = this.findTargets(creep, STRUCTURE_CONTAINER);
      if (containers.length > 0) {
        this.transferEnergyToStructure(creep, containers);
      }
    }
  },
  /**
   * Transfer energy to containers
   * @param {Creep} creep
   */
  transferEnergyToStructure: function (creep, targets) {
    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  },
  findTargets: function (creep, structureType) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == structureType &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });
    return targets;
  },
};

module.exports = roleHarvester;
