epairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // If creep is full of energy, send it out to work, otherwise, get energy until full
        if (creep.carry.energy == 0) {
            creep.memory.get_energy = true;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.get_energy = false;
        }
        
	    if(creep.memory.get_energy) {
	        // Get energy. Preference is from a container, otherwise an energy source
	        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
	            filter: (s) => {return s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0}
            });
            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container)
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            var broken_structure;
            
            // Get structures that are more than 3/4 broken (otherwise creeps will keep repairing structures close-by). Exclude walls
            if (!broken_structure) {
                broken_structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {return s.structureType != STRUCTURE_WALL && s.hits < s.hitsMax / 1.5;}
                });
            }
            // Else include walls as an option. For now, only repair walls up to 0.3% (1M hits)
            if (!broken_structure) {
                broken_structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {return s.hits < s.hitsMax / 300;}
                });
            }
            if (broken_structure) {
                if (creep.repair(broken_structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(broken_structure, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } 
            // Standby position when nothing is left to repair
            else {
                // TODO: Put this in one location that applies to all roles
                creep.moveTo(43,30);
            }
        }
	}
};

module.exports = roleRepairer;
