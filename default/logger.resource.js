var resourceLogger = {
  log: function () {
    let energyAvailable = Game.rooms["W35N43"].energyAvailable;
    let energyCapacityAvailable = Game.rooms["W35N43"].energyCapacityAvailable;
    console.log("Energy: " + `${energyAvailable}/${energyCapacityAvailable}`);
  },
};

module.exports = resourceLogger;
