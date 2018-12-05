module.exports = {
	arguments: [{
		description: "Toggles Bot Defense Mechanism for your Subreddit (true or false).",
		key: "defend_me",
		type: "string",
	}],
	description: "Toggles Bot Commands to be used by Mods Only (true or false).",
	handler: args => {
		const oldMsg = args.settings.get("defend_me");
		if ((args.defend_me == "true") || (args.defend_me == "false")) {
		if (args.defend_me) {
			if (oldMsg === args.defend_me) {
				args.send(args.localize("setmodonly_no_change"));
			} else {
				args.settings.set("defend_me", args.defend_me);
				args.send(args.localize("setmodonly_update")+" "+args.defend_me+".");
			}
		}
	}
	else {
		args.send(args.localize("setmodonly_true_false"));
	}

	},
	longDescription: "Toggles Bot Defense Mechanism for your Subreddit (true or false).",
	name: "setdefend",
};
