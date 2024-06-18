const {
  assignCreepToObtainEnergyFromSource,
  assignCreepToObtainEnergyFromContainer,
  assignCreepToObtainEnergyFromTombstone,
  assignCreepToObtainEnergyFromRuin,
  assignCreepToObtainEnergyFromStorage,
  withdrawFromContainerOk,
} = require("./squad.resourceManager");

const { HARVESTER_SOURCE_INDEX, ROOM_NUMBER } = require("./dashboard");

var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      assignCreepToObtainEnergyFromTombstone(creep) ||
        assignCreepToObtainEnergyFromRuin(creep) ||
        (withdrawFromContainerOk() &&
          assignCreepToObtainEnergyFromContainer(creep)) ||
        assignCreepToObtainEnergyFromStorage(creep) ||
        assignCreepToObtainEnergyFromSource(creep, HARVESTER_SOURCE_INDEX);
    } else {
      let targets = this.findTargets(creep);
      this.transferEnergy(creep, targets);
    }
  },
  findTargets: function (creep) {
    if (creep) {
      var spawnExtensions = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (spawnExtensions.length > 0) {
        return spawnExtensions;
      } else {
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_STORAGE) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          },
        });
        targets.sort(
          (a, b) => a.store.getFreeCapacity() - b.store.getFreeCapacity()
        );
        return targets;
      }
    }
  },
  transferEnergy: function (creep, targets) {
    // _.sort(targets, (structure) => creep.pos.getRangeTo(structure));
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  },
  // move this function to util later
  findStructureWithFreeCapacity: function (creep, structureType) {
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
