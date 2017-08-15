var roleMover = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var TOWER_ID = '59887bc47eacb63924212837',
            CENTRAL_DIST_CONT_ID = '598a22a6fb91c1145a9a8c9e';
	    
	    if(creep.carry.energy == 0) {
	        
	        // TODO:
	        // for each energy source
	            // find the closest container (hacky way of not having to directly specify IDs of harvest containers)
	            // if container is > 25% full (creates a way of automatically alternating so movers don't get stuck at one container)
	            // move energy to storage
            // if no harvest containers to act upon
                // move energy from storage to upgrade container
            // TODO: create extension and spawn filler role
            // TODO: refactor upgraders to prefer upgrade container, otherwise go to storage
            // TODO: refactor repairers to pull from storage
            // TODO: refactor builders to pull from storage
	        
	        // Get energy from the most full container
	        var containers = creep.room.find(FIND_STRUCTURES, {
	            filter: (c) => (
	                c.structureType == STRUCTURE_CONTAINER && 
	                c.store[RESOURCE_ENERGY] > 0 &&
	                // Exclude central distribution container
	                c.id != CENTRAL_DIST_CONT_ID)});
	        if (containers) {
	            var highestContainer = _.max(containers, function(c){ return c.store[RESOURCE_ENERGY]; }); 
	            if (highestContainer) {
                    if (creep.withdraw(highestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(highestContainer)
                    }
                }
	        }
        }
        else {
            var target;
            
            
            // Priority #1: Refill extensions
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {return s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity;}
                });
            }
            // Priority #2: Refill the tower if <= 50% energy remaining
            if (!target) {
                var struct = Game.getObjectById(TOWER_ID);
                if (struct.energy <= struct.energyCapacity / 2) {
                    target = struct;
                } 
            }
            // Priority #3: Refill central distribution container
            if (!target) {
                target = Game.getObjectById(CENTRAL_DIST_CONT_ID);
            }
            // Priority #3: Refill storage
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {return s.structureType == STRUCTURE_STORAGE}
                });
            }
            
            
            
            if (target) {
                // Move creep to target to transfer energy
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleMover;
