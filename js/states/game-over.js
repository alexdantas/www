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
 * End of the game.
 * For now shows scrollable text, could be anything on the future.
 */
game.GameOverState = me.ScreenObject.extend({

	/**
	 * Runs when entering the state.
	 */
	onResetEvent : function() {

		// Creating the static text
		this.text = new game.ScrollableText(
		// Max letters:
		//   AAAAAAAA
			"CONGRATS\n" +
			"FOR\n" +
			"PLAYING\n" +
			"WWW!\n" +
			"\n" +
			"MORE\n" +
			"LEVELS\n" +
			"SOON!\n"
		);
		me.game.world.addChild(this.text);

		// When we press any key other than arrow keys, will return to the
		// main menu.
		//
		// But we don't want to check for that immediately, since the
		// user might be banging his head on the keyboard when he finishes
		// the game.
		//
		// So we'll create a timeout (in milliseconds).
		// When it happens, we'll look out for keypress events.
		me.timer.setTimeout(me.state.current().watchForKeypresses, 2000);
	},

	/**
	 * Starts monitoring user's keypresses.
	 *
	 * @note This function is called independently
	 *       of the object existing!
	 *       That's why we access ourselves with
	 *       `me.state.current()` instead of `this`
	 */
	watchForKeypresses : function() {


		// Here we're making the click/tap event seem like the key ENTER
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);

		me.input.bindKey(me.input.KEY.DOWN,  "scroll-down",  true);
		me.input.bindKey(me.input.KEY.UP,    "scroll-up",    true);
		me.input.bindKey(me.input.KEY.LEFT,  "scroll-left",  true);
		me.input.bindKey(me.input.KEY.RIGHT, "scroll-right", true);

		// This way, for any key pressed (or click/tap),
		// we'll go to the main menu
		me.state.current().handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
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

