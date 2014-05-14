/* This is where it all starts.
 *
 * Initializing melonJS and the "Game Namespace".
 */

/*global me debugPanel*/

var game = {

	/**
	 * Game version; the same as `package.json`.
	 */
	version : "0.0.1",

	/**
	 * Stores information that will be used on current
	 * game session.
	 *
	 * @note This is reset every time the game restarts
	 *       For persistent information saving
	 *       (across page loads, for example) see `me.save`
	 */
	data : {
		// How many times the player has died
		deaths : 0,

		// First level to be loaded
		currentLevel : "area000"
	},

	/**
	 * Global tile size.
	 * Throughout the game, this is the value that
	 * will be used for the square tiles, width AND height.
	 */
	tile_size : 2,

	/**
	 * Returns the pixel coordinates for a specific
	 * tile.
	 *
	 * This is so we can always work with tile sizes
	 * instead of directly with pixels.
	 */
	tile : function(n) {
		return (n * game.tile_size);
	},

	/**
	 * Returns the pixel coordinates for half the
	 * size of a regular tile.
	 */
	half_tile : function(n) {
		return (n * (game.tile_size/2));
	},

	/**
	 * This function runs as soon as the page loads.
	 *
	 * Meaning when all resources were downloaded from
	 * the server (GET requests).
	 *
	 * At the end, it launches the Loading Screen.
	 */
	"onload" : function() {

		// Initialize the video, making sure to stretch the canvas
		// to fill the available space.
		// TODO: See if `double buffering` is any good for performance
		if (! me.video.init("screen", 32, 32, true, "auto", true)) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}

		// Add "#debug" to the URL to enable the debug mode
		// - Has a debug Panel on top
		// - Several gameplay features are enabled (like secret keys)
		//
		if (document.location.hash === "#debug") {
			window.onReady(function() {
				me.plugin.register.defer(this, debugPanel, "debug");
			});
		}

		// Initialize the audio.
		me.audio.init("ogg,mp3");

		// My own custom loading screen!
		//
		// Will only go to it after loading it's background
		// image first.
		me.loader.load(

			// I need to full specify the resource here
			// because all the resources weren't really loaded yet.
			{
				name : "loading-bg",
				type : "image",
				src  : "data/image/loading.png"
			},

			// Called when finished loading the resource above
			this.goToLoadingScreen.bind(this),

			// Called when an error occurs when loading
			function() {
				alert("Couldn't load resources!");
			}
		);
	},

	/**
	 * Changes the current state to the loading screen.
	 * @note Only call this when you're sure any resources used
	 *       there were loaded (for instance, the background image)!
	 */
	goToLoadingScreen : function() {

		// For it's implementation, see file `states/loading.js`
		me.state.set(me.state.LOADING, new game.CustomLoadingScreen());

		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		// (defined on `js/resources.js`
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		// (pre-defined state)
		me.state.change(me.state.LOADING);
	},

	/**
	 * Run as soon as all the game resources loads
	 * (past the loading screen).
	 */
	loaded : function() {

		// I'm changing the global gravity because
		// the game is 32x32 -- come on, 9.8 would move
		// a thing by 9 pixels!
		me.sys.gravity = 0.2;

		// Defining all our game states.
		// They're used by `me.state.change()`
		// (these are just constants, ignore the right side)
		me.state.STATE_MAIN_MENU    = me.state.USER + 0;
		me.state.STATE_OPTIONS_MENU = me.state.SETTINGS;
		me.state.STATE_CREDITS      = me.state.CREDITS;
		me.state.STATE_GAME_OVER    = me.state.GAMEOVER;
		me.state.STATE_AREA_SELECT  = me.state.USER + 2;
		me.state.STATE_PLAY         = me.state.PLAY;
		me.state.STATE_VICTORY      = me.state.USER + 3;

		// Attaching our state constants to actual
		// objects.
		// Each one has it's file under the `js/screens` directory
		me.state.set(me.state.STATE_MAIN_MENU, new game.MainMenuState());
		me.state.set(me.state.STATE_PLAY,      new game.PlayState());
		me.state.set(me.state.STATE_CREDITS,   new game.CreditsState());

		// Global transition to occur between all states
		me.state.transition("fade", "#000000", 250);

		// Add game entities to the entity pool.
		// They're defined on the `js/entities` directory
		//
		// Arguments:
		// 1. Object name on Tiled - we'll look for it when
		//    reading Tiled maps' entities.
		// 2. Class name to create (each on it's own file)
		// 3. If you plan on creating more than one of those,
		//    set this as true to speed things up.
		//
		me.pool.register("player",       game.playerEntity);
		me.pool.register("spike",        game.spikeEntity,       true);
		me.pool.register("spike-group",  game.spikeGroupEntity,  true);
		me.pool.register("checkpoint",   game.checkpointEntity,  true);
		me.pool.register("enemy-path",   game.enemyPathEntity,   true);
		me.pool.register("enemy-bouncy", game.enemyBouncyEntity, true);
		me.pool.register("message",      game.messageEntity,     true);
		me.pool.register("alert",        game.alertEntity  ,     true);

		// Defining some custom constants to uniquely
		// identify some entities
		me.game.SPIKE_OBJECT      = "spike";
		me.game.CHECKPOINT_OBJECT = "checkpoint";

		// Global fonts we'll use to draw text
		// (see `resources.js`)
		game.font_white = new me.BitmapFont("font-white", {x: 4, y:3});
		game.font_black = new me.BitmapFont("font-black", {x: 4, y:3});
		game.font_blue  = new me.BitmapFont("font-blue",  {x: 4, y:3});

		// Default settings for the whole game.
		// If we already have saved these settings,
		// they won't have their default values.
		me.save.add({
			// Flag to tell if this is the first time
			// the player's running this game.
			firstTime : true,

			// Enable/disable all audio
			// (music and sound effects)
			sound : true,

			musicVolume : 1.0,
			sfxVolume   : 0.2,

			// If we're going to show the stars
			// at the background
			stars : true,

			// How many times this user beat
			// the game
			beatGame : 0
		});

		// If these settings have different values
		// than the default it means we saved the
		// settings and the user is restarting the game.
		if (me.save.firstTime) {
			// Do somethin'
		}
		else {
			// Greet the player for returning
			// to the game
		}
		me.save.firstTime = false;

		// Due to the way melonJS is designed, we must
		// first play the background music AND THEN
		// enable/disable the audio based on the
		// settings...
		me.audio.playTrack("main-menu", me.save.musicVolume);

		if (! me.save.sound)
			me.audio.disable();

		// Start the game.
		me.state.change(me.state.STATE_MAIN_MENU);
	},

	/**
	 * Small helper that changes the Window title
	 * (everything inside <title> .. </title>.
	 */
	changeWindowTitle : function (title) {

		// Since accessing the DOM takes a while, let's
		// do it once and keep a global reference to the
		// <title> thingy
		game.titleElement = game.titleElement || document.getElementsByTagName("title")[0];

		game.titleElement.innerHTML = title;
	},






	// THESE ARE HERE BECAUSE I COULDN'T FIND A BETTER PLACE
	//
	// TODO: Figure out a best way to put them, since stars
	//       can be created and deactivated at any state




	/**
	 * Creates/Destroys the background thing that spawns random
	 * stars all around.
	 *
	 * You can call it multiple times without worrying.
	 *
	 * See file `entities/star-background.js`.
	 *
	 * @note If you want to have it between states, you MUST
	 *       call `game.enableStars(false)` when at
	 *       `onDestroyEvent` and then `game.enableStars(true)`
	 *       when at `onResetEvent`!
	 */
	enableStars : function(option) {

		// Avoiding re-initializing stuff.
		game.stars = game.stars || null;

		// Do I really need to double check this?
		// if (! me.save.stars) {
		// 	option = false;
		// }

		if (option) {

			// Will create stars
			//
			// But of course, won't do anything if they
			// already exist.
			if (game.stars !== null)
				return;

			game.stars = new game.starBackground();

			// How will this be drawn on top of other stuff.
			//
			// I had to adjust it so it could be between the
			// map's background and the map's tiles.
			var z = 2;

			// Adding the particle system
			// (and the particles themselves) to the game.
			me.game.world.addChild(game.stars, z);
			me.game.world.addChild(game.stars.container, z);

			// Finally, command the system to launch constantly
			// the particles, like a fountain
			game.stars.streamParticles();
		}
		else {

			// Will destroy stars
			//
			// But of course won't do anything if they
			// were already destroyed
			if (game.stars === null)
				return;

			game.stars.stopStream();

			me.game.world.removeChild(game.stars.container);
			me.game.world.removeChild(game.stars);

			game.stars = null;

		}
	}
};

