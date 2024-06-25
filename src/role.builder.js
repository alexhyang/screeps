const roomConfig = require("./dashboard");
const { obtainResource, buildTarget } = require("./role.creepManager");

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

const buildConstructionSite = (creep) => {
  let { buildingPriority } = roomConfig[creep.room.name].builder;
  let filter =
    buildingPriority == "none"
      ? (s) => true
      : (s) => s.structureType === buildingPriority;

  let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
    filter: filter,
  });

  if (target) {
    buildTarget(creep, target);
  }
};

/** @param {Creep} creep **/
const obtainEnergy = (creep) => {
  const { sourceOrigins, sourceIndex } = roomConfig[creep.room.name].builder;
  obtainResource(creep, sourceOrigins, sourceIndex);
};

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    updateBuildingStatus(creep);
    if (creep.memory.building) {
      buildConstructionSite(creep);
    } else {
      obtainEnergy(creep);
    }
  },
};

module.exports = roleBuilder;
