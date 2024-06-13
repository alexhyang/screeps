var squad = require("squad");
const { capitalize } = require("utils");

var squadLogger = {
  log: function () {
    this.printTeamStatus("harvester");
    this.printTeamStatus("builder");
    this.printTeamStatus("upgrader");
    console.log("\n");
  },
  /**
   * @param {string} creepRole
   */
  printTeamStatus: function (creepRole) {
    let teamMembers =
      creepRole === "harvester"
        ? squad.getHarvesters()
        : creepRole == "builder"
        ? squad.getBuilders()
        : squad.getUpgraders();
    console.log(capitalize(creepRole) + "s: " + teamMembers.length);
    for (var i in teamMembers) {
      let teamMember = teamMembers[i];
      let name = teamMember.name;
      let lifeLeft = teamMember.ticksToLive;
      let bodyParts = teamMember.body.map((part) => part.type).join(",");
      let printMsg = name + " (life: " + lifeLeft + ") " + bodyParts;
      console.log(printMsg);
    }
  },
};

module.exports = squadLogger;
