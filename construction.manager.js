let ConstructionRoads = require('construction.roads');
let ConstructionExtensions = require('consrtruction.extensions');

module.exports = {
    run: function() {
        for(let index in Game.spawns) {
            let spawn = Game.spawns[index];
            let room = spawn.room;
            let countOfExtensions = room.find(STRUCTURE_EXTENSION);
            let limitOfExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];

            if(countOfExtensions < limitOfExtensions+1) {
                ConstructionExtensions.build(room, spawn, countOfExtensions, limitOfExtensions+1);
            }

            if(countOfExtensions >= limitOfExtensions) {
                ConstructionRoads.build(room, spawn);
            }
        }
    },
    runRepais: function() {
        
    }
}