const {
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
  withdrawFromSpawnOk,
} = require("./resources");
const {
  REPAIRER_ENERGY_SOURCE,
  REPAIRER_SOURCE_INDEX,
} = require("./strategy.parameters");

let roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    this.updateRepairingStatus(creep);
    if (creep.memory.repairing) {
      this.repairConstruction(creep);
    } else {
      this.obtainEnergy(creep);
    }
  },
  updateRepairingStatus: function (creep) {
    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.repairing = false;
      creep.say("🔄 harvest");
    }

    if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
      creep.memory.repairing = true;
      creep.say("🚧 repair");
    }
  },
  repairConstruction: function (creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax / 4,
    });
    targets.sort((a, b) => a.hits - b.hits);
    if (targets.length > 0) {
      if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    }
  },
  obtainEnergy: function (creep) {
    if (withdrawFromSpawnOk() && REPAIRER_ENERGY_SOURCE === "spawn") {
      assignCreepToObtainEnergyFromSpawn(creep);
    } else {
      assignCreepToObtainEnergyFromSource(creep, REPAIRER_SOURCE_INDEX);
    }
  },
};

module.exports = roleRepairer;
