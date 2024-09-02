const { findStructuresInRange } = require("./Creep");
const {
  transferResource,
  harvestFrom,
  withdrawFrom,
  pickupNearByResource,
} = require("./CreepResource");
const { getRoomMineralType } = require("./Room");
const {
  storeHasSpace,
  getUsedCapacity,
  storeHasResource,
  storeIsFull,
} = require("./util.resourceManager");
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

  if (mineral.mineralAmount == 0 && storeHasResource(storage, resourceType)) {
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
      pickupNearByResource(creep, getRoomMineralType(creep.room.name));
      harvestMineral(creep);
    } else {
      let nearbyContainers = findStructuresInRange(
        creep,
        STRUCTURE_CONTAINER,
        2
      );
      let terminal = getTerminal(creep.room);
      let storage = getStorage(creep.room);
      let factory = getFactory(creep.room);
      if (nearbyContainers.length > 0 && !storeIsFull(nearbyContainers[0])) {
        transferResource(creep, nearbyContainers[0]);
      } else if (factory && storeHasSpace(factory, getUsedCapacity(creep))) {
        transferResource(creep, factory);
      } else if (terminal && storeHasSpace(terminal, getUsedCapacity(creep))) {
        transferResource(creep, terminal);
      } else {
        transferResource(creep, storage);
      }
    }
  },
};
