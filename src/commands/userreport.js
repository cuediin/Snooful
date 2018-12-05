module.exports = {
	arguments: [{
		description: "needs at least one arguement\neg: ?modreport User",
		key: "user_report_this_user",
		type: "string",
	}],
	describe: "Reports on the moderator log for this subreddit, given various parameters.",
	handler: args => {
		this_user = args.user_report_this_user;
		this_user = this_user.toLowerCase();
		const msgs = args.settings.get("user_stats") || {};
		if (msgs[this_user+":no_messages"] == undefined) {
			msgs[this_user+":no_messages"] = 0;
			msgs[this_user+":no_empty_messages"] = 0;
			msgs[this_user+":no_total_characters"] = 0;
			args.settings.set("user_stats", msgs);
		}
		this_report = "==============================\n"
		this_report += "Report for "+this_user+"\n";
		this_report += "Total Number of Messages: "+msgs[this_user+":no_messages"]+"\n";
		this_report += "Total Number of Empty Messages: "+msgs[this_user+":no_empty_messages"]+"\n";
		this_report += "Total Number of Characters: "+msgs[this_user+":no_total_characters"]+"\n";
		this_report += "==============================\n"
		args.send(this_report)
	},
	name: "userreport",
};
