module.exports = {
	aliases: [
		"displayrules"
	],
	description: "Displays the Rules for this Subreddit.",
	handler: args => {
		this_rules=args.settings.get("rules_brief")
		args.send(this_rules)
	},
	longDescription: "Displays the Rules for this Subreddit.",
	name: "displayrules",
};
