const {
  TOWER_REPAIR_MIN_HITS,
  TOWER_REPAIR_MIN_ENERGY,
} = require("./dashboard");

var defenses = {
  activateTower: function (towerId, repair) {
    var tower = Game.getObjectById(towerId);
    if (tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        {
          filter: (structure) =>
            (structure.structureType == STRUCTURE_RAMPART ||
              structure.structureType == STRUCTURE_WALL) &&
            structure.hits < TOWER_REPAIR_MIN_HITS,
        }
      );
      if (
        repair &&
        closestDamagedStructure &&
        tower.store.getUsedCapacity(RESOURCE_ENERGY) >= TOWER_REPAIR_MIN_ENERGY
      ) {
        tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      }
    }
  },
};

module.exports = defenses;
