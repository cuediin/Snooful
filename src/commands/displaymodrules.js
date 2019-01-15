module.exports = {
	description: "Displays the Mod Rules for this Subreddit.",
	handler: args => {
		this_rules=args.settings.get("mod_rules")
		args.send(this_rules)
	},
	longDescription: "Displays the Mod Rules for this Subreddit.",
	name: "displaymodrules",
};
