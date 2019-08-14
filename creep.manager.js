/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.manager');
 * mod.thing == 'a thing'; // true
 */

let creepHarvester = require('creep.harvester');
let creepUpgrader = require('creep.upgrader');
let creepBuilder = require('creep.builder');

module.exports = {
    run: function() {
        for(let name in Game.creeps) {
            let creep = Game.creeps[name];
            
            switch(creep.memory.role) {
                case 'Harvester':
                    creepHarvester.run(creep);
                break;
                case 'Upgrader':
                    creepUpgrader.run(creep);
                break;
                case 'Builder':
                    creepBuilder.run(creep);
                break;
            }
        }
    }
};