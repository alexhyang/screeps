const resources = require("resources");

var resourceLogger = {
  log: function () {
    let totalEnergy = resources.getTotalEnergy();
    let totalEnergyCapacity = resources.getTotalEnergyCapacity();
    console.log("Energy: " + `${totalEnergy}/${totalEnergyCapacity}`);
  },
};

module.exports = resourceLogger;
