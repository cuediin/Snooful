module.exports = {
	arguments: [{
		description: "list, add, remove, clear, default",
		key: "action",
		type: "string",
	},{
		description: "bot command",
		key: "bot_command",
		type: "string",
	}],
	describe: "Modifies the allowed bot command availability. Add adds a command, remove removes a command, clear removes all commands.",
	handler: args => {
		switch(args.action) {
			case "add":
			  this_new_commands = ""+args.settings.get("allowed_bot_commands")+""+args.bot_command+"::";
			  args.settings.set("allowed_bot_commands",this_new_commands.toLowerCase());
				args.send("Allowed bot command "+args.bot_command+" added.\n");
			  break;
			case "remove":
			  this_new_commands = ""+args.settings.get("allowed_bot_commands").replace(args.bot_command+"::","");
			  args.settings.set("allowed_bot_commands",this_new_commands);
				args.send("Allowed bot command "+args.bot_command+" removed.\n");
			  break;
			case "default":
	 			args.settings.set("allowed_bot_commands","::displayrules::birthday::command::");
				args.send("Allowed bot commands set to default, displayrules, birthday and command.\n");
	 			break;
			case "clear":
				args.settings.set("allowed_bot_commands","::");
				args.send("All allowed bot commands removed.\n");
				break;
	 	 default:
		 	 args.send("Current allowed bot commands are:\n"+args.settings.get("allowed_bot_commands").replace("::","").replace(/::/g,"\n"));
		}
	},
	name: "allowed_bot_commands",
};
