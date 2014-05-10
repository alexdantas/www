/**
 * All resources that need to be loaded.
 * (images, fonts, maps and audio)
 */

/*global game*/

game.resources = [

	// Tilesets
	{
		name : "tiles",
		type : "image",
		src  : "data/image/tile/tiles.png"
	},

	// Sprites
	{
		name : "player-spritesheet",
		type : "image",
		src  : "data/image/sprite/player.png"
	},
	{
		name : "spike-sprite-horizontal",
		type : "image",
		src  : "data/image/sprite/spike-horizontal.png"
	},
	{
		name : "spike-sprite-vertical",
		type : "image",
		src  : "data/image/sprite/spike-vertical.png"
	},
	{
		name : "checkpoint",
		type : "image",
		src  : "data/image/sprite/checkpoint.png"
	},

	// Backgrounds
	{
		name : "loading-bg",
		type : "image",
		src  : "data/image/loading.png"
	},

	// Font
	{
		name: "font-white",
		type: "image",
		src:  "data/image/font/white.png"
	},
	{
		name: "font-black",
		type: "image",
		src:  "data/image/font/black.png"
	},

	// Maps
	{
		name : "area000",
		type : "tmx",
		src  :  "data/map/area000.tmx"
	}
];

