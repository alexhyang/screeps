// structure id's
const structureExtensions = new Set();
structureExtensions.add("6669acae4416c85f20d3c1ab");
structureExtensions.add("6669f14980326a5d7a9df7c0");
structureExtensions.add("666a4fe56bce396094619218");
structureExtensions.add("666a6db0f354fc685f615f0d");

var resourceLogger = {
  log: function () {
    let totalEnergyCapacity = 0;
    let totalEnergy = 0;
    totalEnergyCapacity +=
      Game.spawns["Spawn1"].store.getCapacity(RESOURCE_ENERGY);
    totalEnergy += Game.spawns["Spawn1"].store.getUsedCapacity(RESOURCE_ENERGY);
    structureExtensions.forEach((id) => {
      let extension = Game.structures[id];
      totalEnergyCapacity += extension.store.getCapacity(RESOURCE_ENERGY);
      totalEnergy += extension.store.getUsedCapacity(RESOURCE_ENERGY);
    });

    console.log("Energy: " + `${totalEnergy}/${totalEnergyCapacity}`);
  },
};

module.exports = resourceLogger;
