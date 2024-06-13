const {
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
  withdrawFromSpawnOk,
} = require("./resources");
const { UPGRADER_ENERGY_SOURCE } = require("./strategy.parameters");

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
      creep.say("🔄 harvest");
    }

    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
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
    if (withdrawFromSpawnOk() && UPGRADER_ENERGY_SOURCE === "spawn") {
      assignCreepToObtainEnergyFromSpawn(creep);
    } else {
      assignCreepToObtainEnergyFromSource(creep);
    }
  },
};

module.exports = roleUpgrader;
