module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        beautify: true,
        mangle: false,
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: { 
          'public/javascripts/deps.min.js' : [
            'clientside-javascript/underscore.js',  
            'clientside-javascript/spin.min.js',  
            'clientside-javascript/leaflet.spin.js',
            'clientside-javascript/leaflet.utfgrid.js'
          ], 
          'public/javascripts/<%= pkg.name %>.min.js' : [
            'clientside-javascript/datanavAnimations.js',
            'clientside-javascript/datanavModel.js',
            'clientside-javascript/datanav.js',
            'clientside-javascript/map.js',
            'clientside-javascript/search.js',
            'clientside-javascript/settings.js',
            'clientside-javascript/embedding.js',
            'clientside-javascript/main.js'
          ]} 
      }
    },
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: 'spec',
      },
      all: ['spec/']
    }
  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);

};
