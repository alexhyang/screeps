const roomConfig = require("./dashboard");
const squadLogger = require("./logger.squad");
const { roundTo, parseNumber } = require("./logger.utils");
const {
  getHealthyDefenses,
  getUnhealthyDefenses,
  getController,
  getStorage,
  getTowers,
} = require("./util.structureFinder");
const {
  getEnergyAvailable,
  getEnergyCapacityAvailable,
} = require("./util.resourceManager");

const printRoomHeader = (roomName) => {
  console.log(
    "=== " +
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

const getEnergyMeta = (roomName) => {
  let room = Game.rooms[roomName];
  let storageMeta = getStorageMeta(roomName);
  let energyAvailable = getEnergyAvailable(room);
  let energyCapacityAvailable = getEnergyCapacityAvailable(room);
  let energyMeta =
    `Storage (${storageMeta}): ` +
    `${energyAvailable}/${energyCapacityAvailable}`;
  return energyMeta;
};

const getDefensesMeta = (roomName) => {
  let { TOWER_REPAIR_MIN_HITS } = roomConfig[roomName];
  let numHealthyWallsRamparts = getHealthyDefenses(
    TOWER_REPAIR_MIN_HITS,
    Game.rooms[roomName]
  ).length;
  let numUnhealthyWallsRamparts = getUnhealthyDefenses(
    TOWER_REPAIR_MIN_HITS,
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
    `WallsRamparts (${parseNumber(TOWER_REPAIR_MIN_HITS)}): ` +
    towerRepairProgress;
  return defenseMeta;
};

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

const getStorageMeta = (roomName) => {
  let target = getStorage(Game.rooms[roomName]);
  if (target) {
    let targetUsedCapacity = target.store.getUsedCapacity(RESOURCE_ENERGY);
    let targetMeta = `${parseNumber(targetUsedCapacity)}`;
    return targetMeta;
  }
  return "N/A";
};

module.exports = {
  logRoomInfo: function (roomName) {
    printRoomHeader(roomName);
    squadLogger.logSquadInfo(roomName);
    console.log("\n");
  },
};
