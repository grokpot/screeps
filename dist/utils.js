var room = Game.rooms['E11N27'];

var underutilizedSources = function() {
    sources = room.find(FIND_SOURCES)
    var underutilized = [];
    for (source of sources) {
        creeps_assigned = _.filter(Game.creeps, (creep) => creep.memory.source_id == source.id);
        if (creeps_assigned.length < 2) {
            underutilized.push(source.id);
        }
    }
    return underutilized;
}

module.exports.underutilizedSources = underutilizedSources;
