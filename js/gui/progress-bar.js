/**
 * Simple progress bar that can be used for anything.
 *
 * It's a background rectangle with foreground rectangle
 * showing process.
 */

/*global me*/

me.ProgressBar = me.Renderable.extend({

	/**
	 * Creates a progress bar at specified position
	 * and specified size.
	 *
	 * @param posVector Position of the overall progress bar
	 *                  (melonJS' `Vector2d` class)
	 *
	 * @param padding   Internal padding for the progress bar
	 *                  (another melonJS' `Vector2d` class)
	 *                  (optional)
	 */
    init: function(posVector, w, h, padding) {
        this.parent(posVector, w, h);

        // Internal flag to know when we
		// must redraw the progress bar
        this.forceRedraw = false;

		// Width of the top rectangle
        this.progressWidth = 0;

		// Padding of the internal progress rectangle
		this.progressPadding = ((typeof(padding) === "undefined") ?
								new me.Vector2d(0, 0) :
								padding);

		this.setColors('white', 'black');

		// Optional text to display on top of the progress bar
		this.text = null;

		// Creating font just in case...
		//
		// TODO: Dynamically adjust the font size according
		//       to our size
		// TODO: Default font name?
		this.font = new me.Font(
			"century gothic", 12, "white", "middle"
		);
    },

	/**
	 * Adjusts the bar's internal size according to
	 * `progress`.
	 *
	 * @param progress Number between 0 and 1 representing
	 *                 the percentage of progress of the bar.
	 */
    onProgressUpdate : function(progress, text) {
        this.progressWidth = Math.floor(progress * this.width);
        this.forceRedraw   = true;

		this.text = ((typeof(text) === "undefined") ?
					 null :
					 text);
    },

    // make sure the screen is refreshed every frame
    update : function() {
        if (this.forceRedraw === true) {
            this.forceRedraw = false;
            return true;
        }
        return false;
    },

    // draw function
    draw : function(context) {

		// Draw the bottom bar
		// (external rectangle)
        context.fillStyle = this.backgroundColor;
        context.fillRect(
			this.pos.x,
			this.pos.y,
			this.width,
			this.height
		);

		// Draw the progress bar
		// (internal rectangle)
        context.fillStyle = this.foregroundColor;
        context.fillRect(
			this.pos.x         + this.progressPadding.x,
			this.pos.y         + this.progressPadding.y,
			this.progressWidth - this.progressPadding.x * 2,
			this.height        - this.progressPadding.y * 2
		);

		// Now we draw the OPTIONAL text.
		if (this.text === null)
			return;

		this.font.draw(
			context,
			this.text,
			this.pos.x + this.progressPadding.x + 2,
			this.pos.y + this.progressPadding.y
		);
    },

	/**
	 * Sets the foreground and background colors of the
	 * progress bar.
	 *
	 * @param foreground Color for the completed part
	 *                   of the bar (string).
	 * @param background Color for the incomplete part
	 *                   of the bar (string).
	 */
	setColors : function(foreground, background) {
		this.foregroundColor = foreground;
		this.backgroundColor = background;
	}
});

