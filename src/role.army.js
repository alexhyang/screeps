const roomConfig = require("./dashboard");

const attack = (creep, enemy) => {
  if (enemy) {
    if (creep.rangedAttack(enemy) == ERR_NOT_IN_RANGE) {
      creep.moveTo(enemy);
    }
  }
};

const heal = (creep) => {
  const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
    filter: function (object) {
      return object.hits < object.hitsMax;
    },
  });
  if (target) {
    if (creep.heal(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};

const deploy = (creep, targetRoomName) => {
  creep.moveTo(new RoomPosition(25, 25, targetRoomName));
};

var roleArmy = {
  run: (creep, assignedRoomName = "W38N43") => {
    if (assignedRoomName in roomConfig) {
      let closestRampart = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_RAMPART },
      });
      // creep.moveTo(closestRampart);
      heal(creep);
    }
    const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (enemy) {
      attack(creep, enemy);
      if (creep.pos.inRangeTo(enemy, 2)) {
        deploy(creep, assignedRoomName);
      }
      heal(creep);
    } else if (creep.room.name !== assignedRoomName) {
      deploy(creep, assignedRoomName);
    }
    heal(creep);
  },
};

module.exports = roleArmy;
