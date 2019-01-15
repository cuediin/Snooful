module.exports = {
	arguments: [{
		description: "list, add <name of emote> <emote_text>, remove <name of emote>, clearall",
		key: "action",
		type: "string",
	},{
		description: "",
		key: "emote_name",
		type: "string",
	},{
		description: "",
		key: "emote_text",
		type: "string",
	}],
	describe: "Modifies the Votes being run. ?vote add <Name of Vote> or ?vote list or ?vote remove <Vote ID (not the name)>.",
	handler: args => {
		if (args.settings.get("emotes") == undefined) {
			var msgs = new Object()
		  }
			else msgs = args.settings.get("emotes")
		switch(args.action) {
			case "add":
			    msgs[args.emote_name] = args.emote_text
					this_message = "Emote created for \""+args.emote_name+"\".\n"
					args.send(this_message);
					args.settings.set("emotes",msgs);
			  break;
				case "remove":
				  delete msgs[args.emote_name]
				  args.settings.set("emotes",msgs);
				  this_message = "Emote delete for \""+args.emote_name+"\".\n"
				  args.send(this_message);
				break;

case "allowall":
  if ( (args.emote_name == "true") || (args.emote_name == "false") ) {
args.settings.set("emotes_allowall",args.emote_name)
args.send("Emote commands allowall set to "+args.emote_name);
}
else { args.send("please select true or false for this command.")}
break;

					case "clearall":
					  args.settings.set("emotes",{});
					  args.send("All emotes removed.");
					  break;
			case "list":
			      this_emote_list = "Emote Name / Emote Text\n"
	 					for(var key in msgs) {
							this_emote_list += key+" / "+msgs[key] + "\n";
						  }
						args.send(this_emote_list);
	 			break;
	 	 default:
		 	 args.send("Please use a correct arguement with the "+args.prefix+"emote command\n");
		}
	},
	name: "emote",
};
