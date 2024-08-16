const { getMyRooms } = require("./configAPI");

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

module.exports = {
  run: (creep, assignedRoomName = "W34N43") => {
    if (getMyRooms().includes(assignedRoomName)) {
      let closestRampart = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_RAMPART },
      });
      if (creep.room.find(FIND_HOSTILE_CREEPS).length == 0) {
        creep.moveTo(19, 6);
      }
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
