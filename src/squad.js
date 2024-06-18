var roleHarvester = require("./role.harvester");
var roleUpgrader = require("./role.upgrader");
var roleBuilder = require("./role.builder");
const roleRepairer = require("./role.repairer");
const roleMiner = require("./role.miner");
const rolePicker = require("./role.picker");
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
    this.recruitMiners();
    this.recruitHarvesters();
    this.recruitRepairers();
    this.recruitUpgraders();
    this.recruitBuilders();
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
        case "picker":
          rolePicker.run(creep);
          break;
        default:
          break;
      }
    }
  },
  recruitHarvesters: function () {
    if (
      this.getHarvesters().length < HARVESTER_TEAM_SIZE ||
      (this.getHarvesters().length == HARVESTER_TEAM_SIZE &&
        this.getHarvesters()[0].ticksToLive < 0)
    ) {
      squadRecruiter.recruitHarvester();
    }
  },
  recruitBuilders: function () {
    if (
      (this.getBuilders().length < BUILDER_TEAM_SIZE ||
        (this.getBuilders().length == BUILDER_TEAM_SIZE &&
          this.getBuilders()[0].ticksToLive < 10)) &&
      Object.keys(Game.constructionSites).length > 0
    ) {
      squadRecruiter.recruitBuilder();
    }
  },
  recruitUpgraders: function () {
    if (
      this.getUpgraders().length < UPGRADER_TEAM_SIZE ||
      (this.getUpgraders().length == UPGRADER_TEAM_SIZE &&
        this.getUpgraders()[0].ticksToLive < 100)
    ) {
      squadRecruiter.recruitUpgrader();
    }
  },
  recruitRepairers: function () {
    if (this.getRepairers().length < REPAIRER_TEAM_SIZE) {
      squadRecruiter.recruitRepairer();
    }
  },
  recruitMiners: function () {
    if (
      this.getMiners().length < MINER_TEAM_SIZE ||
      (this.getMiners().length == MINER_TEAM_SIZE &&
        this.getMiners()[0].ticksToLive < 45)
    ) {
      // it takes M1150 about 50 seconds to spawn and get ready to work
      squadRecruiter.recruitMiner();
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
  recruitOk: function (team, teamSize, dyingCreepTickLeft) {
    // this.recruitOk() doesn't work in recruitHarvesters(), etc.
    // fix it later
    return (
      team.length < teamSize ||
      (team.length == teamSize && team[0].ticksToLive <= dyingCreepTickLeft)
    );
  },
};

module.exports = squad;
