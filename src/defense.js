const roomConfig = require("./dashboard");
const { getTowers, getUnhealthyDefenses } = require("./util.structureFinder");

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

const attackHostiles = (tower) => {
  var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  if (closestHostile && tower.pos.getRangeTo(closestHostile) <= 45) {
    tower.attack(closestHostile);
  }
};

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

const activateTowers = () => {
  for (let roomName in roomConfig) {
    activateTowersInRoom(roomName);
  }
};

module.exports = {
  activateTowers,
};
