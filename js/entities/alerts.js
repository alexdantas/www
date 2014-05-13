
/*global game,me*/

/**
 * Alert dialogues that are called in-game.
 *
 * When the player touches it, creates a browser alert and
 * then destroy itself.
 *
 * Here's the catch: you create entities on Tiled, with the name
 *                   "alert" and an attribute "text" that contains
 *                   what will be shown.
 *                   Then it gets triggered when the player collides
 *                   with it!
 */
game.alertEntity = me.CollectableEntity.extend({

	init : function(x, y, settings) {

		// A dummy image - will never be used
		settings.image = "spike-sprite-vertical";
		settings.spritewidth  = 2;
		settings.spriteheight = 2;

		this.parent(x, y, settings);

		this.renderable.addAnimation("nothing", [0]);
		this.renderable.setCurrentAnimation("nothing");

		// The text that will be shown is defined on Tiled
		this.text = settings.text;
	},

	onCollision : function () {

		alert(this.text);
		me.game.world.removeChild(this);

	},

	draw : function(context) {

		// Won't draw!
	}
});


