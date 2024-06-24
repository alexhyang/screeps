const roomConfig = require("./dashboard");
const { obtainResource } = require("./role.creepManager");

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

/** @param {Creep} creep **/
const upgradeController = (creep) => {
  if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, {
      visualizePathStyle: { stroke: "#ffffff" },
    });
  }
};

/** @param {Creep} creep **/
const obtainEnergy = (creep) => {
  obtainResource(
    creep,
    ["droppedResources", "tombstone", "ruin", "container", "spawn", "source"],
    roomConfig[creep.room.name].UPGRADER_SOURCE_INDEX
  );
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
