let CreepFactory = require('creep.factory');
let CreepManager = require('creep.manager');
let ConstructionManager = require('construction.manager');

module.exports.loop = function () {    
    CreepFactory.run();
    CreepManager.run();
    ConstructionManager.run();
}