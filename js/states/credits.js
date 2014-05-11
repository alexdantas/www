// Aww yeah

/*global game,me*/

/**
 * Text that can be scrolled on the screen,
 * both on vertical and horizontal axis.
 */
game.ScrollableText = me.Renderable.extend ({

	init : function(text) {

		// Embracing all the screen size
		this.parent(new me.Vector2d(0, 0),
				    me.game.viewport.width,
				    me.game.viewport.height);

		// How much of the text was scrolled
		// until now.
		this.yScrollOffset = 0;
		this.xScrollOffset = 0;

		// How much to scroll at each step
		this.yScrollIncrement = 2;
		this.xScrollIncrement = 2;

		// Full text that will be shown on the screen
		this.text = text;

		// Array that contains the text, separated
		// by newlines (\n)
		this.array = this.text.split('\n');
	},

	update : function(dt) {
		// This will make it redraw every frame
		return true;
	},

	draw : function(context) {

		me.video.clearSurface(context, 'black');

		// Drawing each line
		for (var i = 0; i < this.array.length; i++) {

			game.font_white.draw(
				context,
				this.array[i],
				this.xScrollOffset,
				this.yScrollOffset + 4*i // TEXT LINE SIZE, CHANGE HERE
				                         // IF YOU EVER CHANGE THE FONT
			);
		}
	}
});

/**
 * Shows information on the game, scrollable text.
 *
 * Has static text, links and if any key is pressed
 * (except the arrow keys) it goes back to the main menu.
 */
game.CreditsState = me.ScreenObject.extend({

	/**
	 * Runs when entering the state.
	 */
	onResetEvent : function() {

		// Binding User Input
		me.input.bindKey(me.input.KEY.DOWN,  "scroll-down",  true);
		me.input.bindKey(me.input.KEY.UP,    "scroll-up",    true);
		me.input.bindKey(me.input.KEY.LEFT,  "scroll-left",  true);
		me.input.bindKey(me.input.KEY.RIGHT, "scroll-right", true);

		// Creating the static text
		this.text = new game.ScrollableText(
			"SCROLL\n" +
				"WITH\n" +
				"ARROW\n" +
				"KEYS\n" +
				"\n" +
				"GAME MADE\n" +
				"BY\n" +
				"ALEXANDRE\n" +
				"DANTAS\n" +
				"\n" +
				"FOR MORE\n" +
				"GO TO\n" +
				"GITHUB.COM/\n" +
				"ALEXDANTAS/\n" +
				"WWW"
		);
		me.game.world.addChild(this.text);

		// If any key is pressed, go back
		// to the Main Menu
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			var state = me.state.current();

			if (action === "scroll-down")
				state.text.yScrollOffset -= state.text.yScrollIncrement;

			else if (action === "scroll-up")
				state.text.yScrollOffset += state.text.yScrollIncrement;

			else if (action === "scroll-left")
				state.text.xScrollOffset += state.text.xScrollIncrement;

			else if (action === "scroll-right")
				state.text.xScrollOffset -= state.text.xScrollIncrement;

			// Aww jeez, ok, ok, you can go back to the game...
			else
				me.state.change(me.state.STATE_MAIN_MENU);
		});
	},

	/**
	 * Action to perform when leaving the state (state change).
	 */
	onDestroyEvent : function() {
		me.event.unsubscribe(this.handler);
		me.game.world.removeChild(this.text);
	}
});



