const {
  HARVESTER_CURRENT_MODEL,
  BUILDER_CURRENT_MODEL,
  UPGRADER_CURRENT_MODEL,
  REPAIRER_CURRENT_MODEL,
} = require("./dashboard");

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
