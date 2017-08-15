/*LESSONS LEARNED
 * - first spawn should be in between energy source and room controller
 * - space between spawn and other structures should be min 2 spaces (eases moving)
 **/

// Get room
Game.rooms['E11N27'];

// Create Creep
Game.spawns.Spawn1.createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: 'harvester'})
