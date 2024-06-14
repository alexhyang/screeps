const { TOTAL_AVAILABLE_ENERGY } = require("./strategy.parameters");
const models = require("./strategy.creepModels");

var squadRecruiter = {
  recruitHarvester: function () {
    if (TOTAL_AVAILABLE_ENERGY >= 450) {
      this.recruitCreep(models.HARVESTER_450);
    } else if (TOTAL_AVAILABLE_ENERGY >= 350) {
      this.recruitCreep(models.HARVESTER_350);
    } else {
      this.recruitCreep(models.HARVESTER_300);
    }
  },
  recruitBuilder: function () {
    this.recruitCreep(models.BUILDER_350_LARGE);
  },
  recruitUpgrader: function () {
    if (TOTAL_AVAILABLE_ENERGY >= 500) {
      this.recruitCreep(models.UPGRADER_500);
    } else {
      this.recruitCreep(models.UPGRADER_400);
    }
  },
  recruitRepairer: function () {
    this.recruitCreep(models.REPAIRER_200);
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
