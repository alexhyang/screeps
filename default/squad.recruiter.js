const { TOTAL_AVAILABLE_ENERGY } = require("./dashboard");
const MODELS = require("./constants.creepModels");

var squadRecruiter = {
  recruitHarvester: function () {
    if (TOTAL_AVAILABLE_ENERGY >= 450) {
      this.recruitCreep(MODELS.HARVESTER_450);
    } else if (TOTAL_AVAILABLE_ENERGY >= 350) {
      this.recruitCreep(MODELS.HARVESTER_350);
    } else {
      this.recruitCreep(MODELS.HARVESTER_300);
    }
  },
  recruitBuilder: function () {
    this.recruitCreep(MODELS.BUILDER_350_LARGE);
  },
  recruitUpgrader: function () {
    if (TOTAL_AVAILABLE_ENERGY >= 500) {
      this.recruitCreep(MODELS.UPGRADER_500);
    } else {
      this.recruitCreep(MODELS.UPGRADER_400);
    }
  },
  recruitRepairer: function () {
    this.recruitCreep(MODELS.REPAIRER_200);
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
};

module.exports = squadRecruiter;
