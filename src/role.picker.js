const { pickupDroppedResources } = require("./squad.resourceManager");

var rolePicker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      pickupDroppedResources(creep);
    } else {
      this.transferEnergy(creep);
    }
  },
  transferEnergy: function (creep) {
    let spawn = creep.room.find(FIND_MY_SPAWNS)[0];
    if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(spawn, {
        visualizePathStyle: { stroke: "#ffffff" },
      });
    }
  },
};

module.exports = rolePicker;
