var defenses = {
  activateTower: function (towerId, repair) {
    var tower = Game.getObjectById(towerId);
    if (tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(
        FIND_STRUCTURES,
        {
          filter: (structure) => structure.hits < structure.hitsMax,
        }
      );
      if (closestDamagedStructure && repair) {
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
