
/*global me,game*/

/**
 * Watches the pause key, effectively pausing the game
 * when the user presses it.
 *
 * It stops everything and shows a text "PAUSED".
 *
 * It waits until the user presses the "pause" key again
 *
 * @bug It also unpauses if we leave the tab and return
 *      to it - must fix!
 */
game.pauseHandlerEntity = me.Renderable.extend({

	/**
	 * Initializes the thing that keeps looking for the
	 * "pause" key.
	 */
	init : function () {

		this.parent(new me.Vector2d(5, 0),
					me.game.viewport.width, me.game.viewport.height);

		// Only thing in the game that does this
		this.updateWhenPaused = true;

		// Need to draw on top of most things.
		this.z = 30;
		this.floating = true;

		// Will keep watching the pause key directly
		// (when the user releases the pause key)
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action) {

			if (action === "pause") {

				if (me.state.isPaused())
					me.state.resume();
				else
					me.state.pause(true);
			}
		});
	},

	update : function (dt) {
		// Will only show "PAUSED" if the game
		// is paused, duh
		return (me.state.isPaused());
	},

	draw : function (context) {
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
	}
});

