/*global game,me*/

game.teleporter = game.teleporter || {};

/**
 * Teleporter that marks the end of the level.
 *
 * When the player touches it, he's supposed to handle the
 * level ending.
 *
 * You create an entity on Tiled, with the name
 * "teleporter" and then check for collisions with
 * the me.game.TELEPORTER_OBJECT inside the Player.
 */
game.teleporter.entity = me.CollectableEntity.extend({

	init : function(x, y, settings) {

		// A dummy image - will never be used
		settings.image = "teleporter";
		settings.spritewidth  = 10;
		settings.spriteheight = 10;

		this.parent(x, y, settings);

		this.renderable.addAnimation("nothing", [0, 1], 1000);
		this.renderable.setCurrentAnimation("nothing");

		this.type = me.game.TELEPORTER_OBJECT;
	},

	onCollision : function () {
		// what...?
	}
});


