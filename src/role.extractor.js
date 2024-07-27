const { transferResource, harvestFrom } = require("./CreepResource");
const { getStorage, getExtractor, getTerminal } = require("./util.structureFinder");

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
    if (creep.store.getFreeCapacity() > 0) {
      harvestMineral(creep);
    } else {
      let terminal = getTerminal(creep.room);
      let storage = getStorage(creep.room);
      if (terminal && terminal.store.getFreeCapacity() > 0) {
        transferResource(creep, terminal);
      } else {
        transferResource(creep, storage);
      }
    }
  },
};

module.exports = roleExtractor;
