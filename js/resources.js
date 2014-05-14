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
	{
		name : "enemy-square",
		type : "image",
		src  : "data/image/sprite/enemy-square.png"
	},
	{
		name : "star",
		type : "image",
		src  : "data/image/sprite/star.png"
	},

	// Backgrounds
	{
		name : "background",
		type : "image",
		src  : "data/image/background.png"
	},
	{
		name : "loading-bg",
		type : "image",
		src  : "data/image/loading.png"
	},
	{
		name : "main-menu-bg",
		type : "image",
		src  : "data/image/main-menu.png"
	},
	{
		name : "logo",
		type : "image",
		src  : "data/image/logo.png"
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
	{
		name: "font-blue",
		type: "image",
		src:  "data/image/font/blue.png"
	},

	// Maps
	{
		name : "area000",
		type : "tmx",
		src  :  "data/map/area000.tmx"
	},

	// Music
	{
		name    : "main-menu",
		type    : "audio",
		src     : "data/audio/bgm/",
		channel : 1
	},
	{
		name    : "area000",
		type    : "audio",
		src     : "data/audio/bgm/",
		channel : 1
	},

	// Sound Effects
	{
		name    : "menu",
		type    : "audio",
		src     : "data/audio/sfx/",
		channel : 2
	},
	{
		name    : "jump",
		type    : "audio",
		src     : "data/audio/sfx/",
		channel : 2
	},
	{
		name    : "death",
		type    : "audio",
		src     : "data/audio/sfx/",
		channel : 2
	},
	{
		name    : "checkpoint",
		type    : "audio",
		src     : "data/audio/sfx/",
		channel : 2
	}
];

