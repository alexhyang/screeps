const {
  assignCreepToObtainEnergyFromSource,
} = require("./util.resourceManager");

const { HARVESTER_SOURCE_INDEX, ROOM_NUMBER } = require("./dashboard");

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      assignCreepToObtainEnergyFromSource(creep, HARVESTER_SOURCE_INDEX);
    } else {
      let targets = this.findTargets(creep);
      this.transferEnergy(creep, targets);
    }
  },
  findTargets: function (creep) {
    let transferToNonContainer =
      Game.rooms[ROOM_NUMBER].energyAvailable <
      Game.rooms[ROOM_NUMBER].energyCapacityAvailable;
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        if (transferToNonContainer) {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        } else {
          return (
            structure.structureType == STRUCTURE_CONTAINER &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
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
