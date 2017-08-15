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
    var role, parts_arr;
    if (harvesters.length < 3) {
        role = 'harvester';
        parts_arr = [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE];
    } else if (builders.length < 1) {
        role = 'builder';
        parts_arr = [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE];
    } else if (upgraders.length < 2){
        role = 'upgrader';
        parts_arr = [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE];
    } else if (repairers.length < 1){
        role = 'repairer';
        parts_arr = [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE];
    } else if (movers.length < 2){
        role = 'mover';
        parts_arr = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
    } else if (fighters.length < 2){
        role = 'fighter';
        parts_arr = [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, HEAL];
    }
    else if (claimers.length < 1){
        role = 'claimer';
        parts_arr = [CLAIM,CLAIM,MOVE,MOVE];
    }

    // Spawn Creep
    var spawnedName = Game.spawns['Spawn1'].createCreep(parts_arr, role + Game.time.toString(), {role: role});
    console.log('Spawning new ' + role + ': ' + spawnedName);
    
    // Spawning options
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            spawningCreep.memory.role,
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
