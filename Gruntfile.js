/**
 * - `Makefile` if for `make`
 * - `Rakefile` is for `rake`,
 * - `Gruntfile` is for `grunt` :)
 */

module.exports = function(grunt) {
	grunt.initConfig({

		// Package variables
		pkg: grunt.file.readJSON('package.json'),

		// Concatenates all javascript files into one
		concat: {
			dist: {
				src: [
					'lib/melonJS-1.0.0-min.js',
					'lib/plugins/*.js',
					'js/game.js',
					'js/resources.js',
					'js/**/*.js'
				],
				dest: 'build/js/app.js'
			}
		},

		// Copies files from one place to another
		copy: {
			dist: {
				files: [{
					src: 'css/**/*',
					dest: 'build/'
				},{
					src: 'data/**/*',
					dest: 'build/'
				}]
			}
		},

		// Goes through the HTML file, performing actions
		// (on this case, compressing all <script> tags into one
		processhtml: {
			dist: {
				options: {
					process: true,
					commentMarker: 'compress',

					data: {
						name        : '<%= pkg.name %>',
						author      : '<%= pkg.author %>',
						version     : '<%= pkg.version %>',
						repository  : '<%= pkg.repository %>',
						description : '<%= pkg.description %>'
					}
				},
				files: {
					'build/index.html': ['index.html']
				}
			}
		},

		// Minifies a `.js` file into a `.min.js`
		uglify: {
			options: {
				banner: '/*full source code at <%= pkg.repository %>*/',
				report: 'min',
				preserveComments: 'false'
			},
			dist: {
				files: {
					'build/js/app.min.js': [
						'build/js/app.js'
					]
				}
			}
		},

		// After uglifying, remove the original
		// non-minimized file at the `build` directory
		clean: [
			'build/js/app.js'
		],

		// Synchronize all the data on `build`
		// directory to a remote server.
		// Configure it here
		rsync: {
			options: {
				recursive: true
			},
			dist: {
				options: {
					src: 'build/',
					dest: '/home/alexd075/public_html/tmp',
					host: 'alexd075@alexdantas.net',
					port: 2222,
					syncDestIgnoreExcl: true
				}
			}
		},

		// Builds a node-webkit app from the source
		nodewebkit: {
			options: {
				build_dir : 'webkit_build',
				mac       : true,
				win       : true,
				linux32   : true,
				linux64   : true
			},
			src: [
				'css/**/*',
				'data/**/*',
				'js/**/*',
				'lib/**/*',
				'favicon.png',
				'Gruntfile.js',
				'humans.txt',
				'index.html',
				'LICENSE.md',
				'manifest.webapp',
				'package.json',
				'README.md',
				'robots.txt'
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-rsync');
	grunt.loadNpmTasks('grunt-node-webkit-builder');

	// Things that will run by default
	grunt.registerTask('default', [
		'concat',
		'uglify',
		'copy',
		'processhtml',
		'rsync'
	]);
};

