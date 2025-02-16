const { getMyRooms, getRoomConfig } = require("./configAPI");
const { storeHasResource } = require("./util.resourceManager");
const {
  getTowers,
  getUnhealthyDefenses,
  getStorage,
} = require("./util.structureFinder");
const { getRoom } = require("./utils.game");
const { getLowestDefenseHits } = require("./Room");

const STORAGE_ENERGY_RESERVE = 300000;

/**
 * Let the tower repair unhealthy walls and ramparts if any
 * @param {StructureTower} tower
 * @param {number} minRepairRange
 * @returns {boolean} true if job assigned successfully, false otherwise
 */
const repairUnhealthyDefenses = (tower, minRepairRange = 51) => {
  const { minTowerEnergyToRepair } = getRoomConfig(tower.room.name).tower;

  let defensesToRepair = getUnhealthyDefenses(
    Memory.defenses[tower.room.name].defenseHitsTarget,
    tower.room
  )
    .sort((a, b) => a.hits - b.hits)
    .filter((s) => !Memory.toDismantle.includes(s.id))
    .filter((s) => tower.pos.inRangeTo(s, minRepairRange));

  if (
    defensesToRepair.length > 0 &&
    tower.store.getUsedCapacity(RESOURCE_ENERGY) >= minTowerEnergyToRepair
  ) {
    tower.repair(defensesToRepair[0]);
    return true;
  }
  return false;
};

/**
 * Repair roads and containers
 * @param {StructureTower} tower
 * @returns {boolean} true if job assigned successfully, false otherwise
 */
const repairInfrastructure = (tower) => {
  const { minTowerEnergyToRepair } = getRoomConfig(tower.room.name).tower;
  let targetRoadsOrContainers = tower.room
    .find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_ROAD ||
          s.structureType == STRUCTURE_CONTAINER
        );
      },
    })
    .filter((r) => r.hitsMax - r.hits > 1500)
    .filter((r) => !Memory.toDismantle.includes(r.id));

  if (
    tower.store.getUsedCapacity(RESOURCE_ENERGY) >= minTowerEnergyToRepair &&
    targetRoadsOrContainers.length > 0
  ) {
    tower.repair(targetRoadsOrContainers[0]);
    return true;
  }
  return false;
};

/**
 * Heal unhealthy creeps
 * @param {StructureTower} tower
 * @returns {boolean} true if job assigned successfully, false otherwise
 */
const healCreep = (tower) => {
  let creepsToHeal = _.filter(
    tower.room.find(FIND_MY_CREEPS, {
      filter: (c) => c.hits < c.hitsMax,
    })
  );

  if (creepsToHeal.length > 0) {
    tower.heal(creepsToHeal[0]);
    return true;
  }

  return false;
};

/**
 * Find healer hostile creeps
 * @param {StructureTower} tower
 * @returns {Creep[]} an array of hostile creeps with heal body part, empty
 *    array if not found
 */
const findHostileHealer = (tower) => {
  const targets = tower.room.find(FIND_HOSTILE_CREEPS, {
    filter: function (object) {
      return object.getActiveBodyparts(HEAL) > 0;
    },
  });
  return targets;
};

/**
 * Let the tower attack hostile creeps
 * @param {StructureTower} tower
 */
const attackHostiles = (tower, hostileCreep) => {
  if (hostileCreep) {
    addHostileInvasionInfoToMemory(tower, hostileCreep);

    const { maxFiringRange } = getRoomConfig(tower.room.name).tower;
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
  if (hostileCreep && !isHostileCreepInRecord(hostileCreep)) {
    if (!Memory.hostiles) {
      Memory.hostiles = [];
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
 * @returns {{roomName: string; name: string; owner: string; time: number}} an
 *    invasion record object containing room name, creep name, and invasion
 *    time
 */
const createHostileInvasionRecord = (roomName, hostileCreep) => {
  return {
    roomName: roomName,
    name: hostileCreep.name,
    owner: hostileCreep.owner.username,
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
      let hostileHealers = findHostileHealer(tower);
      if (hostileHealers.length > 0) {
        attackHostiles(tower, hostileHealers[0]);
      } else {
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
          attackHostiles(tower, closestHostile);
        } else {
          healCreep(tower) ||
            repairInfrastructure(tower) ||
            repairUnhealthyDefenses(tower);
        }
      }
    }
  }
};

/**
 * Calibrate defenseHitsTarget for rooms
 * @param {string} roomName
 */
const calibrateHitsTargets = (roomName) => {
  if (!Memory.defenses) {
    Memory.defenses = {};
    return;
  }

  if (!Memory.defenses[roomName]) {
    Memory.defenses[roomName] = {
      base: 2175,
      inc: 10000,
      defenseHitsTarget: 10000,
    };
    return;
  }

  const { base, inc, defenseHitsTarget } = Memory.defenses[roomName];
  let lowestDefHits = getLowestDefenseHits(roomName);
  console.log(roomName, base, lowestDefHits, "->", defenseHitsTarget);
  if (
    storeHasResource(getStorage(getRoom(roomName)), STORAGE_ENERGY_RESERVE) &&
    lowestDefHits >= defenseHitsTarget
  ) {
    Memory.defenses[roomName].base--;
    let numDefenses = getUnhealthyDefenses(
      WALL_HITS_MAX,
      getRoom(roomName)
    ).length;
    Memory.defenses[roomName].inc = Math.floor(
      (STORAGE_ENERGY_RESERVE / numDefenses) * 10
    );
    Memory.defenses[roomName].defenseHitsTarget =
      inc * Math.floor(Game.time / 28800 - base);
  }
};

/**
 * Activate all towers
 */
const activateTowers = () => {
  getMyRooms().forEach(activateTowersInRoom);
  getMyRooms().forEach(calibrateHitsTargets);
  // getMyRooms().forEach(roomName => {
  //   Memory.defenses[roomName] = {
  //     base: 2175,
  //     inc: 10000,
  //     defenseHitsTarget: 10000
  //   };
  // });
};

module.exports = {
  activateTowers,
};
