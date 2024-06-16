var rolePicker = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      this.pickupDroppedTarget(creep);
    } else {
      this.transferEnergy(creep);
    }
  },
  pickupDroppedTarget(creep) {
    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
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
