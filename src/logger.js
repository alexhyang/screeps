const roomConfig = require("./dashboard");
const squadLogger = require("./logger.squad");
const { roundTo, parseNumber } = require("./logger.utils");
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

/**
 * Print log header of room with the given name
 * @param {string} roomName
 */
const printRoomHeader = (roomName) => {
  console.log(
    "=== " +
      (Game.time % 1000000) +
      " " +
      roomName +
      " // " +
      getEnergyMeta(roomName) +
      " | " +
      getDefensesMeta(roomName) +
      " | " +
      getControllerMeta(roomName) +
      " ==="
  );
};

/**
 * Get energy meta data of room with the given name
 * @param {string} roomName
 */
const getEnergyMeta = (roomName) => {
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
};

/**
 * Get defense meta data of room with the given name
 * @param {string} roomName
 */
const getDefensesMeta = (roomName) => {
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
};

/**
 * Get controller meta data of room with the given name
 * @param {string} roomName
 */
const getControllerMeta = (roomName) => {
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
};

/**
 * Get storage meta data of room with the given name
 * @param {string} roomName
 */
const getStorageMeta = (roomName) => {
  let target = getStorage(Game.rooms[roomName]);
  if (target) {
    let targetUsedCapacity = target.store.getUsedCapacity(RESOURCE_ENERGY);
    let targetMeta = `${parseNumber(targetUsedCapacity)}`;
    return targetMeta;
  }
  return "N/A";
};

/**
 * Get container meta data of room with the given name
 * @param {string} roomName
 */
const getContainerMeta = (roomName) => {
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
};

/**
 * Print invasion records
 */
function printInvasionRecords() {
  if (Memory.hostiles) {
    for (let i in Memory.hostiles) {
      console.log(Memory.hostiles[i].roomName, Memory.hostiles[i].time);
    }
  }
}

module.exports = {
  run: function () {
    for (let roomName in roomConfig) {
      printRoomHeader(roomName);
      squadLogger.logSquadInfo(roomName);
      printInvasionRecords();
      console.log("\n");
    }
  },
};
