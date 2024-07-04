const roomConfig = require("./dashboard");
const {
  getHealthyDefenses,
  getUnhealthyDefenses,
  getController,
  getStorage,
  getTowers,
  getContainers,
} = require("./util.structureFinder");
const {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
} = require("./util.resourceManager");
const { parseNumber, roundTo } = require("./utils");

/**
 * Get energy meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of energy in room, or undefined
 *    if room name is not included in room config
 */
const getEnergyMeta = (roomName) => {
  if (roomName in roomConfig) {
    let room = Game.rooms[roomName];
    let storageMeta = getStorageMeta(roomName);
    let containerMeta = getContainerMeta(roomName);
    let energyAvailable = getEnergyAvailable(room);
    let energyCapacityAvailable = getEnergyCapacityAvailable(room);
    let energyMeta =
      `${energyAvailable}/${energyCapacityAvailable}, ` +
      `Storage (${storageMeta}), ` +
      `Containers (${containerMeta})`;
    return energyMeta;
  }
};

/**
 * Get defense meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of defense in room, or undefined
 *    if room name is not included in room config
 */
const getDefenseMeta = (roomName) => {
  if (roomName in roomConfig) {
    const { minDefenseHitsToRepair } = roomConfig[roomName].tower;
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

    let defenseMeta =
      `Towers (${towerAvailableEnergy}) ` +
      `WallsRamparts (${parseNumber(minDefenseHitsToRepair)}): ` +
      towerRepairProgress;
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
  if (roomName in roomConfig) {
    let controller = getController(Game.rooms[roomName]);
    let current = parseNumber(controller.progress);
    let total = parseNumber(controller.progressTotal);
    let percentage = roundTo(
      Math.round((controller.progress / controller.progressTotal) * 100),
      1
    );
    let controllerMeta =
      `Controller (${controller.level}): ` +
      `${percentage}%: ${current}/${total}`;
    return controllerMeta;
  }
};

/**
 * Get storage meta data of room with the given name
 * @param {string} roomName
 * @returns {(string|undefined)} meta data of storage in room, or undefined
 *    if room name is not included in room config
 */
const getStorageMeta = (roomName) => {
  if (roomName in roomConfig) {
    let target = getStorage(Game.rooms[roomName]);
    if (target) {
      let targetUsedCapacity = target.store.getUsedCapacity(RESOURCE_ENERGY);
      let targetMeta = `${parseNumber(targetUsedCapacity)}`;
      return targetMeta;
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
  if (roomName in roomConfig) {
    let containers = getContainers(Game.rooms[roomName]);
    if (containers.length > 0) {
      let containerMeta = [];
      for (let i in containers) {
        let usedCapacity = containers[i].store.getUsedCapacity(RESOURCE_ENERGY);
        containerMeta.push(parseNumber(usedCapacity));
      }
      return containerMeta.join(", ");
    }
    return "N/A";
  }
};

module.exports = {
  getEnergyMeta,
  getDefenseMeta,
  getControllerMeta,
  getStorageMeta,
  getContainerMeta,
};
