const {
  HARVESTER_TEAM_SIZE,
  BUILDER_TEAM_SIZE,
  UPGRADER_TEAM_SIZE,
  REPAIRER_TEAM_SIZE,
  MINER_TEAM_SIZE,
} = require("./dashboard");
var squad = require("./squad");
const { capitalize } = require("./logger.utils");

var squadLogger = {
  log: function () {
    this.printTeamStatus("harvester");
    this.printTeamStatus("builder");
    this.printTeamStatus("upgrader");
    this.printTeamStatus("repairer");
    this.printTeamStatus("miner");
    this.printTeamStatus("picker");
  },
  /**
   * @param {string} creepRole
   */
  printTeamStatus: function (creepRole) {
    let teamMembers = squad.getTeam(creepRole);
    this.printTeamStatusTitle(creepRole, teamMembers.length);
    this.printTeamMembers(teamMembers);
  },
  printTeamStatusTitle: function (creepRole, teamSize) {
    let paddedTeamName = this.padName(creepRole + "s", 11);
    console.log(
      capitalize(paddedTeamName) +
        ` (life, carry, fatigue): ${teamSize}/${this.getTeamMaxSize(creepRole)}`
    );
  },
  printTeamMembers: function (teamMembers) {
    for (var i in teamMembers) {
      let teamMember = teamMembers[i];
      let creepMeta = this.getCreepMeta(teamMember);
      let bodyParts = this.getCreepBodyParts(teamMember);
      let paddedCreepName = this.padName(teamMember.name, 11);
      let printMsg = `  ${paddedCreepName}${creepMeta} ${bodyParts}`;
      console.log(printMsg);
    }
  },
  getTeamMaxSize: function (creepRole) {
    switch (creepRole) {
      case "harvester":
        return HARVESTER_TEAM_SIZE;
      case "builder":
        let comments =
          Object.keys(Game.constructionSites).length > 0
            ? ""
            : " (no constructions)";
        return BUILDER_TEAM_SIZE + comments;
      case "upgrader":
        return UPGRADER_TEAM_SIZE;
      case "repairer":
        return REPAIRER_TEAM_SIZE;
      case "miner":
        return MINER_TEAM_SIZE;
      default:
        return -1;
    }
  },
  padName: function (name, length) {
    return name + " ".repeat(length - name.length);
  },
  getCreepMeta: function (creep) {
    let lifeLeft = creep.ticksToLive;
    let fatigue = creep.fatigue;
    let carry = creep.store[RESOURCE_ENERGY];
    let carryMax = creep.store.getCapacity(RESOURCE_ENERGY);
    return ` (${lifeLeft}, ${carry}/${carryMax}, ${fatigue})`;
  },
  getCreepBodyParts: function (creep) {
    return creep.body.map((part) => part.type).join(",");
  },
};

module.exports = squadLogger;
