var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleMover = require('role.mover');
var roleFighter = require('role.fighter');
var roleClaimer = require('role.claimer');

// TODO: Add to github

module.exports.loop = function () {
    
    // Print room energy
    console.log('Room has '+ Game.rooms['E11N27'].energyAvailable +' energy');
    
    // Clear dead creep memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // TODO: make roles more dynamic and reduce hard coding
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    var movers = _.filter(Game.creeps, (creep) => creep.memory.role == 'mover');
    var fighters = _.filter(Game.creeps, (creep) => creep.memory.role == 'fighter');
    var claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
    
    console.log("Harvesters: ", harvesters.length);
    console.log("Builders: ", builders.length);
    console.log("Upgraders: ", upgraders.length);
    console.log("Repairers: ", repairers.length);
    console.log("Movers: ", movers.length);
    console.log("Fighters: ", fighters.length);
    console.log("Claimers: ", claimers.length);
    
    
    // TODO: Use numbers to build part arrays
    // TODO: check out StructureSpawn.renewCreep as an alternative to the below
    if (harvesters.length < 4) {
        var newName = Game.spawns['Spawn1'].createCreep(
            [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            "harvester" + Game.time.toString(), 
            {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    } else if (builders.length < 2) {
        var newName = Game.spawns['Spawn1'].createCreep(
            [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], 
            "builder" + Game.time.toString(), 
            {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    } else if (upgraders.length < 2){
        var newName = Game.spawns['Spawn1'].createCreep(
            [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], 
            "upgrader" + Game.time.toString(), 
            {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    } else if (repairers.length < 1){
        var newName = Game.spawns['Spawn1'].createCreep(
            [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            "repairer" + Game.time.toString(), 
            {role: 'repairer'});
        console.log('Spawning new repairer: ' + newName);
    } else if (movers.length < 2){
        var newName = Game.spawns['Spawn1'].createCreep(
            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 
            "mover" + Game.time.toString(), 
            {role: 'mover'});
        console.log('Spawning new mover: ' + newName);
    } else if (fighters.length < 2){
        var newName = Game.spawns['Spawn1'].createCreep(
            [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL], 
            "fighter" + Game.time.toString(), 
            {role: 'fighter'});
        console.log('Spawning new fighter: ' + newName);
    }
    else if (claimers.length < 1){
        var newName = Game.spawns['Spawn1'].createCreep(
            [CLAIM,CLAIM,MOVE,MOVE], 
            "claimer" + Game.time.toString(), 
            {role: 'claimer'});
        console.log('Spawning new claimer: ' + newName);
    }
    
    // Spawniong options
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    // TODO: Extract to module
    var tower = Game.getObjectById('59887bc47eacb63924212837');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } 
        // Otherwise, if we have more than 50% energy, repair walls
        else if (tower.energy > tower.energyCapacity / 2){
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {return s.hits < s.hitsMax / 300;}
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    }

    // TODO: Make this more dynamic
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'mover') {
            roleMover.run(creep);
        }
        if(creep.memory.role == 'fighter') {
            roleFighter.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
    }
}
