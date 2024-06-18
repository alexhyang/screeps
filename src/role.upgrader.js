const {
  assignCreepToObtainEnergyFromSource,
  assignCreepToObtainEnergyFromContainer,
} = require("./squad.resourceManager");
const { UPGRADER_SOURCE_INDEX } = require("./dashboard");

var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    this.updateUpgradingStatus(creep);
    if (creep.memory.upgrading) {
      this.upgradeController(creep);
    } else {
      this.obtainEnergy(creep);
    }
  },
  /** @param {Creep} creep **/
  updateUpgradingStatus: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      // creep.say("🔄 harvest");
    }

    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      // creep.say("⚡ upgrade");
    }
  },
  /** @param {Creep} creep **/
  upgradeController: function (creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  },
  /** @param {Creep} creep **/
  obtainEnergy: function (creep) {
    // if (assignCreepToObtainEnergyFromContainer(creep)) {
    //   return;
    // } else {
    //   assignCreepToObtainEnergyFromSource(creep, UPGRADER_SOURCE_INDEX);
    // }
    assignCreepToObtainEnergyFromSource(creep, UPGRADER_SOURCE_INDEX);
  },
};

module.exports = roleUpgrader;
