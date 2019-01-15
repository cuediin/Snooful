module.exports = {
	arguments: [{
		description: "The new mod rules.",
		key: "mod_rules",
		type: "string",
	}],
	description: "Sets the mod rules.",
	handler: args => {
		const oldMsg = args.settings.get("mod_rules");
		if (args.mod_rules) {
			if (oldMsg === args.mod_rules) {
				args.send(args.localize("update_modrules_message_no_change"));
			} else {
				args.settings.set("mod_rules", args.mod_rules);
				args.send(args.localize("update_modrules_message"));
			}
		} else if (oldMsg === undefined) {
			args.send(args.localize("clear_modrules_message_no_change"));
		} else {
			args.settings.clear("mod_rules");
			args.send(args.localize("clear_modrules_message"));
		}
	},
	longDescription: "Sets the mod rules.",
	name: "setmodrules",
};
