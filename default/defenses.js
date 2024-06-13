var defenses = {
  activateTower: function () {
    var tower = Game.getObjectById("b8a61789822da434b0ce2255");
    if (tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        {
          filter: (structure) => structure.hits < structure.hitsMax,
        }
      );
      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower.attack(closestHostile);
      }
    }
  },
};
