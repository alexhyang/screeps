const {
  pickupDroppedResources,
  assignCreepToObtainEnergyFromRuin,
} = require("./squad.resourceManager");

var rolePicker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      pickupDroppedResources(creep) || assignCreepToObtainEnergyFromRuin(creep);
    } else {
      this.transferEnergy(creep);
    }
  },
  transferEnergy: function (creep) {
    let targets = this.findTargets(creep);
    if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0], {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  },
  findTargets: function (creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_STORAGE &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      },
    });
    return targets;
  },
};

module.exports = rolePicker;
