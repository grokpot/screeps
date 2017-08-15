
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'seo-nl@fleetster.net',
                password: 'HaveFun123!',
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}
