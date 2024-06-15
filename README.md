# Screeps Notes

## Concepts

1.  creeps
    1.  skills based on part types
        *   WORK, MOVE, CARRY
        *   ATTACK, RANGED_ATTACK, HEAL
        *   CLAIM, TOUGH

1.  room
    1.  controller (claim control of the room, HQ of the room)

## GamePlay

1.  tasks

    ```javascript
    // spawning creeps
    Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester1' );
    Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Upgrader1' );
    Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Builder1',
        { memory: { role: 'builder' }}
    );
    Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
        'HarvesterBig', { memory: { role: 'harvester' } }
    );

    // storage
    Game.rooms[roomName].energyAvailable;
    Game.rooms[roomName].energyCapacityAvailable;
    Game.structure[hashCode].store.getCapacity(RESOURCE_ENERGY);
    Game.structure[hashCode].store.getUsedCapacity(RESOURCE_ENERGY);

    // construction and resource finding
    //   harvester: spawns + extensions > containers
    //   builders & repairers: containers > spawn > source
    //   upgraders: containers > source

    // activate the safe mode
    Game.spawns['Spawn1'].room.controller.activateSafeMode();

    // create construction site
    Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );

    // change role of creep
    Game.creeps[creepName].memory = { role: myRole }
    ```

## Scripts

1.  [organizing scripts using modules](https://docs.screeps.com/modules.html)

## References

1.  [screeps docs](https://docs.screeps.com/)
1.  [API](https://docs.screeps.com/api/)
