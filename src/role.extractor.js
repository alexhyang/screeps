const {
  transferResource,
  harvestFrom,
  withdrawFrom,
} = require("./CreepResource");
const { storeHasSpace, getUsedCapacity } = require("./util.resourceManager");
const {
  getStorage,
  getExtractor,
  getTerminal,
  getFactory,
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
    getUsedCapacity(storage, resourceType) > 0
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
    if (storeHasSpace(creep)) {
      harvestMineral(creep);
    } else {
      let terminal = getTerminal(creep.room);
      let storage = getStorage(creep.room);
      let factory = getFactory(creep.room);
      if (factory && storeHasSpace(factory, getUsedCapacity(creep))) {
        transferResource(creep, factory);
      } else if (terminal && storeHasSpace(terminal, getUsedCapacity(creep))) {
        transferResource(creep, terminal);
      } else {
        transferResource(creep, storage);
      }
    }
  },
};
