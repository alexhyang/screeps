/**
 * This is a team recruiter of the room.
 *
 * Creep spawn costs (BODYPART_COST)
 *   work: 100, carry: 50, move: 50,
 *   attack: 80, ranged_attack: 150, heal: 250
 *   claim: 600, tough: 10
 *
 */

const HARVESTER_200 = {
  name: "Harvester200",
  role: "harvester",
  body: [WORK, CARRY, MOVE],
};
const HARVESTER_450 = {
  name: "Harvester450",
  role: "harvester",
  body: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
};
const BUILDER_250 = {
  name: "Builder250",
  role: "builder",
  body: [WORK, CARRY, MOVE, MOVE],
};
const UPGRADER_400 = {
  name: "Upgrader400",
  role: "upgrader",
  body: [WORK, WORK, WORK, CARRY, MOVE],
};

var teamRecruiter = {
  recruitHarvester: function () {
    this.recruitCreep(HARVESTER_450);
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
    var newName = creepModel.name + "-" + Game.time;
    console.log(`Spawning new ${creepModel.role}: ` + newName);
    Game.spawns["Spawn1"].spawnCreep(creepModel.body, newName, {
      memory: { role: creepModel.role },
    });
  },
};

module.exports = teamRecruiter;
