module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
            if(creep.memory.harvesting) {
                creep.harvest(Game.getObjectById(creep.memory.sourceId));
                return;
            }
            
            let sources = creep.room.find(FIND_SOURCES);
            
            let sortedSources = [];
            for(let index in sources) {
                let source = sources[index];

                source.distance = this.calculateDistacne(
                    source.pos.x, 
                    source.pos.y,
                    creep.pos.x,
                    creep.pos.y
                );

                sortedSources.push(source);
            }

            sortedSources.sort(function(a,b) { 
                return a.distance < b.distance
            });

            sortedSources.reverse();

            for(let index in sortedSources) {
                let source = sortedSources[index];
                if(creep.pos.isNearTo(source)) {
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                    else {
                        return;
                    }
                }
            };

            for(let index in sortedSources) {
                let source = sortedSources[index];

                for(let posX = -1; posX <= 1; posX++) {
                    for(let posY = -1; posY <= 1; posY++) {
                        
                        let creepInPosition = false;

                        for(let index in Game.creeps) {
                            if(Game.creeps[index].pos.x == source.pos.x+posX && 
                                Game.creeps[index].pos.y == source.pos.y+posY
                            ) { 
                                creepInPosition = true;
                            }
                        }

                        if(creepInPosition) {
                            continue;
                        }

                        let resourcesInPos = creep.room.lookAt(source.pos.x+posX, source.pos.y+posY);

                        for(let index in resourcesInPos) {
                            let res = resourcesInPos[index];

                            if(res.type == 'terrain' &&
                                res.terrain != 'wall' &&
                                res.terrain == 'plain' &&
                                typeof res.energy === 'undefined' &&
                                typeof res.creep === 'undefined'
                            ) {
                                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                                } else if(creep.harvest(source) == OK) {
                                    creep.memory.harvesting = true;
                                    creep.memory.sourceId = source.id;
                                }
                                return;
                            }
                        };
                    }
                }
            };
        }
        else {
            creep.memory.harvesting = false;
            if(creep.memory.sourceId) {
                delete creep.memory.sourceId;
            }
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            
            if(targets.length) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
    calculateDistacne: function(posX1, posY1, posX2, posY2) {
        let dx = Math.pow((posX2 - posX1), 2);
        let dy = Math.pow((posY2 - posY1), 2);

        return Math.sqrt((dx+dy));
    }
};