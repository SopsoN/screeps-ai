/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.factory');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    clear: function() {
         for(let name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    checkCreepCount: function(roleName, creepLimit, creepsInRole) {        
        for(let index in Game.spawns) {
            let spawn = Game.spawns[index];
            if(
                creepsInRole.length < creepLimit 
                && spawn.spawning == null
                && spawn.canCreateCreep
            ) {
                let newName = roleName + 'SopsoN' + Game.time;
                
                let storeToMem = {
                    role: roleName,
                    harvesting: false
                };

                if(
                    spawn.spawnCreep(
                        [WORK,CARRY,MOVE], 
                        newName, 
                        {
                            memory: storeToMem
                        }
                    ) == OK
                ) {
                    console.log(roleName+': ' + creepsInRole.length);
                    console.log('Spawning new '+roleName+': ' + newName);
                }
            }
        };
        
    },
    run: function() {
        this.clear();

        let spawnsCount = 0;
        for(let i in Game.spawns) {
            spawnsCount++;
        }

        let HARVESTER_LIMIT = 4 * spawnsCount + 1;
        let BUILDER_LIMIT = 5 * spawnsCount + 1;
        let UPGRADER_LIMIT = 7 * spawnsCount + 1;
        
        let HarvesterCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'Harvester');
        let UpgraderCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'Upgrader');
        let BuilderCreeps = _.filter(Game.creeps, (creep) => creep.memory.role == 'Builder');

        this.checkCreepCount('Harvester', HARVESTER_LIMIT, HarvesterCreeps);
        
        if(HARVESTER_LIMIT <= HarvesterCreeps.length) {
            this.checkCreepCount('Upgrader', UPGRADER_LIMIT, UpgraderCreeps);
        
            if(UPGRADER_LIMIT <= UpgraderCreeps.length) {
                this.checkCreepCount('Builder', BUILDER_LIMIT, BuilderCreeps);
            }
        }
    }
};