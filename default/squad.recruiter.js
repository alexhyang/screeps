/**
 * This is a team recruiter of the room.
 *
 * Creep spawn costs (BODYPART_COST)
 *   work: 100, carry: 50, move: 50,
 *   attack: 80, ranged_attack: 150, heal: 250
 *   claim: 600, tough: 10
 *
 */

const resources = require("resources");

const HARVESTER_200 = {
  name: "H200",
  role: "harvester",
  body: [WORK, CARRY, MOVE],
};
const HARVESTER_450 = {
  name: "H450",
  role: "harvester",
  body: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
};
const BUILDER_250 = {
  name: "B250",
  role: "builder",
  body: [WORK, CARRY, MOVE, MOVE],
};
const UPGRADER_400 = {
  name: "U400",
  role: "upgrader",
  body: [WORK, WORK, WORK, CARRY, MOVE],
};

var squadRecruiter = {
  recruitHarvester: function () {
    if (resources.getTotalEnergy >= 450) {
      this.recruitCreep(HARVESTER_450);
    } else {
      this.recruitCreep(HARVESTER_200);
    }
  },
  recruitBuilder: function () {
    this.recruitCreep(BUILDER_250);
  },
  recruitUpgrader: function () {
    this.recruitCreep(UPGRADER_400);
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
