const { getMyRooms, getRoomConfig } = require("./configAPI");
const {
  getHealthyDefenses,
  getUnhealthyDefenses,
  getController,
  getStorage,
  getTowers,
  getContainers,
  getTerminal,
} = require("./util.structureFinder");
const {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
  getUsedCapacity,
  getFreeCapacity
} = require("./util.resourceManager");
const { parseNumber, roundTo, padStr } = require("./utils");
const { getRoom } = require("./utils.game");

/**
 * Get energy meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of energy in room, or undefined
 *    if room name is not included in room config
 */
const getResourceMeta = (roomName) => {
  if (getMyRooms().includes(roomName)) {
    let resourceMeta =
      `${getEnergyMeta(roomName)}, ` +
      `STG (${getStorageMeta(roomName)}), ` +
      `TMN (${getTerminalMeta(roomName)}), ` +
      `CTN (${getContainerMeta(roomName)})`;
    return resourceMeta;
  }
};

/**
 * Get defense meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of defense in room, or undefined
 *    if room name is not included in room config
 */
const getDefenseMeta = (roomName) => {
  if (getMyRooms().includes(roomName)) {
    const { minDefenseHitsToRepair } = getRoomConfig(roomName).tower;
    let numHealthyWallsRamparts = getHealthyDefenses(
      minDefenseHitsToRepair,
      getRoom(roomName)
    ).length;
    let numUnhealthyWallsRamparts = getUnhealthyDefenses(
      minDefenseHitsToRepair,
      getRoom(roomName)
    ).length;
    let towerRepairProgress =
      numHealthyWallsRamparts +
      "/" +
      `${numHealthyWallsRamparts + numUnhealthyWallsRamparts}`;
    let towerAvailableEnergy = _.map(getTowers(getRoom(roomName)), (t) =>
      getUsedCapacity(t)
    );
    if (towerAvailableEnergy.length == 0) {
      towerAvailableEnergy = "N/A";
    }

    let defenseMeta =
      `TWR (${padStr(towerAvailableEnergy.join(","), 17)}) ` +
      "WR " +
      `(${padStr(parseNumber(getDefenseWithLowestHits(roomName)), 6, true)}/` +
      `${padStr(parseNumber(minDefenseHitsToRepair), 6, true)}): ` +
      padStr(towerRepairProgress, 7);
    return defenseMeta;
  }
};

/**
 * Get defense with lowest hits
 * @param {string} roomName
 * @returns {number} the hits of most unhealthy defense
 */
const getDefenseWithLowestHits = (roomName) => {
  let maxHits = 300000000;
  let defenses = getUnhealthyDefenses(maxHits, getRoom(roomName))
    .sort((a, b) => a.hits - b.hits)
    .filter((s) => !Memory.toDismantle.includes(s.id));
  return defenses.length == 0 ? maxHits : defenses[0].hits;
}

/**
 * Get controller meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of controller in room, or undefined
 *    if room name is not included in room config
 */
const getControllerMeta = (roomName) => {
  if (getMyRooms().includes(roomName)) {
    let controller = getController(getRoom(roomName));
    if (controller) {
      if (controller.level == 8) {
        return `CTRL (8) ${controller.ticksToDowngrade}`;
      }
      let current = parseNumber(controller.progress);
      let total = parseNumber(controller.progressTotal);
      let percentage = roundTo(
        Math.round((controller.progress / controller.progressTotal) * 100),
        1
      );
      let controllerMeta =
        `CTRL (${controller.level}): ` + `${percentage}%: ${current}/${total}`;
      return controllerMeta;
    }
    return "N/A";
  }
};

/**
 * Get total energy available to spawns creeps
 * @param {string} roomName
 * @returns {string} total energy in spawns and extensions
 */
const getEnergyMeta = (roomName) => {
  if (getMyRooms().includes(roomName)) {
    let room = getRoom(roomName);
    let energyAvailable = getEnergyAvailable(room);
    let energyCapacityAvailable = getEnergyCapacityAvailable(room);
    let energyMeta = `${energyAvailable}/${energyCapacityAvailable}`;
    return padStr(energyMeta, 11, true);
  }
};

/**
 * Get storage meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of storage in room, or undefined
 *    if room name is not included in room config
 */
const getStorageMeta = (roomName) => {
  if (getMyRooms().includes(roomName)) {
    let target = getStorage(getRoom(roomName));
    if (target) {
      return `${padStr(parseNumber(getUsedCapacity(target)), 7, true)} U|F ` +
        `${padStr(parseNumber(getFreeCapacity(target)), 7, true)}`;
    }
    return "N/A";
  }
};

/**
 * Get container meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of containers in room, or undefined
 *    if room name is not included in room config
 */
const getContainerMeta = (roomName) => {
  let numOfContainer = 4;
  let padToLength = 7 * numOfContainer - 2;
  if (getMyRooms().includes(roomName)) {
    let containers = getContainers(getRoom(roomName));
    if (containers.length > 0) {
      let containerMeta = [];
      for (let i in containers) {
        let container = containers[i];
        containerMeta.push(parseNumber(getUsedCapacity(container)));
      }
      return padStr(containerMeta.join(", "), padToLength, true);
    }
    return padStr("N/A", padToLength, true);
  }
};

const getTerminalMeta = (roomName, padding = true) => {
  let terminal = getTerminal(getRoom(roomName));
  if (terminal) {
    let mineralType = getRoomMineralType(roomName);
    let commodityType = getRoomCommodityType(mineralType);
    return (
      padStr(parseNumber(getUsedCapacity(terminal)), 7, true) +
      ", " +
      `${padStr(commodityType, 12, true)} ` +
      padStr(parseNumber(getUsedCapacity(terminal, commodityType)), 7, true)
    );
  }
};

/**
 * Get room mineral type
 * @param {string} roomName
 * @returns {string} type of mineral in room
 */
const getRoomMineralType = (roomName) => {
  let mineral = getRoom(roomName).find(FIND_MINERALS)[0];
  return mineral.mineralType;
};

/**
 * Get room mineral commodity type
 * @param {string} mineralType
 * @returns {string} type of mineral commodity in room
 */
const getRoomCommodityType = (mineralType) => {
  // let mineralType = getRoomMineralType(roomName); # refactor later
  switch (mineralType) {
    case RESOURCE_ZYNTHIUM:
      return RESOURCE_ZYNTHIUM_BAR;
    case RESOURCE_HYDROGEN:
      return RESOURCE_REDUCTANT;
    case RESOURCE_KEANIUM:
      return RESOURCE_KEANIUM_BAR;
    case RESOURCE_OXYGEN:
      return RESOURCE_OXIDANT;
  }
};

module.exports = {
  getResourceMeta,
  getDefenseMeta,
  getControllerMeta,
  getStorageMeta,
  getContainerMeta,
  getRoomMineralType,
  getRoomCommodityType
};
