const roomConfig = require("./dashboard");
const { obtainResource, upgradeController } = require("./role.creepManager");

/**
 * Update upgrading status of a creep
 * @param {Creep} creep
 */
const updateUpgradingStatus = (creep) => {
  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.upgrading = false;
    creep.say("🔄");
  }

  if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
    creep.memory.upgrading = true;
    creep.say("⚡");
  }
};

/**
 * Let creep obtain energy for upgrading
 * @param {Creep} creep
 */
const obtainEnergy = (creep) => {
  const { sourceOrigins, sourceIndex } = roomConfig[creep.room.name].upgrader;
  obtainResource(creep, sourceOrigins, sourceIndex);
};

var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    updateUpgradingStatus(creep);
    if (creep.memory.upgrading) {
      upgradeController(creep);
    } else {
      obtainEnergy(creep);
    }
  },
};

module.exports = roleUpgrader;
