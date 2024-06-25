const roomConfig = require("./dashboard");
const {
  obtainResource,
  buildClosestConstructionSite,
} = require("./role.creepManager");

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
      buildClosestConstructionSite(
        creep,
        roomConfig[creep.room.name].builder.buildingPriority
      );
    } else {
      obtainEnergy(creep);
    }
  },
};

module.exports = roleBuilder;
