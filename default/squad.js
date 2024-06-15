var roleHarvester = require("./role.harvester");
var roleUpgrader = require("./role.upgrader");
var roleBuilder = require("./role.builder");
const roleRepairer = require("./role.repairer");
const roleMiner = require("./role.miner");
var squadRecruiter = require("./squad.recruiter");

const {
  HARVESTER_TEAM_SIZE,
  BUILDER_TEAM_SIZE,
  UPGRADER_TEAM_SIZE,
  REPAIRER_TEAM_SIZE,
  MINER_TEAM_SIZE,
} = require("./dashboard");

var squad = {
  recruitSquad: function () {
    if (this.getHarvesters().length < HARVESTER_TEAM_SIZE) {
      squadRecruiter.recruitHarvester();
    }
    if (
      this.getBuilders().length < BUILDER_TEAM_SIZE &&
      Object.keys(Game.constructionSites).length > 0
    ) {
      squadRecruiter.recruitBuilder();
    }
    if (this.getUpgraders().length < UPGRADER_TEAM_SIZE) {
      squadRecruiter.recruitUpgrader();
    }
    if (this.getRepairers().length < REPAIRER_TEAM_SIZE) {
      squadRecruiter.recruitRepairer();
    }
    if (this.getMiners().length < MINER_TEAM_SIZE) {
      squadRecruiter.recruitMiner();
    }
  },
  assignJobs: function () {
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      switch (creep.memory.role) {
        case "harvester":
          roleHarvester.run(creep);
          break;
        case "upgrader":
          roleUpgrader.run(creep);
          break;
        case "builder":
          roleBuilder.run(creep);
          break;
        case "repairer":
          roleRepairer.run(creep);
          break;
        case "miner":
          roleMiner.run(creep);
          break;
        default:
          break;
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
  getRepairers: function () {
    return this.getTeam("repairer");
  },
  /** @returns {Object<string, Creep>} a hash containing miners */
  getMiners: function () {
    return this.getTeam("miner");
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
