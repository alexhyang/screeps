const { ENERGY_AVAILABLE, ENERGY_CAPACITY_AVAILABLE } = require("./dashboard");
const MODELS = require("./creepModels");

var squadRecruiter = {
  recruitHarvester: function () {
    this.recruitCreep(MODELS.HARVESTER_350_FAST);
  },
  recruitBuilder: function () {
    this.recruitCreep(MODELS.BUILDER_350_LARGE);
  },
  recruitUpgrader: function () {
    if (ENERGY_AVAILABLE >= 500) {
      this.recruitCreep(MODELS.UPGRADER_500);
    } else {
      this.recruitCreep(MODELS.UPGRADER_400);
    }
  },
  recruitRepairer: function () {
    if (ENERGY_AVAILABLE >= 400) {
      this.recruitCreep(MODELS.REPAIRER_400);
    } else {
      this.recruitCreep(MODELS.REPAIRER_250);
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
};

module.exports = squadRecruiter;
