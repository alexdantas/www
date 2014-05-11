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


		this.initializeStars();


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
		me.input.bindKey(me.input.KEY.DOWN,  "down");
		me.input.bindKey(me.input.KEY.S,     "down");

		me.input.bindKey(me.input.KEY.UP,    "jump", true);
		me.input.bindKey(me.input.KEY.W,     "jump", true);
		me.input.bindKey(me.input.KEY.SPACE, "jump", true);
		me.input.bindKey(me.input.KEY.Z,     "jump", true);
		me.input.bindKey(me.input.KEY.X,     "jump", true);

		me.input.bindKey(me.input.KEY.ESC,   "pause", true);
		me.input.bindKey(me.input.KEY.ENTER, "pause", true);

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

		this.destroyStars();

		// Supporting both arrow keys and WASD
		me.input.unbindKey(me.input.KEY.LEFT,  "left");
		me.input.unbindKey(me.input.KEY.A,     "left");
		me.input.unbindKey(me.input.KEY.RIGHT, "right");
		me.input.unbindKey(me.input.KEY.D,     "right");
		me.input.unbindKey(me.input.KEY.DOWN,  "down");
		me.input.unbindKey(me.input.KEY.S,     "down");
		me.input.unbindKey(me.input.KEY.SPACE, "jump");

		me.input.unbindKey(me.input.KEY.UP,    "jump");
		me.input.unbindKey(me.input.KEY.W,     "jump");
		me.input.unbindKey(me.input.KEY.SPACE, "jump");
		me.input.unbindKey(me.input.KEY.Z,     "jump");
		me.input.unbindKey(me.input.KEY.X,     "jump");

		me.input.unbindKey(me.input.KEY.ESC,   "pause");
		me.input.unbindKey(me.input.KEY.ENTER, "pause");
	},

	initializeStars : function() {

		// Avoiding re-initializing stuff.
		this.particleEmitter = this.particleEmitter || null;

		if (! me.save.stars) {
			this.destroyStars();
			return;
		}

		// Particles that will run on the background!
		// Here we create a particle emitter to launch particles
		// on the background.
		//
		// First, setting up how will the particles behave.
		//
		// NOTE TO SELF:
		// melonJS' ParticleEngines don't render 1 pixel-images.
		// At least not on a 32x32 resolution.
		//
		// It took me 2 hours to figure out this was the problem.
		// Damn, nigga.
		//
		// Thus, I'm using a 2x2 image with a 1x1 pixel inside.
		//
		var particleSettings = {
			// Complete vacuum!
			gravity : 0,
			wind    : 0,
			angle   : 0,

			// I need to fine-tune these
			// Need to better adjust according to the situation
			// or whatever.
			totalParticles : 15,
			frequency      : 100,  // ms
			speed          : 0.6,
			speedVariation : 0.4,
			minLife        : 2000, // ms
			maxLife        : 3000, // ms
			onlyInViewport : true,
			floating       : true,

			image : me.loader.getImage("star"),

			// Dimensions of the particle emitter!
			// Not of the particles!
			width  : 2,
			height : 32
		};

		// Creating the thing that will spawn the particles.
		// Remember, they will get spawned INSIDE it.
		this.particleEmitter = new game.MyParticleEmitter(
			0, 0,
			particleSettings
		);

		// How will this be drawn on top of other stuff.
		//
		// I had to adjust it so it could be between the
		// map's background and the map's tiles.
		var z = 2;

		// Adding the particle system
		// (and the particles themselves) to the game.
		me.game.world.addChild(this.particleEmitter, z);
		me.game.world.addChild(this.particleEmitter.container, z);

		// Finally, command the system to launch constantly
		// the particles, like a fountain
		this.particleEmitter.streamParticles();
	},

	destroyStars : function () {

		if (this.particleEmitter === null)
			return;

		me.game.world.removeChild(this.particleEmitter);
		me.game.world.removeChild(this.particleEmitter.container);

		this.particleEmitter = null;
	}
});


