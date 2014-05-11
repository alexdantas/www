// Quick patch I did on melonJS's default ParticleEmitter

/*global me,game*/

/**
 * My own class on top of melonJS' ParticleEmitter.
 *
 * The fucking irritating thing about melonJS's
 * ParticleEmitters is that they spawn OUTSIDE
 * of the bounds you specify.
 *
 * Here I'm overriding this obnoxious behavior,
 * making the Particle's random spawn points
 * be consistent with the ParticleEmitter's size.
 */
game.MyParticleEmitter = me.ParticleEmitter.extend({

	getRandomPoint: function () {
		var vector = this.pos.clone();
		vector.x += Number.prototype.random(0, this.width);
		vector.y += Number.prototype.random(0, this.height);
		return vector;
	}

});

