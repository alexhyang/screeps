const {
  assignCreepToObtainEnergyFromSpawn,
  assignCreepToObtainEnergyFromSource,
  withdrawFromSpawnOk,
  withdrawFromContainerOk,
  assignCreepToObtainEnergyFromContainer,
  assignCreepToObtainEnergyFromStorage,
  pickupDroppedResources,
  assignCreepToObtainEnergyFromRuin,
  assignCreepToObtainEnergyFromTombstone,
} = require("./squad.resourceManager");
const { BUILDER_SOURCE_INDEX, BUILD_PRIORITY } = require("./dashboard");

/** @param {Creep} creep **/
const updateBuildingStatus = (creep) => {
  if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.building = false;
    creep.say("⛏");
  }

  if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
    creep.memory.building = true;
    creep.say("🔨");
  }
};

const buildConstructionSite = (creep, structureType = "none") => {
  let filter;
  if (structureType == "none") {
    filter = (s) => true;
  } else {
    filter = (s) => s.structureType === structureType;
  }
  let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
    filter: filter,
  });
  if (target) {
    build(creep, target);
  }
};

/** @param {Creep} creep **/
const obtainEnergy = (creep) => {
  if (creep.store.getFreeCapacity() > 0) {
    pickupDroppedResources(creep) ||
      assignCreepToObtainEnergyFromTombstone(creep) ||
      assignCreepToObtainEnergyFromRuin(creep) ||
      assignCreepToObtainEnergyFromStorage(creep) ||
      (withdrawFromContainerOk() &&
        assignCreepToObtainEnergyFromContainer(creep)) ||
      (withdrawFromSpawnOk() && assignCreepToObtainEnergyFromSpawn(creep));
  } else {
    assignCreepToObtainEnergyFromSource(creep, BUILDER_SOURCE_INDEX);
  }
};

const build = (creep, target) => {
  if (creep.build(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
};

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    updateBuildingStatus(creep);
    if (creep.memory.building) {
      buildConstructionSite(creep, BUILD_PRIORITY);
    } else {
      obtainEnergy(creep);
    }
  },
};

module.exports = roleBuilder;
