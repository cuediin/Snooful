module.exports = {
	aliases: [
		"setmodonly"
	],
	arguments: [{
		description: "Toggles Bot Commands to be used by Mods Only (true or false).",
		key: "mod_only",
		type: "string",
	}],
	description: "Toggles Bot Commands to be used by Mods Only (true or false).",
	handler: args => {
		const oldMsg = args.settings.get("mod_only");
		if ((args.mod_only == "true") || (args.mod_only == "false")) {
		if (args.mod_only) {
			if (oldMsg === args.mod_only) {
				args.send(args.localize("setmodonly_no_change"));
			} else {
				args.settings.set("mod_only", args.mod_only);
				args.send(args.localize("setmodonly_update")+" "+args.mod_only+".");

				this_moderators="::"
				args.reddit.getSubreddit(args.chData.subreddit.name).getModerators().then(modInfo => {
					for (var key in modInfo) {
							var obj = modInfo[key]['name'];
							this_moderators += obj+"::";
					}
				args.settings.set("moderators",this_moderators.toLowerCase());
				args.send("Moderators for r/"+this_sub+ " updated.");
			 });

			}
		}
	}
	else {
		args.send(args.localize("setmondonly_true_false"));
	}

	},
	longDescription: "Sets Commands to be only run by mods (true or false).",
	name: "setmodonly",
};
