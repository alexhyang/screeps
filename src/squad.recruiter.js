const {
  HARVESTER_CURRENT_MODEL,
  BUILDER_CURRENT_MODEL,
  UPGRADER_CURRENT_MODEL,
  REPAIRER_CURRENT_MODEL,
  MINER_CURRENT_MODEL,
  ROOM_NUMBER,
} = require("./dashboard");
const {
  MINER_700,
  MINER_600,
  MINER_500,
  MINER_400,
  MINER_300,
  MINER_200,
} = require("./dashboard.models");

var squadRecruiter = {
  recruitHarvester: function () {
    this.recruitCreep(HARVESTER_CURRENT_MODEL);
  },
  recruitBuilder: function () {
    this.recruitCreep(BUILDER_CURRENT_MODEL);
  },
  recruitUpgrader: function () {
    this.recruitCreep(UPGRADER_CURRENT_MODEL);
  },
  recruitRepairer: function () {
    this.recruitCreep(REPAIRER_CURRENT_MODEL);
  },
  recruitMiner: function () {
    if (this.getAvailableEnergy() >= 700) {
      this.recruitCreep(MINER_CURRENT_MODEL);
    } else if (this.getAvailableEnergy() >= 600) {
      this.recruitCreep(MINER_600);
    } else if (this.getAvailableEnergy() >= 500) {
      this.recruitCreep(MINER_500);
    } else if (this.getAvailableEnergy() >= 400) {
      this.recruitCreep(MINER_400);
    } else if (this.getAvailableEnergy() >= 300) {
      this.recruitCreep(MINER_300);
    } else {
      this.recruitCreep(MINER_200);
    }
  },

  /**
   * @param {CreepModel} creepModel
   */
  recruitCreep: function (creepModel) {
    var newName = creepModel.name + "-" + (Game.time % 10000);
    console.log(`Spawning new ${creepModel.role}: ` + newName);
    Game.spawns["Spawn1"].spawnCreep(creepModel.body, newName, {
      memory: { role: creepModel.role },
    });
  },
  getAvailableEnergy: function () {
    return Game.rooms[ROOM_NUMBER].energyAvailable;
  },
};

module.exports = squadRecruiter;
