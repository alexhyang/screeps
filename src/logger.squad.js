const {
  HARVESTER_TEAM_SIZE,
  BUILDER_TEAM_SIZE,
  UPGRADER_TEAM_SIZE,
  REPAIRER_TEAM_SIZE,
  MINER_TEAM_SIZE,
} = require("./dashboard");
const { capitalize } = require("./logger.utils");
const { getTeam } = require("./squad");

var squadLogger = {
  log: function () {
    this.printTeamStatus("harvester");
    this.printTeamStatus("builder");
    this.printTeamStatus("upgrader");
    this.printTeamStatus("repairer");
    this.printTeamStatus("miner");
  },
  /**
   * @param {string} creepRole
   */
  printTeamStatus: function (creepRole) {
    let teamMembers = getTeam(creepRole);
    this.printTeamStatusTitle(creepRole, teamMembers.length);
    this.printTeamMembers(teamMembers);
  },
  printTeamStatusTitle: function (creepRole, teamSize) {
    let paddedTeamName = this.padStr(creepRole + "s", 11);
    let msg =
      capitalize(paddedTeamName) +
      ` (life, carry, fatigue): ` +
      `${teamSize}/${this.getTeamMaxSize(creepRole)}`;
    console.log(msg);
  },
  printTeamMembers: function (teamMembers) {
    for (var i in teamMembers) {
      let teamMember = teamMembers[i];
      let creepMeta = this.getCreepMeta(teamMember);
      let bodyParts = this.getCreepBodyParts(teamMember);
      let paddedCreepName = this.padStr(teamMember.name, 12);
      let paddedCreepMeta = this.padStr(creepMeta, 21);
      let pos = teamMember.pos;
      let printMsg = `  ${paddedCreepName}${paddedCreepMeta} ${bodyParts} ${pos}`;
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
  /**
   *
   * @param {string} str string to be padded
   * @param {number} maxLength max length after padding
   * @returns Padded string with the given max length
   */
  padStr: function (str, maxLength) {
    return str + " ".repeat(maxLength - str.length);
  },
  getCreepMeta: function (creep) {
    let lifeLeft = creep.ticksToLive;
    let fatigue = creep.fatigue;
    let carry = creep.store[RESOURCE_ENERGY];
    let carryMax = creep.store.getCapacity(RESOURCE_ENERGY);
    return `(${lifeLeft}, ${carry}/${carryMax}, ${fatigue})`;
  },
  getCreepBodyParts: function (creep) {
    return creep.body.map((part) => part.type).join(",");
  },
};

module.exports = squadLogger;
