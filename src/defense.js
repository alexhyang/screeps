const roomConfig = require("./dashboard");
const { getTowers } = require("./util.structureFinder");

const activateTowers = (roomName) => {
  const { minTowerEnergyToRepair, minDefenseHitsToRepair } =
    roomConfig[roomName].tower;
  var towers = getTowers(Game.rooms[roomName]);
  for (var i in towers) {
    let tower = towers[i];
    if (tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        {
          filter: (s) =>
            (s.structureType == STRUCTURE_RAMPART ||
              s.structureType == STRUCTURE_WALL) &&
            s.hits < minDefenseHitsToRepair,
        }
      );
      console.log(closestDamagedStructure);
      if (
        closestDamagedStructure !== null &&
        tower.store.getUsedCapacity(RESOURCE_ENERGY) > minTowerEnergyToRepair
      ) {
        tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile && tower.pos.getRangeTo(closestHostile) <= 45) {
        tower.attack(closestHostile);
      }
    }
  }
};

module.exports = {
  activateTowers,
};
