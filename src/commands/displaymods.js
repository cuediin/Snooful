module.exports = {
	description: "Displays the moderators for this subreddit.",
	handler: args => {
		this_moderators="Moderators for r/"+this_sub+ " are:\n"
		args.reddit.getSubreddit(args.chData.subreddit.name).getModerators().then(modInfo => {
			for (var key in modInfo) {
					var obj = modInfo[key]['name'];
		            this_moderators += obj + "\n";
			}
		args.send(this_moderators);
	 });

	},
	name: "displaymods",
};
