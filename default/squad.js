var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var squadRecruiter = require("squad.recruiter");

const HARVESTER_TEAM_SIZE = 2;
const BUILDER_TEAM_SIZE = 2;
const UPGRADER_TEAM_SIZE = 3;

var squad = {
  recruitSquad: function () {
    if (this.getHarvesters().length < HARVESTER_TEAM_SIZE) {
      squadRecruiter.recruitHarvester();
    }
    if (this.getBuilders().length < BUILDER_TEAM_SIZE) {
      squadRecruiter.recruitBuilder();
    }
    if (this.getUpgraders().length < UPGRADER_TEAM_SIZE) {
      squadRecruiter.recruitUpgrader();
    }
  },
  assignJobs: function () {
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      if (creep.memory.role == "harvester") {
        roleHarvester.run(creep);
      }
      if (creep.memory.role == "upgrader") {
        roleUpgrader.run(creep);
      }
      if (creep.memory.role == "builder") {
        roleBuilder.run(creep);
      }
    }
  },
  getHarvesters: function () {
    return this.getTeam("harvester");
  },
  getBuilders: function () {
    return this.getTeam("builder");
  },
  getUpgraders: function () {
    return this.getTeam("upgrader");
  },
  /** @param {string} creepRole */
  getTeam: function (creepRole) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == creepRole);
  },
};

module.exports = squad;
