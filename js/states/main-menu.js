/**
 * Main Menu game state.
 *
 * Shows the main menu and if the user presses
 * ENTER or clicks or taps the state, goes to
 * the Play state.
 */

/*global game,me*/

game.MainMenuState = me.ScreenObject.extend({

	/**
	 * Runs when entering the state.
	 */
	onResetEvent : function() {

		// When the game goes out of focus
		// (user switched tabs, clicked elsewhere) it
		// automatically pauses.
		//
		// This variable tells melonJS to resume the
		// game when the focus is gained back.
		//
		// Be warned, though, that there are cases when
		// you'd not want to automatically resume - that's
		// for instance on the `play` state.
		me.sys.resumeOnFocus = true;

		// Creating the Background image
		// for the main menu.
		me.game.world.addChild(new me.SpriteObject(
			0, 0,
			me.loader.getImage("main-menu-bg")
		), -1);


		// This creates the background that spawns
		// random stars, to keep things animated.
		// It should be between the background and
		// the menu.
		game.enableStars(me.save.stars);

		this.menu = new me.Menu(1, 12);
		this.menu.addItem(
			"START",
			function() {
				// It's very ugly to directly
				// access a game state...
				me.state.current().startGame();
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
				me.state.current().menu.children[1].label = newLabel;
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
				me.state.current().menu.children[2].label = newLabel;
			}
		);
		this.menu.addItem(
			"CREDITS",
			function() {
				// It's very ugly to directly
				// access a game state...
				me.state.change(me.state.CREDITS);
			}
		);
		me.game.world.addChild(this.menu, 3);

		// Le logo
		me.game.world.addChild(new me.SpriteObject(
			0, 0,
			me.loader.getImage("logo")
		), 4);

		// Checking out the user input:
		// control the menu with arrow keys and
		// select with Enter.
		// Mouse over and click is handled by the menu itself.
		me.input.bindKey(me.input.KEY.DOWN,  "down",  true);
		me.input.bindKey(me.input.KEY.UP,    "up",    true);
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindKey(me.input.KEY.SPACE, "enter", true);

		// Controlling the menu (up, down and activate)
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action === "down") {
				me.state.current().menu.next();
				me.audio.play("menu", false, null, me.save.sfxVolume);
			}
			else if (action === "up") {
				me.state.current().menu.previous();
				me.audio.play("menu", false, null, me.save.sfxVolume);
			}
			else if (action === "enter") {
				me.state.current().menu.activate();
				me.audio.play("menu", false, null, me.save.sfxVolume);
			}
		});
	},

	/**
	 * Confirms the action to start the game.
	 */
	startGame : function() {

		me.state.change(me.state.STATE_PLAY);
	},

	/**
	 * Action to perform when leaving the state (state change).
	 */
	onDestroyEvent : function() {
		me.input.unbindKey(me.input.KEY.DOWN, "down");
		me.input.unbindKey(me.input.KEY.UP,   "up");
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindKey(me.input.KEY.SPACE);

		me.game.world.removeChild(this.menu);
		me.event.unsubscribe(this.handler);


		// Independently of having enabled stars or not
		// we should call this when the state finishes.
		// Remember to re-enable it on the next state,
		// though!
		game.enableStars(false);
	}
});

