var squad = require("squad");
const { capitalize } = require("utils");

var squadLogger = {
  log: function () {
    this.printTeamStatus("harvester");
    this.printTeamStatus("builder");
    this.printTeamStatus("upgrader");
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
      let fatigue = teamMember.fatigue;
      let carry = teamMember.store[RESOURCE_ENERGY];
      let carryMax = teamMember.store.getCapacity(RESOURCE_ENERGY);
      let bodyParts = teamMember.body.map((part) => part.type).join(",");
      let creepMeta = `(life: ${lifeLeft}, carry: ${carry}/${carryMax}, fatigue: ${fatigue})`;
      let printMsg = `${name} ${creepMeta} ${bodyParts}`;
      console.log(printMsg);
    }
  },
};

module.exports = squadLogger;
