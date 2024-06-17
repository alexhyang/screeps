const {
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
  withdrawFromSpawnOk,
  withdrawFromContainerOk,
  assignCreepToObtainEnergyFromContainer,
  obtainEnergy,
  assignCreepToObtainEnergyFromStorage,
} = require("./squad.resourceManager");
const { BUILDER_SOURCE_INDEX } = require("./dashboard");

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    this.updateBuildingStatus(creep);
    if (creep.memory.building) {
      this.buildConstructionSite(creep);
    } else {
      this.obtainEnergy(creep);
    }
  },
  /** @param {Creep} creep **/
  updateBuildingStatus: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }

    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }
  },
  /** @param {Creep} creep **/
  buildConstructionSite: function (creep) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
      if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  },
  /** @param {Creep} creep **/
  obtainEnergy: function (creep) {
    if (assignCreepToObtainEnergyFromStorage(creep)) {
      return;
    } else if (
      withdrawFromContainerOk() &&
      assignCreepToObtainEnergyFromContainer(creep)
    ) {
      return;
    } else if (
      withdrawFromSpawnOk() &&
      assignCreepToObtainEnergyFromSpawn(creep)
    ) {
      return;
    } else {
      assignCreepToObtainEnergyFromSource(creep, BUILDER_SOURCE_INDEX);
    }
  },
};

module.exports = roleBuilder;
