const { transferResource, stayInSameRoom, harvestFrom } = require("./Creep");
const { getStorage, getExtractor } = require("./util.structureFinder");

const harvestMineral = (creep) => {
  let mineral = creep.room.find(FIND_MINERALS)[0];
  if (mineral.mineralAmount == 0) {
    creep.memory = { role: "repairer" };
    return;
  }
  if (!creep.memory.resourceTypes && mineral) {
    creep.memory.resourceTypes = [];
    creep.memory.resourceTypes.push(mineral.mineralType);
  }
  let extractor = getExtractor(creep.room);
  if (extractor) {
    harvestFrom(creep, mineral);
  } else {
    creep.memory = { role: "repairer" };
  }
};

var roleExtractor = {
  /** @param {Creep} creep **/
  run: function (creep) {
    stayInSameRoom(creep);
    if (creep.store.getFreeCapacity() > 0) {
      harvestMineral(creep);
    } else {
      let storage = getStorage(creep.room);
      transferResource(creep, storage);
    }
  },
};

module.exports = roleExtractor;
