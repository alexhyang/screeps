const {
  transferResource,
  harvestFrom,
  withdrawFrom,
} = require("./CreepResource");
const {
  getStorage,
  getExtractor,
  getTerminal,
} = require("./util.structureFinder");

const memorizeMineralResourceType = (creep, mineral) => {
  if (
    mineral &&
    (!creep.memory.resourceTypes || creep.memory.resourceTypes.length == 0)
  ) {
    creep.memory.resourceTypes = [];
    creep.memory.resourceTypes.push(mineral.mineralType);
  }
};

const harvestMineral = (creep) => {
  let mineral = creep.room.find(FIND_MINERALS)[0];
  let extractor = getExtractor(creep.room);
  let resourceType = mineral.mineralType;
  let storage = getStorage(creep.room);

  memorizeMineralResourceType(creep, mineral);

  if (
    mineral.mineralAmount == 0 &&
    storage.store.getUsedCapacity(resourceType) > 0
  ) {
    console.log(
      creep.room.name,
      "transferring from storage to terminal...",
      resourceType
    );
    withdrawFrom(creep, storage, resourceType);
    return;
  }

  if (mineral.mineralAmount > 0 && extractor) {
    harvestFrom(creep, mineral);
    return;
  }

  creep.memory = { role: "repairer" };
};

module.exports = {
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
