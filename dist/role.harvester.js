 = require('utils');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // If creep is full of energy, send it out to work, otherwise, get energy until full
        if (creep.carry.energy == 0) {
            creep.memory.get_energy = true;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.get_energy = false;
        }

	    if (creep.memory.get_energy) {
	        
	        // Assign an energy source to a harvester
            if (creep.memory.source_id === undefined) {
                var uu_sources = utils.underutilizedSources();
                console.log('uu: ', uu_sources)
                if (uu_sources.length) {
                    creep.memory.source_id = uu_sources[0];
                }
            }
            
            // Move the harvester to the energy source
            var source = Game.getObjectById(creep.memory.source_id);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            
            var target;
            
            // Priority #1: Fill Spawn - only for top source
            if (!target && creep.memory.source_id !== '5982febab097071b4adc16a8') {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {return s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity;}
                });
            }
            // Priority #3: Fill Extensions - only for top source
            if (!target && creep.memory.source_id !== '5982febab097071b4adc16a8') {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {return s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity;}
                });
            }
            // Priority #2: Fill Containers
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] < s.storeCapacity;}
                });
            }
            
            // Move harvester to target
            if (target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;
