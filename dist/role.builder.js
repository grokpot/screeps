
dule code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // If creep is full of energy, send it out to work, otherwise, get energy until full
        if (creep.carry.energy == 0) {
            creep.memory.get_energy = true;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.get_energy = false;
        }

	    if (creep.memory.get_energy) {
	        // Get energy. Preference is from a container, otherwise an energy source
	        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
	            filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});
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
	    } else {
	       var target = Game.getObjectById('598e342641d70d5a4845dfab');
	       console.log(target)
	       // var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES); 
	            // Uncomment to build specific things
	           // {filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION)}});
	        
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Standby position for builders with nothing to build
                // TODO: Put this in one location that applies to all roles
                creep.moveTo(43,30);
            }
	    }
	}
};

module.exports = roleBuilder;
