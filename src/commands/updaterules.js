//this is a placeholder as the command is run from the handler script directly
module.exports = {
	description: "Updates the Rules for this subreddit.",
	handler: args => {
		this_rules=""
	  this_rules_brief=""
	  counter=0;
	  args.reddit.getSubreddit(args.chData.subreddit.name).getRules().then(rules => {
	 	 for (var key in rules['rules']) {
	 			 counter++;
	 			 this_rules += ""+counter+"."+rules['rules'][key]['short_name']+"\n"+rules['rules'][key]['description']+"\n";
	 			 this_rules_brief += ""+counter+". "+rules['rules'][key]['short_name']+"\n";
	 	 }
	 	 args.settings.set("rules_brief",this_rules_brief);
	 	 args.settings.set("rules_verbose",this_rules);
		 args.send("Rules for r/"+this_sub+ " updated.");
	 });
	},
	name: "updaterules",
};
