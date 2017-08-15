var roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            console.log('attack:', creep.attack(target))
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } 
        // Standby position for builders with nothing to build
        else {
            creep.moveTo(37,21);
            creep.heal(creep);
        }
        
	}
};

module.exports = roleFighter;
