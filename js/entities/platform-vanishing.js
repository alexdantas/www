// I know this file seems to big to simply implement
// vanishing platforms.
//
// I understand it was too verbose, but some hackish
// things needed to be done in order to make WWW
// behave like VVVVVV

/*global game,me*/

// Making sure this namespace exists
game.platform = game.platform || {};

/**
 * A separate namespace for the vanishing platforms.
 *
 * It will hold constants and things that control
 * all the vanishing platforms.
 *
 * It also has "static" methods.
 */
game.platform.vanishing = {

	/**
	 * Delay (in milliseconds) that it takes to
	 * a vanishing platform to disappear.
	 *
	 * @note It applies after calling `startVanishing`.
	 */
	timeout : 900,

	/**
	 * Contains all platforms that already disappeared.
	 *
	 * It's necessary to restore all platforms as soon
	 * as the player dies.
	 */
	vanished : [],

	/**
	 * Contains all platforms that are disappearing
	 * right now.
	 *
	 * This is necessary so we can restore them as
	 * soon as the player dies.
	 */
	vanishing : [],

	/**
	 * Makes all the vanishing platforms be shown
	 * again.
	 *
	 * @note On the original VVVVVV, when the player
	 *       dies, all the vanished platforms are
	 *       shown again.
	 */
	showAll : function () {

		// Oops! Some platforms are still disappearing!
		// Let's force them to vanish right now then
		for (var j = 0; j < game.platform.vanishing.vanishing.length; j++) {
			var current = game.platform.vanishing.vanishing[j];

			if (current.tween)
				current.tween.stop();

			current.vanishing = false;
			current.vanish();
		}

		// And finally show all platforms that vanished
		for (var i = 0; i < game.platform.vanishing.vanished.length; i++)
			game.platform.vanishing.vanished[i].show();

		// Since they're all shown right now,
		// clear these containers
		game.platform.vanishing.vanished  = [];
		game.platform.vanishing.vanishing = [];

		// As a side note, I saw some arguing on what is
		// faster for deleting arrays.
		// One could argue about the faster alternative:this is faster:
		//    array = []
		// Or...
		//    array.length = 0
		// But this page gives a conclusive result:
		//    http://jsperf.com/array-clearing-performance
	}
};

/**
 * Platform that can disappear.
 */
game.platformVanishingEntity = game.platformEntity.extend({

	/**
	 * Create a new Platform.
	 *
	 * @param settings A hash with options, defined on Tiled.
	 */
	init : function(x, y, settings) {
		this.parent(x, y, settings);

		// These will control the internal state
		// of the platform
		this.vanishing = false;
		this.vanished  = false;

		// The thing that will animate the
		// platform. More info on this below.
		this.tween = null;

		this.type = me.game.PLATFORM_VANISHING_OBJECT;
	},

	/**
	 * Called when anything collide with us.
	 *
	 * Probably the player, so let's start vanishing!
	 */
	onCollision : function(collision, other) {

		// Only vanish if it's the Player
		if (other.type === me.game.PLAYER_OBJECT)

			// Only vanish if collided with the head
			// or butt - never on the Player's sides.
			if (collision.y != 0)

				this.startVanishing();
	},

	/**
	 * Makes the platform disappear after a while.
	 *
	 * Calling this function triggers the process of
	 * destroying the platform.
	 *
	 * It'll slowly become transparent and then will
	 * call `vanish()`, effectively removing it from
	 * the game.
	 */
	startVanishing : function() {

		if (this.vanished || this.vanishing)
			return;
		else
			this.vanishing = true;

		// Making the platform slowly vanish
		// (using a Tween to change opacity from 1.0 to 0.0)
		//
		// This part is kinda tricky; proceed with care.
		//
		// Inside this Tween object, we have callbacks
		// like `onStart`, `onUpdate` and `onComplete`.
		// Inside them, `this` refers to the Tween, NOT to
		// the platform!
		//
		// So when creating the Tween, I'll add a reference
		// to the platform.
		// This way I can access the platform inside the Tween.
		//
		this.tween = new me.Tween({

			// Reference to ourselves inside the Tween
			platform : this,

			// The thing that will change with time
			// (also known as "transparency")
			opacity: this.renderable.getOpacity()
		});

		// Now we configure how the Tween will happen.
		this.tween
			.to({ opacity: 0 }, game.platform.vanishing.timeout)

			// The way it's going to vanish...
			// Ideally it'd appear to disappear quickly
			// but leave a decent time gap for the player to react
			.easing(me.Tween.Easing.Quartic.Out)

			// Called right when the Tween is about to start
			.onStart(function() {

				// Adding the platform to the list of
				// platforms that are currently disappearing
				game.platform.vanishing.vanishing.push(this.platform);
			})

			// Called on each update of the tween
			// (multiple times per sec)
			.onUpdate(function() {

				this.platform.renderable.setOpacity(this.opacity);

			})

			// Same as calling `this.vanish()`, but on another
			// program context.
			.onComplete(function() {

				this.platform.vanishing = false;
				this.platform.vanish();

			})

			// Let's do it!
			.start();
	},

	/**
	 * Removes instantaneously this platform from the game.
	 *
	 * @note You shouldn't call this, it'll be done
	 *       by `startVanishing()` anyway.
	 */
	vanish : function() {

		if (this.vanished || this.vanishing)
			return;

		this.vanished = true;

		// Just to be sure.
		this.renderable.setOpacity(0);

		// And the player won't even touch it.
		this.collidable = false;

		// This adds ourselves to the global list of
		// platforms that are vanished.
		//
		// We do it so we can restore them all just
		// by calling `game.platform.vanishing.showAll()`
		game.platform.vanishing.vanished.push(this);
	},

	/**
	 * Makes the platform reappear on the game.
	 *
	 * @note Don't worry about calling this when the
	 *       platform is visible or disappearing; it will
	 *       fail silently.
	 */
	show : function() {

		if (!this.vanished || this.vanishing)
			return;
		else
			this.vanished = false;

		// Now the player will see and collide with it
		this.renderable.setOpacity(1);
		this.collidable = true;
	}
});



