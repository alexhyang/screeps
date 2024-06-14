var roleHarvester = require("./role.harvester");
var roleUpgrader = require("./role.upgrader");
var roleBuilder = require("./role.builder");
const roleRepairer = require("./role.repairer");
var squadRecruiter = require("./squad.recruiter");

const {
  HARVESTER_TEAM_SIZE,
  BUILDER_TEAM_SIZE,
  UPGRADER_TEAM_SIZE,
  REPAIRER_TEAM_SIZE,
} = require("./strategy.parameters");

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
    if (this.getRepairer().length < REPAIRER_TEAM_SIZE) {
      squadRecruiter.recruitRepairer();
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
      if (creep.memory.role == "repairer") {
        roleRepairer.run(creep);
      }
    }
  },

  /** @returns {Object<string, Creep>} a hash containing harvesters */
  getHarvesters: function () {
    return this.getTeam("harvester");
  },
  /** @returns {Object<string, Creep>} a hash containing builders */
  getBuilders: function () {
    return this.getTeam("builder");
  },
  /** @returns {Object<string, Creep>} a hash containing upgraders */
  getUpgraders: function () {
    return this.getTeam("upgrader");
  },
  /** @returns {Object<string, Creep>} a hash containing repairers */
  getRepairer: function () {
    return this.getTeam("repairer");
  },
  /**
   * @param {string} creepRole
   * @returns {Object<string, Creep>} a hash containing creeps given their role
   * */
  getTeam: function (creepRole) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == creepRole);
  },
};

module.exports = squad;
