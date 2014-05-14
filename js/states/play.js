/**
 * State that will be shown while the game
 * is being played.
 *
 * Note: The game loop is hidden inside melonJS.
 *       So the whole game logic is specified inside
 *       each entity.
 *       Go look the files on `js/entities`
 */

/*global game,me */

game.PlayState = me.ScreenObject.extend({

	/**
	 *  What to do when starting this state.
	 */
	onResetEvent : function() {

		// Call `this.onLevelLoaded()` every time
		// a new level is loaded.
		me.game.onLevelLoaded = this.onLevelLoaded.bind(this);

		// Before loading the level, let's place a text
		// on the screen saying that we're doing this
		game.font_black.draw(
			me.video.getScreenContext(),
			"Loading level...",
			0, 0
		);
		me.levelDirector.loadLevel(game.data.currentLevel);

		// This creates the background that spawns
		// random stars, to keep things animated.
		// It should be between the background tiles
		// and the foreground tiles.
		game.enableStars(me.save.stars);

		// The HUD
		// (display with meta-information on top of everything)
		// Add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

		// Input
		// Supporting both arrow keys and WASD
		me.input.bindKey(me.input.KEY.LEFT,  "left");
		me.input.bindKey(me.input.KEY.A,     "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.D,     "right");

		// Let's be redundant!
		// Lots of keys to invert the gravity
		me.input.bindKey(me.input.KEY.UP,    "jump", true);
		me.input.bindKey(me.input.KEY.W,     "jump", true);
		me.input.bindKey(me.input.KEY.SPACE, "jump", true);
		me.input.bindKey(me.input.KEY.DOWN,  "jump", true);
		me.input.bindKey(me.input.KEY.S,     "jump", true);
		me.input.bindKey(me.input.KEY.Z,     "jump", true);
		me.input.bindKey(me.input.KEY.X,     "jump", true);

		// Suicide key (a.k.a. PANIC BUTTON)
		me.input.bindKey(me.input.KEY.K, "die", true);

		me.input.bindKey(me.input.KEY.ESC,   "pause", true);
		me.input.bindKey(me.input.KEY.ENTER, "pause", true);

		// Also creating the thing that will pause the
		// game for us (if the user presses "pause")
		me.game.world.addChild(new game.pauseHandlerEntity());

		// To make able to control the game with the mouse
		// we must watch for those events (mouse up and down)
		//
		// Unfortunately we have to keep two different functions
		// for this.
		//
		// But since they're events, we have MULTITOUCH support!
		me.input.registerPointerEvent(
			'pointerdown',
			me.game.viewport,
			this.mouseDown.bind(this)
		);
		me.input.registerPointerEvent(
			'pointerup',
			me.game.viewport,
			this.mouseUp.bind(this)
		);

		// Place the camera on the player
		// (but not directly over it, on the map screen)
		me.game.viewport.moveTo(
			game.player.pos.x / 32,
			game.player.pos.y / 32
		);

		// Yay, let's play some sound!
		me.audio.stopTrack();
		me.audio.playTrack("area000", me.save.musicVolume);
	},

	/**
	 * Called when the level is loaded.
	 * @note Not a melonJS callback! We've attached it
	 *       right up there.
	 */
	onLevelLoaded : function onLevelLoaded() {


	},

	/**
	 * User started pressing the mouse/finger
	 * anywhere on the screen.
	 * @note This is not an automatic callback from
	 *       melonJS! I register this function at
	 *       the end of `init`.
	 */
	mouseDown : function() {

		this.clickOnGameArea(true);
	},

	/**
	 * User released the mouse/finger
	 * anywhere on the screen.
	 * @note This is not an automatic callback from
	 *       melonJS! I register this function at
	 *       the end of `init`.
	 */
	mouseUp : function() {
		this.clickOnGameArea(false);
	},

	/**
	 * Reacts to a click/touch the user made on the
	 * game area.
	 * The argument tells if the mouse/finger is
	 * pressed or released.
	 *
	 * This is where the magic is!
	 * We trigger a false key event based on clicks!
	 *
	 * - If you click/touch the upper area, character
	 *   jumps.
	 * - If you click on the lower area left side the
	 *   character walks left, and on the right side
	 *   it walks right.
	 */
	clickOnGameArea : function (isClickDown) {

		var mouseX = me.input.mouse.pos.x;
		var mouseY = me.input.mouse.pos.y;

		// Top Area
		if (mouseY < me.game.viewport.height/2) {
			me.input.triggerKeyEvent(me.input.KEY.UP, isClickDown);
			return;
		}

		// Bottom Left Area
		if (mouseX < me.game.viewport.width/2)
			me.input.triggerKeyEvent(me.input.KEY.LEFT, isClickDown);

		// Bottom Right Area
		else
			me.input.triggerKeyEvent(me.input.KEY.RIGHT, isClickDown);
	},

	/**
	 *  What to do when leaving this state.
	 */
	onDestroyEvent : function() {

		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);

		me.input.unbindKey(me.input.KEY.LEFT);
		me.input.unbindKey(me.input.KEY.A);
		me.input.unbindKey(me.input.KEY.RIGHT);
		me.input.unbindKey(me.input.KEY.D);

		me.input.unbindKey(me.input.KEY.DOWN);
		me.input.unbindKey(me.input.KEY.S);
		me.input.unbindKey(me.input.KEY.UP);
		me.input.unbindKey(me.input.KEY.W);
		me.input.unbindKey(me.input.KEY.SPACE);
		me.input.unbindKey(me.input.KEY.Z);
		me.input.unbindKey(me.input.KEY.X);

		me.input.unbindKey(me.input.KEY.K);

		me.input.unbindKey(me.input.KEY.ESC);
		me.input.unbindKey(me.input.KEY.ENTER);

		me.event.unsubscribe(this.handler);

		// Independently of having enabled stars or not
		// we should call this when the state finishes.
		// Remember to re-enable it on the next state,
		// though!
		game.enableStars(false);
	}
});


