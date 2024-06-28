const roomConfig = require("./dashboard");
const { getTowers, getUnhealthyDefenses } = require("./util.structureFinder");

/**
 * Let the tower repair unhealthy walls and ramparts if any
 * @param {StructureTower} tower
 */
const repairUnhealthyDefenses = (tower) => {
  const { minTowerEnergyToRepair, minDefenseHitsToRepair } =
    roomConfig[tower.room.name].tower;
  let unhealthyDefenses = getUnhealthyDefenses(
    minDefenseHitsToRepair,
    tower.room
  );
  var closestDamagedStructure = tower.pos.findClosestByRange(unhealthyDefenses);
  if (
    closestDamagedStructure !== null &&
    tower.store.getUsedCapacity(RESOURCE_ENERGY) > minTowerEnergyToRepair
  ) {
    tower.repair(closestDamagedStructure);
  }
};

/**
 * Let the tower attack hostile creeps
 * @param {StructureTower} tower
 */
const attackHostiles = (tower) => {
  var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (closestHostile && closestHostile.hits == closestHostile.hitsMax) {
    if (!Memory.hostiles) {
      Memory.hostiles = [];
    }
    Memory.hostiles.push(`${tower.room.name}: ${Game.time}`);
  }
  if (closestHostile && tower.pos.getRangeTo(closestHostile) <= 45) {
    tower.attack(closestHostile);
  }
};

/**
 * Activate towers in the room with given name
 * @param {string} roomName
 */
const activateTowersInRoom = (roomName) => {
  var towers = getTowers(Game.rooms[roomName]);
  for (let i in towers) {
    let tower = towers[i];
    if (tower) {
      repairUnhealthyDefenses(tower);
      attackHostiles(tower);
    }
  }
};

/**
 * Activate all towers
 */
const activateTowers = () => {
  for (let roomName in roomConfig) {
    activateTowersInRoom(roomName);
  }
};

module.exports = {
  activateTowers,
};
