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

		this.menu = new me.Menu(0, 0);
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
			 "SOUND:ON" :
			 "SOUND:OFF"),
			function () {

				var newLabel = "";

				if (me.save.sound) {
					newLabel = "SOUND:OFF";
					me.save.sound = false;
					me.audio.disable();
				}
				else {
					newLabel = "SOUND:ON";
					me.save.sound = true;
					me.audio.enable();
				}

				// That's a VERY HACKISH THING TO DO
				// I should NEVER have to directly access
				// stuff like this!
				me.state.current().menu.children[1].label = newLabel;
			}
		);
		me.game.world.addChild(this.menu);

		// Checking out the user input:
		// control the menu with arrow keys and
		// select with Enter.
		// Mouse over and click is handled by the menu itself.
		me.input.bindKey(me.input.KEY.DOWN,  "down",  true);
		me.input.bindKey(me.input.KEY.UP,    "up",    true);
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindKey(me.input.KEY.SPACE, "enter", true);

		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if      (action == "down")  me.state.current().menu.next();
			else if (action == "up")    me.state.current().menu.previous();
			else if (action == "enter") me.state.current().menu.activate();
		});
	},

	startGame : function() {
		// Play some audio before startin'

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
	}
});

