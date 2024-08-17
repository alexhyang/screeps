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
} = require("./util.resourceManager");
const { parseNumber, roundTo, padStr } = require("./utils");

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
      Game.rooms[roomName]
    ).length;
    let numUnhealthyWallsRamparts = getUnhealthyDefenses(
      minDefenseHitsToRepair,
      Game.rooms[roomName]
    ).length;
    let towerRepairProgress =
      numHealthyWallsRamparts +
      "/" +
      `${numHealthyWallsRamparts + numUnhealthyWallsRamparts}`;
    let towerAvailableEnergy = _.map(getTowers(Game.rooms[roomName]), (t) =>
      t.store.getUsedCapacity(RESOURCE_ENERGY)
    );
    if (towerAvailableEnergy.length == 0) {
      towerAvailableEnergy = "N/A";
    }

    let defenseMeta =
      `TWR (${padStr(towerAvailableEnergy.join(","), 17)}) ` +
      `WR (${padStr(parseNumber(minDefenseHitsToRepair), 4, true)}): ` +
      padStr(towerRepairProgress, 7);
    return defenseMeta;
  }
};

/**
 * Get controller meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of controller in room, or undefined
 *    if room name is not included in room config
 */
const getControllerMeta = (roomName) => {
  if (getMyRooms().includes(roomName)) {
    let controller = getController(Game.rooms[roomName]);
    if (controller) {
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
    let room = Game.rooms[roomName];
    let energyAvailable = getEnergyAvailable(room);
    let energyCapacityAvailable = getEnergyCapacityAvailable(room);
    let energyMeta = `${energyAvailable}/${energyCapacityAvailable}`;
    return padStr(energyMeta, 9, true);
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
    let target = getStorage(Game.rooms[roomName]);
    if (target) {
      let targetUsedCapacity = target.store.getUsedCapacity(RESOURCE_ENERGY);
      return padStr(parseNumber(targetUsedCapacity), 7, true);
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
  if (getMyRooms().includes(roomName)) {
    let containers = getContainers(Game.rooms[roomName]);
    if (containers.length > 0) {
      let containerMeta = [];
      for (let i in containers) {
        let usedCapacity = containers[i].store.getUsedCapacity(RESOURCE_ENERGY);
        containerMeta.push(parseNumber(usedCapacity));
      }
      return padStr(containerMeta.join(", "), 24, true);
    }
    return "N/A";
  }
};

const getTerminalMeta = (roomName, padding = true) => {
  let terminal = getTerminal(Game.rooms[roomName]);
  if (terminal) {
    let mineralType = Game.rooms[roomName].find(FIND_MINERALS)[0].mineralType;
    let energyInTerminal = terminal.store.getUsedCapacity(RESOURCE_ENERGY);
    let mineralInTerminal = terminal.store.getUsedCapacity(mineralType);
    return (
      padStr(parseNumber(energyInTerminal), 7, true) +
      ", " +
      `${mineralType} ` +
      padStr(parseNumber(mineralInTerminal), 7, true)
    );
  }
};

module.exports = {
  getResourceMeta,
  getDefenseMeta,
  getControllerMeta,
  getStorageMeta,
  getContainerMeta,
};
