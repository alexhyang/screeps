const resources = require("resources");

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }

    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        }
      }
    } else {
      if (resources.withdrawOk()) {
        var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
        if (
          resources.withdrawOk() &&
          creep.pos.getRangeTo(spawn) == 1 &&
          creep.withdraw(spawn, RESOURCE_ENERGY) == OK
        ) {
          creep.memory.building = true;
        } else {
          creep.moveTo(spawn, {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      } else {
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
          });
        }
      }
    }
  },
};

module.exports = roleBuilder;
