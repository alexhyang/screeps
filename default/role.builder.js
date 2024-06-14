const {
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
  withdrawFromSpawnOk,
  assignCreepToObtainEnergyFromContainer,
} = require("./util.resourceManager");
const { BUILDER_ENERGY_SOURCE, BUILDER_SOURCE_INDEX } = require("./dashboard");

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
    switch (BUILDER_ENERGY_SOURCE) {
      case "spawn":
        if (withdrawFromSpawnOk()) {
          assignCreepToObtainEnergyFromSpawn(creep);
        }
        break;
      case "container":
        assignCreepToObtainEnergyFromContainer(creep, BUILDER_SOURCE_INDEX);
        break;
      default:
        assignCreepToObtainEnergyFromSource(creep, BUILDER_SOURCE_INDEX);
    }
  },
};

module.exports = roleBuilder;
