const roomConfig = require("./dashboard");
const { obtainResource } = require("./role.creepManager");

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
  let filter = (s) => true;
  let buildingPriority = roomConfig[creep.room].BUILD_PRIORITY;
  if (buildingPriority !== "none") {
    filter = (s) => s.structureType === buildingPriority;
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
  obtainResource(
    creep,
    [
      "droppedResources",
      "tombstone",
      "ruin",
      "storage",
      "container",
      "spawn",
      "source",
    ],
    roomConfig[creep.room.name].BUILDER_SOURCE_INDEX
  );
};

const build = (creep, target) => {
  if (creep.build(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
};

const buildById = (creep, targetId) => {
  var target = Game.getObjectById(targetId);
  if (creep.build(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
  }
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
  buildById,
};

module.exports = roleBuilder;
