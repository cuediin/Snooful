//this is a placeholder as the command is run from the handler script directly
module.exports = {
	description: "Sets the current channel as the bot moderator reporting channel for this Subreddit.",
	handler: args => {
		args.settings.set("channel_mod_reports",args.channel['url']);
		args.send("Channel for mod reporting set to \""+args.channel['name']+"\".")
	},
	longDescription: "Sets the current channel as the bot moderator reporting channel for this Subreddit.",
	name: "setmodreport",
};
