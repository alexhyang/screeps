var squadLogger = require("./logger.squad");
const { ROOM_NUMBER, TOWER_REPAIR_MIN_HITS } = require("./dashboard");
const { roundTo, parseNumber } = require("./logger.utils");
const {
  getHealthyDefenses,
  getUnhealthyDefenses,
  getStructure,
  getController,
} = require("./util.structureFinder");

const printLogTitle = () => {
  console.log(
    "=== " +
      `${Game.time % 1000000}` +
      " // " +
      getEnergyMeta() +
      " | " +
      getDefensesMeta() +
      " | " +
      getControllerMeta() +
      " ==="
  );
};

const getEnergyMeta = () => {
  let containerMeta = getContainerMeta();
  let storageMeta = getStorageMeta();
  let energyAvailable = Game.rooms[ROOM_NUMBER].energyAvailable;
  let energyCapacityAvailable = Game.rooms[ROOM_NUMBER].energyCapacityAvailable;
  let energyMeta =
    `Energy (${containerMeta}, ${storageMeta}): ` +
    `${energyAvailable}/${energyCapacityAvailable}`;
  return energyMeta;
};

const getDefensesMeta = () => {
  let numHealthyWallsRamparts = getHealthyDefenses(
    TOWER_REPAIR_MIN_HITS
  ).length;
  let numUnhealthyWallsRamparts = getUnhealthyDefenses(
    TOWER_REPAIR_MIN_HITS
  ).length;
  let towerRepairProgress =
    numHealthyWallsRamparts +
    "/" +
    `${numHealthyWallsRamparts + numUnhealthyWallsRamparts}`;
  let towerAvailableEnergy = _.map(getStructure(STRUCTURE_TOWER), (t) =>
    t.store.getUsedCapacity(RESOURCE_ENERGY)
  );

  let defenseMeta =
    `Towers (${towerAvailableEnergy}) ` +
    `WallsRamparts (${parseNumber(TOWER_REPAIR_MIN_HITS)}): ` +
    towerRepairProgress;
  return defenseMeta;
};

const getControllerMeta = () => {
  let controller = getController();
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

const getContainerMeta = () => {
  return getStructureMeta(STRUCTURE_CONTAINER);
};
const getStorageMeta = () => {
  return getStructureMeta(STRUCTURE_STORAGE);
};

const getStructureMeta = (structureType) => {
  let target = getStructure(structureType)[0];
  let targetUsedCapacity = target.store.getUsedCapacity(RESOURCE_ENERGY);
  let targetMeta = `${parseNumber(targetUsedCapacity)}`;
  return targetMeta;
};

module.exports = {
  log: function () {
    printLogTitle();
    squadLogger.log();
    console.log("\n");
  },
};
