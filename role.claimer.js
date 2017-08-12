laimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.moveTo(Game.flags['Flag1'])
        
        var target = Game.rooms['E11N28'].controller;
        if (creep.claimController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
	}
};

module.exports = roleClaimer;
