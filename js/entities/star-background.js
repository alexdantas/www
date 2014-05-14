
/*global me,game*/

/**
 * Shows a nice background full of stars spawning on random
 * places and moving right.
 *
 * It keeps spawning stars (Particles) that disappear when
 * outside the screen or when a certain timeout expires.
 *
 * How to use:
 *
 * Create it and add it to the world.
 * Make sure to add it's internal container too.
 * Like this:
 *
 *     var stars = new me.starBackground();
 *     me.game.addChild(stars);
 *     me.game.addChild(stars.container);
 *
 * Finally, order it to begin streaming particles:
 *
 *     stars.streamParticles();
 *
 * @note I've extended the melonJS' ParticleEmitter class.
 *       See below.
 *
 * The fucking irritating thing about melonJS's
 * ParticleEmitters is that they spawn OUTSIDE
 * of the bounds you specify.
 *
 * Here I'm overriding this obnoxious behavior,
 * making the Particle's random spawn points
 * be consistent with the ParticleEmitter's size.
 *
 * See `getRandomPoint`.
 */
game.starBackground = me.ParticleEmitter.extend({

	init : function() {

		// Here we create a melonJS ParticleEmitter and
		// tell how it's Particles should behave.
		//
		// NOTE TO SELF:
		// melonJS' ParticleEngines don't render 1 pixel-images.
		// At least not on a 32x32 resolution.
		//
		// It took me 2 hours to figure out this was the problem.
		// Damn, nigga.
		//
		// Thus, I'm using a 2x2 image with a 1x1 pixel inside.
		//
		var particleSettings = {

			// Complete vacuum!
			gravity : 0,
			wind    : 0,
			angle   : 0,

			// I need to fine-tune these
			// Need to better adjust according to the situation
			// or whatever.
			totalParticles : 15,
			frequency      : 100,  // ms
			speed          : 0.6,
			speedVariation : 0.4,
			minLife        : 2000, // ms
			maxLife        : 3000, // ms
			onlyInViewport : true,
			floating       : true,

			image : me.loader.getImage("star"),

			// Dimensions of the particle emitter!
			// Not of the particles!
			width  : 2,
			height : 32
		};

		// Creating the thing that will spawn the particles.
		// Remember, they will get spawned INSIDE it.
		this.parent(0, 0, particleSettings);
	},

	/**
	 * Overriding the melonJS function that generates
	 * random Particles.
	 *
	 * See the class info for a better description.
	 */
	getRandomPoint: function () {
		var vector = this.pos.clone();

		vector.x += Number.prototype.random(0, this.width);
		vector.y += Number.prototype.random(0, this.height);

		return vector;
	}
});

