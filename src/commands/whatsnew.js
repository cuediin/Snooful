module.exports = {
	aliases: [
		"whatsnew"
	],
	description: "Displays what is new with the bot.",
	handler: args => {
		whats_new="";
		whats_new += "New command: setmodonly true/false, this updates the settings file, to determine if only moderators are allowed to run bot commands\n"
		whats_new += "New command: updatemods, this updates the moderators in the settings file, so they can run commands or update the bot\n"
		whats_new += "New command: setmodlog, this updates the channels all bot commands are duplicated to, and any future updates/commands issued by the bot.\n"
		whats_new += "New command: updaterules, this updates the subreddit rules in the settings file, so it can be displayed using the displayrules command\n"
		whats_new += "New command: displayrules, this displays the rules for the Subreddit.\n";
		whats_new += "New command: allowed_bot_commands add/remove/clear/list/default, this allows you to add specific commands that non moderators are allowed to run\n"
		whats_new += "New command: whatsnew, this allows you to see what is new\n"
		whats_new += "New command: modreport, sets the not authorised message\n"
		whats_new += "New command: setnotauthorised, sets the not authorised message\n"
		whats_new += "New feature: user activity in your chatrooms\n"
		whats_new += "New command: userreport, gives the statistics on a user\n"
		whats_new += "New feature: forced all commands to go to lowercase, to ignore case sensitivty on input\n"
		args.send(whats_new)
	},
	longDescription: "Displays what is new with the bot.",
	name: "whatsnew",
};
