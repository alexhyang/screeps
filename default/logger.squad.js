const {
  HARVESTER_TEAM_SIZE,
  BUILDER_TEAM_SIZE,
  UPGRADER_TEAM_SIZE,
  REPAIRER_TEAM_SIZE,
} = require("./dashboard");
var squad = require("./squad");
const { capitalize } = require("./utils");

var squadLogger = {
  log: function () {
    this.printTeamStatus("harvester");
    this.printTeamStatus("builder");
    this.printTeamStatus("upgrader");
    this.printTeamStatus("repairer");
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
    console.log(
      capitalize(creepRole) +
        `s ${this.getTeamNameSuffix(creepRole)}(life, carry, fatigue): ` +
        teamSize +
        "/" +
        this.getTeamMaxSize(creepRole)
    );
  },
  printTeamMembers: function (teamMembers) {
    for (var i in teamMembers) {
      let teamMember = teamMembers[i];
      let creepMeta = this.getCreepMeta(teamMember);
      let bodyParts = this.getCreepBodyParts(teamMember);
      let creepNameSuffix = this.getCreepNameSuffix(teamMember);
      let printMsg = `  ${teamMember.name}${creepNameSuffix}${creepMeta} ${bodyParts}`;
      console.log(printMsg);
    }
  },
  getTeamMaxSize: function (creepRole) {
    switch (creepRole) {
      case "harvester":
        return HARVESTER_TEAM_SIZE;
      case "builder":
        return BUILDER_TEAM_SIZE;
      case "upgrader":
        return UPGRADER_TEAM_SIZE;
      case "repairer":
        return REPAIRER_TEAM_SIZE;
      default:
        return -1;
    }
  },
  /**
   * @param {string} creepRole
   * @returns {string} a suffix for team name alignment in log
   */
  getTeamNameSuffix: function (creepRole) {
    let teamNameSuffix = "";
    if (creepRole === "builder") {
      teamNameSuffix += "  ";
    }
    if (creepRole === "upgrader") {
      teamNameSuffix += " ";
    }
    if (creepRole === "repairer") {
      teamNameSuffix += " ";
    }
    return teamNameSuffix;
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
  getCreepNameSuffix: function (creep) {
    let creepNameSuffix = "";
    if (creep.name.length == 8) {
      creepNameSuffix = "  ";
    }
    if (creep.name.length == 9) {
      creepNameSuffix = " ";
    }
    return creepNameSuffix;
  },
};

module.exports = squadLogger;
