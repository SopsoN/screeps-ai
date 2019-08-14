module.exports = {
    build: function(room, spawn) {
        if(room.memory.hasRoads) {
            return;
        }

        if(typeof room.memory.sources === 'undefined') {
            room.memory.sources = [];
        }

        let sources = room.find(FIND_SOURCES);

        let goals = _.filter(sources, function(source) {
            if(typeof room.memory.sources[source.id] === 'undefined') {
                room.memory.sources[source.id] = {
                    hasRoad: true
                };
                return true;
            }
            return false;
        }).map(function(source) {
            return { pos: source.pos, range: 2 };
        });
        
        let roadTiles = PathFinder.search(
            spawn.pos, 
            goals,
            {
                plainCost: 2,
                swampCost: 10,
                roomCallback: function() {
                    if (!room) { 
                        return;
                    }
                    let costs = new PathFinder.CostMatrix;
            
                    room.find(FIND_STRUCTURES).forEach(function(struct) {
                        if (struct.structureType === STRUCTURE_ROAD) {
                            // Favor roads over plain tiles
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        } 
                        else if (
                            struct.structureType !== STRUCTURE_CONTAINER &&
                            (
                                struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my
                            )
                        ) {
                            // Can't walk through non-walkable buildings
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });
            
                    // Avoid creeps in the room
                    room.find(FIND_CREEPS).forEach(function(creep) {
                        costs.set(creep.pos.x, creep.pos.y, 0xff);
                    });
            
                    return costs;
              },
            }
        );

        for(let index in roadTiles.path) {
            room.createConstructionSite(roadTiles.path[index].x, roadTiles.path[index].y, STRUCTURE_ROAD);
        }

        room.memory.hasRoads = true;
    }    
}