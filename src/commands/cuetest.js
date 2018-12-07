//this is a placeholder as the command is run from the handler script directly
module.exports = {
	description: "Updates the Rules for this subreddit.",
	handler: args => {
//		args.reddit.getSubreddit(args.chData.subreddit.name).getSettings().then(console.log);
//console.log(args)
/*
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
*/
/*
this_message_array = args.channel['lastMessage']
this_regexp_pattern = "^\\" + args.prefix + "cuetest[.*]"
var this_regexp = new RegExp (this_regexp_pattern)
this_message_id = "" + this_message_array.messageId
this_message = "" + this_message_array.message
//args.channel.deleteMessage(this_message_id)
console.log(this_message_array)
const pify = require("./../utils/promisify");
pify(args.sb.GroupChannel.getChannel.bind(args.sb.GroupChannel), 'sendbird_group_channel_26080032_0ee72ca2f8be7775685712141e3d42c76189693d').then(this_channel => {
	this_channel.deleteMessage(this_message_id)
	this_channel.deleteMessage(this_message_id)
	this_channel.send("this channel.")
 });
*/
  args.send("Done Sir.")
	},
	name: "cuetest",
};
