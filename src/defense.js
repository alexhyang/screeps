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
const attackHostiles = (tower, hostileCreep) => {
  if (hostileCreep) {
    addHostileInvasionInfoToMemory(tower, hostileCreep);

    const { maxFiringRange } = roomConfig[tower.room.name].tower;
    let hostileRange = tower.pos.getRangeTo(hostileCreep);
    if (hostileCreep && hostileRange <= maxFiringRange) {
      // console.log(tower.pos.getRangeTo(hostileCreep));
      // console.log(maxFiringRange);
      tower.attack(hostileCreep);
    }
  }
};

/**
 * Add hostile invading record (room name, invasion time) to memory
 * @param {StructureTower} tower
 * @param {Creep} hostileCreep
 */
const addHostileInvasionInfoToMemory = (tower, hostileCreep) => {
  if (hostileCreep && hostileCreep.hits == hostileCreep.hitsMax) {
    if (!Memory.hostiles) {
      Memory.hostiles = [];
    }
    if (isHostileCreepInRecord(hostileCreep)) {
      return;
    } else {
      Memory.hostiles.push(
        createHostileInvasionRecord(tower.room.name, hostileCreep)
      );
    }
  }
};

/**
 * Find if the hostile creep has been recorded
 * @param {Creep} hostileCreep
 * @returns {boolean} true if the hostile creep has been recorded in memory,
 *    false otherwise
 */
const isHostileCreepInRecord = (hostileCreep) => {
  for (let i in Memory.hostiles) {
    if (hostileCreep.name == Memory.hostiles[i].name) {
      return true;
    }
  }
  return false;
};

/**
 * Create an invasion record of a hostile creep
 * @param {string} roomName
 * @param {Creep} hostileCreep
 * @returns {object.<string, string>} an invasion record object containing
 *    room name, creep name, and invasion time
 */
const createHostileInvasionRecord = (roomName, hostileCreep) => {
  return {
    roomName: roomName,
    name: hostileCreep.name,
    time: Game.time,
  };
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
      let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        attackHostiles(tower, closestHostile);
      } else {
        repairUnhealthyDefenses(tower);
      }
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
