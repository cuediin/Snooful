//this is a placeholder as the command is run from the handler script directly
module.exports = {
	description: "Sets the current channel as the bot log channel for this Subreddit.",
	handler: args => {
			args.settings.set("channel_logs",args.channel['url']);
			args.send("Channel for bot actions set to \""+args.channel['name']+"\".")
	},
	name: "setmodlog",
};
