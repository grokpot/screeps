
f (creep.carry.energy == 0) {
            creep.memory.get_energy = true;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.get_energy = false;
        }
        
	    if(creep.memory.get_energy) {
	        var target;
	        // Priority #1: Withdraw from storage
	        if (!target) {
	            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
	            filter: (s) => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] > 0});
	        }
	        // Priority #2: Withdraw from containers
	        if (!target) {
	            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
	            filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});
	        }
	        // Move to withdraw
	        if (target) {
	            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
	        }
	        // Priority #3: harvest from source
	        else {
	            target = creep.pos.findClosestByPath(FIND_STRUCTURES)
	            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
	        }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
	}
};

module.exports = roleUpgrader;
