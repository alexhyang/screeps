const resources = require("./resources");
const {
  HARVESTER_200,
  HARVESTER_300,
  HARVESTER_350,
  HARVESTER_450,
  BUILDER_200,
  BUILDER_250_FAST,
  BUILDER_250_LARGE,
  BUILDER_350_LARGE,
  BUILDER_400_LARGE,
  UPGRADER_200,
  UPGRADER_400,
  UPGRADER_500,
  REPAIRER_200,
} = require("./strategy.creepModels");

var squadRecruiter = {
  recruitHarvester: function () {
    if (resources.getTotalEnergy >= 450) {
      this.recruitCreep(HARVESTER_450);
    } else if (resources.getTotalEnergy >= 350) {
      this.recruitCreep(HARVESTER_350);
    } else {
      this.recruitCreep(HARVESTER_300);
    }
  },
  recruitBuilder: function () {
    this.recruitCreep(BUILDER_350_LARGE);
  },
  recruitUpgrader: function () {
    if (resources.getTotalEnergy >= 500) {
      this.recruitCreep(UPGRADER_500);
    } else {
      this.recruitCreep(UPGRADER_400);
    }
  },
  recruitRepairer: function () {
    this.recruitCreep(REPAIRER_200);
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
