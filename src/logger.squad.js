const { capitalize, padStr } = require("./utils");
const { getCreepBodyParts, getCreepMeta } = require("./Creep");
const { getTeam, getTeamMaxSize } = require("./squad");

/**
 * Print team status in a room
 * @param {string} creepRole
 * @param {string} roomName
 */
const printTeamStatus = (creepRole, roomName) => {
  let teamMembers = getTeam(creepRole, roomName);
  printTeamSummary(creepRole, teamMembers.length, roomName);
  printTeamMembers(teamMembers);
};

/**
 * Print team summary
 * @param {string} creepRole
 * @param {number} teamSize
 * @param {string} roomName
 */
const printTeamSummary = (creepRole, teamSize, roomName) => {
  let paddedTeamName = padStr(creepRole + "s", 12);
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
  if (creepRole == "extractor") {
    let room = Game.rooms[roomName];
    let mineral = room.find(FIND_MINERALS)[0];
    if (mineral.mineralAmount == 0) {
      msg += ` (mineral regenerating in ${mineral.ticksToRegeneration}...)`;
    }
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
    let posStr = `[${pos.roomName} (${pos.x}, ${pos.y})]`;
    let printMsg = `  ${paddedCreepName}${paddedCreepMeta} ${bodyParts} ${posStr}`;
    console.log(printMsg);
  }
};

var squadLogger = {
  printSquadInRoom: function (roomName) {
    let roles = [
      "harvester",
      "builder",
      "upgrader",
      "repairer",
      "miner",
      "extractor",
      "transferrer",
    ];
    roles.forEach((role) => printTeamStatus(role, roomName));
    console.log();
  },
};

module.exports = squadLogger;
