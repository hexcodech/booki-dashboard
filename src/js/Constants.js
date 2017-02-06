export const API_URL		= "http://localhost:8101";
export const API_VERSION	= 1;
export const CLIENT_ID		= "58678cb95d20d9be0ecb142c"; //NOT VALID DATA, TODO: PLACE SOMEWHERE SAVE
export const CLIENT_SECRET	= "jbRA3q/ibi6A0FS4yL7sV3UAf6rtjO";
export const REDIRECT_URI	= "http://localhost:8080/auth/callback";

export const JSONTreeTheme	= {
	scheme: 'booki',
	author: 'Nico Hauser',
	base00: '#FFFFFF', //background
	base01: '#FF0000',
	base02: '#FF0000',
	base03: '#FFA176', //item string color (expanded)
	base04: '#FF0000',
	base05: '#FF0000',
	base06: '#FF0000',
	base07: '#537EA5', //text color
	base08: '#e74c3c', //null color, undefined color, function color, symbol color, 
	base09: '#6360B2', //boolean color, number color
	base0A: '#FF0000',
	base0B: '#50AC89', //string color, date color, item string color
	base0C: '#FF0000',
	base0D: '#FFC676', //label color, arrow color
	base0E: '#FF0000',
	base0F: '#FF0000'
};

export const PERMISSIONS = [
	"admin",
	"admin.system",
	"admin.system.stats",
	"admin.user",
	"admin.user.list",
	"admin.user.create",
	"admin.user.delete",
	"admin.user.editOthers",
];

export const LANGUAGES = [
	{value: "en", label: "English"},
	{value: "de", label: "Deutsch"},
	{value: "de_ch", label: "Schwiizerdütsch"}
];

export const NOTIFICATION_ANIMATION_DURATION = 1000;

export const COLOR_SUCCESS	= "#2ecc71";
export const COLOR_FAILURE	= "#e74c3c";
export const COLOR_INFO		= "#3498db";