const { buildClosestConstructionSite } = require("./Creep");
const { obtainResource } = require("./CreepResource");
const { getMyRooms, getRoomConfig } = require("./configAPI");
const { storeIsEmpty, storeIsFull } = require("./util.resourceManager");

/**
 * Update the building status of the builder creep
 * @param {Creep} creep
 */
const updateBuildingStatus = (creep) => {
  if (
    getMyRooms().includes(creep.room.name) &&
    creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES) == null
  ) {
    creep.memory = { role: "repairer" };
    return;
  }

  if (creep.memory.building && storeIsEmpty(creep)) {
    creep.memory.building = false;
    creep.say("⛏");
  }

  if (!creep.memory.building && storeIsFull(creep)) {
    creep.memory.building = true;
    creep.say("🔨");
  }
};

/**
 * Let the builder creep obtain energy for construction
 * @param {Creep} creep
 */
const obtainEnergy = (creep) => {
  const { sourceOrigins, sourceIndex } = getRoomConfig(creep.room.name).builder;
  obtainResource(creep, sourceOrigins, sourceIndex);
};

module.exports = {
  /** @param {Creep} creep **/
  run: function (creep) {
    updateBuildingStatus(creep);
    if (creep.memory.building) {
      buildClosestConstructionSite(
        creep,
        getRoomConfig(creep.room.name).builder.buildingPriority
      );
    } else {
      obtainEnergy(creep);
    }
  },
};
