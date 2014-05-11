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

		me.game.world.addChild(new me.SpriteObject(
			0, 0,
			me.loader.getImage("main-menu-bg")
		));

		this.menu = new me.Menu(2, 14);
		this.menu.addItem(
			" START",
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
		me.game.world.addChild(this.menu);




		/////////////////////////////////////////////////////////////////////
		// WHY IS THIS NOT WORKING?
		/////////////////////////////////////////////////////////////////////

		// Here we create a particle emitter to launch particles
		// on the background.
		//
		// First, setting up how will the particles behave.
		var particleEmitterSettings = {
			width          : me.game.viewport.width,
			gravity        : 1,
			totalParticles : 200,
			speedVariation : 3,
			onlyInViewport : true,
			floating       : true,
			z : 99
		};
		// And then creating the thing that will emit them.
		this.particleEmitter = new me.ParticleEmitter(0, 0, particleEmitterSettings);
		me.game.world.addChild(this.particleEmitter);

		// Launch constantly the particles, like a fountain
		this.particleEmitter.streamParticles();

		/////////////////////////////////////////////////////////////////////





		// Checking out the user input:
		// control the menu with arrow keys and
		// select with Enter.
		// Mouse over and click is handled by the menu itself.
		me.input.bindKey(me.input.KEY.DOWN,  "down",  true);
		me.input.bindKey(me.input.KEY.UP,    "up",    true);
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindKey(me.input.KEY.SPACE, "enter", true);

		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action == "down") {
				me.state.current().menu.next();
				me.audio.play("menu");
			}
			else if (action == "up") {
				me.state.current().menu.previous();
				me.audio.play("menu");
			}
			else if (action == "enter") {
				me.state.current().menu.activate();
				me.audio.play("menu");
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
	}
});

