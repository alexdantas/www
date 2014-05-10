/**
 * A (vertical) menu that can be interacted with
 * both the keyboard.
 *
 * Displays items that can be selected or not.
 * It automatically handles positioning, images and
 * stuff.
 *
 * All you need to do is provide item titles and callbacks.
 *
 * Example:
 *
 * var menu = new me.Menu(x, y);
 *
 * // You can add as many as you want
 * menu.addItem(
 *     "title",
 *     function() {
 *         console.log("Clicked");
 *     }
 * );
 */

/*global me game*/

/**
 * A single Menu Item.
 *
 * @note Don't create standalone Items!
 *       They're nothing without a menu to be attached to.
 *
 * Keep scrollin'.
 */
me.MenuItem = me.Renderable.extend({

	init : function (x, y, label, menu, callback) {

		this.select(false);

		// Need to pre-render so we can measure how much
		// space will it occupy on the screen
		var size = this.font.measureText(
			me.video.getScreenContext(),
			label
		);

		this.parent(new me.Vector2d(x, y),
					size.width, size.height);

		this.label    = label;
		this.callback = callback;

		// Our big daddy
		this.menu = menu;

		// Make sure we use screen coordinates
		this.floating = true;

		// Putting on front of most things
		// (related to the menu z order)
		this.z = 24;
	},

	/**
	 * Marks this item as selected (or not).
	 *
	 * @note Option is a boolean.
	 * @note The selected state only changes the way
	 *       this item is drawn.
	 */
	select : function(option) {
		this.selected = option;

		this.font = ((this.selected) ?
					 game.font_white :
					 game.font_black);
	},

	/**
	 * Toggles the selected state of this item.
	 */
	toggle : function(option) {
		this.select(! this.selected);
	},

	execute : function () {
		this.callback();
	},

	/**
	 * Always making sure to draw the menu item.
	 *
	 * @note Remember, when we return `true` we tell
	 *       melonJS to call `draw()`.
	 */
	update : function() {
		return true;
	},

	draw : function(context) {

		this.font.draw(
			context,
			this.label,
			this.pos.x,
			this.pos.y
		);
	}
});

/**
 * The Menu!
 *
 * Basically a container of items.
 * It keeps track of which item is selected
 * right now and can activate it at any time.
 */
me.Menu = me.ObjectContainer.extend({

	init : function(x, y) {

		// Occupying the whole screen (viewport)
		this.parent(x, y);

		// The index of the currently selected item
		// inside our `children` Array
		this.selectedIndex = 0;

		// Not wasting CPU with this
		this.autoSort   = false;
		this.collidable = false;

		// Put at the front of most things
		this.z = 25;
	},

	/**
	 * Creates a new Menu Item.
	 */
	addItem : function(title, callback, labelOffset) {

		var bottom_margin = 1;

		var item = new me.MenuItem(
			this.pos.x,
			this.pos.y + 2*game.tile(this.children.length) + (this.children.length * bottom_margin),
			title,
			this,
			callback
		);

		// Setting an offset if specified
		// by the user
        if (typeof (labelOffset) !== "undefined")
			item.labelOffset = labelOffset;

		this.addChild(item);

		if (this.children.length === 1)
			this.children[0].select(true);
	},

	/**
	 * Activates the currently selected item.
	 */
	activate : function() {
		if (this.children.length <= 0)
			return;

		this.children[this.selectedIndex].execute();
	},

	/**
	 * Highlights the next item.
	 *
	 * @note It wraps to the first if it's on the last.
	 */
	next : function() {

		this.children[this.selectedIndex].select(false);

		this.selectedIndex++;

		if (this.selectedIndex >= this.children.length)
			this.selectedIndex = 0;

		// Play a sound?
		this.children[this.selectedIndex].select(true);
	},

	/**
	 * Highlights the previous item.
	 *
	 * @note It wraps to the last if it's on the first.
	 */
	previous : function() {

		this.children[this.selectedIndex].select(false);
		this.selectedIndex--;

		if (this.selectedIndex < 0)
			this.selectedIndex = this.children.length - 1;

		// Play a sound?
		this.children[this.selectedIndex].select(true);
	},

	/**
	 * Forces the menu to select a specific Item.
	 *
	 * @warning It is not an index, it's the Item
	 *          Object itself!
	 *
	 * @note This is a costly function, since we need
	 *       to check every element in the items array.
	 * TODO: Remove this somehow
	 */
	select : function(item) {
		this.children[this.selectedIndex].select(false);

		this.selectedIndex = this.children.indexOf(item);

		this.children[this.selectedIndex].select(true);
	}
});

