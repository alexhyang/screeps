const resources = require("./resources");
const {
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
} = require("./resources");

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
    if (resources.withdrawOk()) {
      assignCreepToObtainEnergyFromSpawn(creep);
    } else {
      assignCreepToObtainEnergyFromSource(creep);
    }
  },
};

module.exports = roleBuilder;
