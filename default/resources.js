const { SPAWN_WITHDRAW_THRESHOLD } = require("./strategy.parameters");
// structure id's
const structureExtensions = new Set();
structureExtensions.add("6669acae4416c85f20d3c1ab");
structureExtensions.add("6669f14980326a5d7a9df7c0");
structureExtensions.add("666a4fe56bce396094619218");
structureExtensions.add("666a6db0f354fc685f615f0d");

let resources = {
  withdrawFromSpawnOk: function () {
    return this.getTotalEnergy() >= SPAWN_WITHDRAW_THRESHOLD;
  },
  getTotalEnergyCapacity: function () {
    return (
      this.getEnergyCapacityOfSpawns() + this.getEnergyCapacityOfExtensions()
    );
  },
  getTotalEnergy: function () {
    return this.getEnergyInSpawns() + this.getEnergyInExtensions();
  },
  getEnergyCapacityOfSpawns: function () {
    let energy = 0;
    for (let name in Game.spawns) {
      energy += Game.spawns[name].store.getCapacity(RESOURCE_ENERGY);
    }
    return energy;
  },
  getEnergyCapacityOfExtensions: function () {
    let energy = 0;
    structureExtensions.forEach((id) => {
      energy += Game.structures[id].store.getCapacity(RESOURCE_ENERGY);
    });
    return energy;
  },
  getEnergyInSpawns: function () {
    let energy = 0;
    for (let name in Game.spawns) {
      energy += Game.spawns[name].store.getUsedCapacity(RESOURCE_ENERGY);
    }
    return energy;
  },
  getEnergyInExtensions: function () {
    let energy = 0;
    structureExtensions.forEach((id) => {
      energy += Game.structures[id].store.getUsedCapacity(RESOURCE_ENERGY);
    });
    return energy;
  },
  /** @param {Creep} creep **/
  assignCreepToObtainEnergyFromSpawn: function (creep) {
    var spawn = creep.room.find(FIND_MY_SPAWNS)[0];
    if (
      resources.withdrawOk() &&
      creep.pos.getRangeTo(spawn) == 1 &&
      creep.withdraw(spawn, RESOURCE_ENERGY) == OK
    ) {
      creep.memory.building = true;
    } else {
      creep.moveTo(spawn, {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
  },
  /** @param {Creep} creep **/
  assignCreepToObtainEnergyFromSource: function (creep) {
    var sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], {
        visualizePathStyle: { stroke: "#ffaa00" },
      });
    }
  },
};

module.exports = resources;
