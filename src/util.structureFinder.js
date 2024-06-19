const { ROOM_NUMBER } = require("./dashboard");
let room = Game.rooms[ROOM_NUMBER];

var structureFinder = {
  getUnhealthyDefenses: function (minHealthyHits) {
    let unhealthyDefenses = room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_WALL ||
          s.structureType == STRUCTURE_RAMPART) &&
        s.hits < minHealthyHits,
    });
    return unhealthyDefenses;
  },
  getHealthyDefenses: function (minHealthyHits) {
    let healthyDefenses = room.find(FIND_STRUCTURES, {
      filter: (s) =>
        (s.structureType == STRUCTURE_WALL ||
          s.structureType == STRUCTURE_RAMPART) &&
        s.hits >= minHealthyHits,
    });
    return healthyDefenses;
  },
  getTowers: function () {
    let towers = room.find(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_TOWER,
    });
    return towers;
  },
};

module.exports = structureFinder;
