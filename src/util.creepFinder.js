var creepFinder = {
  /**
   * @param {string} creepRole
   * @returns {Object<string, Creep>} a hash containing creeps given their role
   * */
  getTeam: function (creepRole) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == creepRole);
  },
};

module.exports = creepFinder;
