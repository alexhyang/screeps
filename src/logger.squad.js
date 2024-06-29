const { capitalize, padStr } = require("./logger.utils");
const { getCreepBodyParts, getCreepMeta } = require("./role.creepManager");
const { getTeam, getTeamMaxSize } = require("./squad");

/**
 * Print team status in a room
 * @param {string} creepRole
 * @param {string} roomName
 */
const printTeamStatus = (creepRole, roomName) => {
  let teamMembers = getTeam(creepRole, roomName);
  printTeamStatusTitle(creepRole, teamMembers.length, roomName);
  printTeamMembers(teamMembers);
};

/**
 * Print team status title
 * @param {string} creepRole
 * @param {number} teamSize
 * @param {string} roomName
 */
const printTeamStatusTitle = (creepRole, teamSize, roomName) => {
  let paddedTeamName = padStr(creepRole + "s", 11);
  let teamMaxSize = getTeamMaxSize(creepRole, roomName);
  let msg =
    capitalize(paddedTeamName) +
    ` (life, carry, fatigue): ` +
    `${teamSize}/${teamMaxSize}`;
  if (
    creepRole == "builder" &&
    Object.keys(
      _.filter(Game.constructionSites, (s) => s.room.name == roomName)
    ).length == 0
  ) {
    msg += " (no construction sites)";
  }
  console.log(msg);
};

/**
 * Print team members
 * @param {Creep[]} teamMembers
 */
const printTeamMembers = (teamMembers) => {
  for (var i in teamMembers) {
    let teamMember = teamMembers[i];
    let creepMeta = getCreepMeta(teamMember);
    let bodyParts = getCreepBodyParts(teamMember);
    let paddedCreepName = padStr(teamMember.name, 12);
    let paddedCreepMeta = padStr(creepMeta, 21);
    let pos = teamMember.pos;
    let printMsg = `  ${paddedCreepName}${paddedCreepMeta} ${bodyParts} ${pos}`;
    console.log(printMsg);
  }
};

var squadLogger = {
  logSquadInfo: function (roomName) {
    let roles = [
      "harvester",
      "builder",
      "upgrader",
      "repairer",
      "miner",
      "transferer",
    ];
    roles.forEach((role) => printTeamStatus(role, roomName));
  },
};

module.exports = squadLogger;
