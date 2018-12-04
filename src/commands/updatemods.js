module.exports = {
	description: "Updates the moderators for this subreddit in the settings file.",
	handler: args => {
		this_moderators="::"
		args.reddit.getSubreddit(args.chData.subreddit.name).getModerators().then(modInfo => {
			for (var key in modInfo) {
					var obj = modInfo[key]['name'];
					this_moderators += obj+"::";
			}
		args.settings.set("moderators",this_moderators.toLowerCase());
		args.send("Moderators for r/"+this_sub+ " updated.");
	 });

	},
	name: "updatemods",
};
