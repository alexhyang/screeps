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
          filter: (structure) =>
            (structure.structureType == STRUCTURE_RAMPART ||
              structure.structureType == STRUCTURE_WALL) &&
            structure.hits < minTowerEnergyToRepair,
        }
      );
      if (
        closestDamagedStructure &&
        tower.store.getUsedCapacity(RESOURCE_ENERGY) > minDefenseHitsToRepair
      ) {
        tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile && tower.pos.getRangeTo(closestHostile) <= 20) {
        tower.attack(closestHostile);
      }
    }
  }
};

module.exports = {
  activateTowers,
};
