
/*global me,game*/

/**
 * Watches the pause key, effectively pausing the game
 * when the user presses it.
 *
 * It stops everything and shows a text "PAUSED" with
 * a Pause Menu.
 * It waits until the user presses the "pause" key again
 * or selects "RESUME" from the menu.
 *
 * @note This file has at least 3 ugly hacks I did to
 *       make the code work.
 *       I'm very embarrassed.
 *       Maybe the shame of publicly exposing them will
 *       make me fix them quicker.
 */
game.pauseHandlerEntity = me.Renderable.extend({

	/**
	 * Initializes the thing that keeps looking for the
	 * "pause" key.
	 */
	init : function () {

		// Bleh.
		this.parent(new me.Vector2d(5, 0),
					me.game.viewport.width, me.game.viewport.height);


		// This is very important
		//
		// We're attaching callbacks to know when the game
		// loses focus (user clicked elsewhere, changed
		// browser tab, changed OS window...)
		//
		// To do so we MUST remove melonJS's default way
		// of handling this.
		//
		// By default melonJS simply calls `me.state.pause()`
		// but since we're showing a Pause Menu and stuff
		// we're doing like this:
		//
		// - When we lose focus, pretend the user has hit the
		//   "pause" key (on this case, ESC).
		//
		// Got it?
		// First, removing melonJS' handlers.
		me.sys.stopOnBlur    = false;
		me.sys.pauseOnBlur   = false;
		me.sys.resumeOnFocus = false;

		// Then, attaching our own
		// for when losing focus...
        window.addEventListener("blur", function () {

			// Remember to change this if you ever decide to
			// NOT use ESC as a "pause" key.
			me.input.triggerKeyEvent(me.input.KEY.ESC, true);

        }, false);


		// Aww yeah, now we're talkin'
		this.updateWhenPaused = true;

		// Need to draw on top of most things.
		this.z = 30;
		this.floating = true;

		// This will make sure the menu gets initialized
		// at the right time.
		this.menu = null;
		this.enableMenu(false);

		// Attaching ourselves to the global game namespace.
		// I'm not proud of this, but it's necessary so we can
		// use it on the `this.handler`.
		// Check below.
		game.pauseHandler = this;

		// Will keep watching the pause key directly
		// (when the user releases the pause key)
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode) {
			// Only controlling the menu when the game is paused.
			//
			// Let's grab the user input and control the menu.
			// NOTE: HARDCODED KEYS11!!!111
			if ((me.state.isPaused()) &&
				(game.pauseHandler.menu)) {

				if (keyCode === me.input.KEY.DOWN) {
					game.pauseHandler.menu.next();
					me.audio.play("menu", false, null, me.save.sfxVolume);
				}
				else if (keyCode === me.input.KEY.UP) {
					game.pauseHandler.menu.previous();
					me.audio.play("menu", false, null, me.save.sfxVolume);
				}
				else if (keyCode === me.input.KEY.ENTER) {
					game.pauseHandler.menu.activate();
					me.audio.play("menu", false, null, me.save.sfxVolume);

					// HACK BUG TODO
					// I'm really embarassed to place this here.
					// I need this `return` because the "pause" key
					// is `me.input.KEY_ENTER`.
					//
					// So to pause the user presses "ENTER".
					// The way it was, if he pressed "ENTER" again it
					// would unpause.
					// But we need it to control the menu option with
					// "ENTER".
					// So we'll assign a higher priority for "ENTER"
					// to control the menu when paused.
					//
					// Sorry if it seems confusing.
					// Please contact me if you need a better explanation
					// Alexandre Dantas <eu@alexdantas.net>
					return;
				}
			}

			// Now, pausing or unpausing the game!
			// This is where we enable/disable the Pause Menu.
			if (action === "pause") {

				if (me.state.isPaused()) {
					me.state.resume();
					me.audio.resumeTrack();
					game.pauseHandler.enableMenu(false);
				}
				else {
					game.pauseHandler.enableMenu(true);
					me.state.pause(true);
					me.audio.pauseTrack();

				}
			}

		});
	},

	update : function(dt) {

		// When the game is not paused, do nothing.
		// When the game is paused, return `true` so the
		// engine can call `draw()`.
		return (me.state.isPaused());
	},

	draw : function(context) {

		// Will only show "PAUSED" if the game
		// is paused, duh
		if (! me.state.isPaused())
			return;

		game.font_white.draw(
			context,
			"PAUSED",
			this.pos.x,
			this.pos.y
		);

		if (this.menu)
			this.menu.draw(context, true);
	},

	/**
	 * Enables/Disables the pause menu.
	 * It's called once the game is paused to create the menu;
	 * and once the game gets unpaused, it's called to destroy
	 * it.
	 *
	 * I know it's a waste of resources but I couldn't find a
	 * way to create a menu that only gets drawn when I ask
	 * it to.
	 */
	enableMenu : function(option) {

		if (! option) {
			// Let's destroy the menu!
			// (but only if it exists)
			if (this.menu === null)
				return;

			me.game.world.removeChild(this.menu);
			this.menu = null;
		}
		else {
			// Creating a sweet sweet pause menu.
			// (but only if it doesn't exist)
			if (this.menu !== null)
				return;

			this.menu = new me.Menu(1, 12);

			// WHAT THE HELL?
			// WHY DOESNT THIS APPLY?
			//this.menu.floating = true;

			// This way the menu works when paused -- yay!
			this.menu.updateWhenPaused = true;

			this.menu.addItem(
				"RESUME",
				function() {
					// Let's simulate the user pressing
					// the "pause" key to unpause the game
					me.input.triggerKeyEvent(me.input.KEY.ESC, true);
				}
			);
			this.menu.addItem(
				((me.save.sound)?
				 "SOUND:Y" :
				 "SOUND:N"),
				function () {

					var newLabel = "";

					if (me.save.sound) {
						newLabel = "SOUND:N";
						me.save.sound = false;
						me.audio.disable();
					}
					else {
						newLabel = "SOUND:Y";
						me.save.sound = true;
						me.audio.enable();
					}

					// That's a VERY HACKISH THING TO DO
					// I should NEVER have to directly access
					// stuff like this!
					game.pauseHandler.menu.children[1].label = newLabel;
				}
			);
			this.menu.addItem(
				((me.save.stars) ?
				 "STARS:Y" :
				 "STARS:N"),
				function() {

					var newLabel = "";

					if (me.save.stars) {
						newLabel = "STARS:N";
						me.save.stars = false;

						// Dynamically destroying stars
						game.enableStars(false);
					}
					else {
						newLabel = "STARS:Y";
						me.save.stars = true;

						// Dynamically creating stars
						game.enableStars(true);
					}

					// That's a VERY HACKISH THING TO DO
					// I should NEVER have to directly access
					// stuff like this!
					game.pauseHandler.menu.children[2].label = newLabel;
				}
			);



			// I couldn't add an item to go to the menu because
			// it required a lot of hacks and was buggy.
			// TODO: implement this later
			/*
			this.menu.addItem(
				"QUIT",
				function() {
					// This is a clever/hackish thing to do.
					// Since I can't change states when paused, I
					// simulate this keypress and THEN change the state.

					me.input.triggerKeyEvent(me.input.KEY.ESC, true);

					game.pauseHandler.enableMenu(false);

					// It's very ugly to directly
					// access a game state...
					me.state.change(me.state.STATE_MAIN_MENU);
				}
			);
			*/


			// FINALLY, adding the menu to the world
			// (meaning it's update() and draw() functions
			//  will get called from now on)
			me.game.world.addChild(this.menu, 20);
		}
	}
});

