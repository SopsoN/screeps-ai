let CreepUpgrader = require('creep.upgrader');

module.exports = {
     /** @param {Creep} creep **/
    run: function(creep) {
		// creep.memory.building = false;
		let targets = [];

		if(creep.memory.building && creep.carry.energy > 0) {
			if(creep.memory.buildingId) {
				creep.build(Game.getObjectById(creep.memory.buildingId));
				return;
			}
			else {
				targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				this.findBuildTarget(creep, targets);
				return;
			}
		}

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
		}

	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
			targets = creep.room.find(FIND_CONSTRUCTION_SITES);

			if(targets.length > 0) {
				creep.memory.building = true;
				creep.say('🚧 build');
			}
			else {
				creep.memory.building = false;
				creep.say('⚡ upgrade');
			}
		}

		this.findBuildTarget(creep, targets);
	},
	findBuildTarget: function(creep, targets) {
		if(targets.length && creep.memory.building) {
            if(targets.length) {
				for(let index in targets) {
					if(creep.build(targets[index]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[index], {visualizePathStyle: {stroke: '#ffffff'}});
					} else if(creep.build(targets[index]) == OK) {
						creep.memory.building = true;
						creep.memory.buildingId = targets[index].id;
					}
					return;
				}
            }
	    }
	    else {
			creep.memory.building = false;

			if(creep.memory.buildingId) {
				delete creep.memory.buildingId;
			}

			CreepUpgrader.run(creep);
	    }
	}
};