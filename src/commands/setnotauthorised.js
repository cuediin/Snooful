module.exports = {
	arguments: [{
		description: "Sets the new not authorised message.",
		key: "notauth_message",
		type: "string",
	}],
	description: "Sets the new not authorised message.",
	handler: args => {
		const oldMsg = args.settings.get("notauth_message");
		if (args.notauth_message) {
			if (oldMsg === args.notauth_message) {
				args.send(args.localize("update_notauth_message_no_change"));
			} else {
				args.settings.set("notauth_message", args.notauth_message);
				args.send(args.localize("update_notauth_message"));
			}
		} else if (oldMsg === undefined) {
			args.send(args.localize("clear_notauth_message_no_change"));
		} else {
			args.settings.clear("leave_message");
			args.send(args.localize("clear_notauth_message"));
		}
	},
	longDescription: "Sets the message that is sent when an unauthorised user tries to use a bot command. {USER} is replaced with the user's name. {allowed_commands} is replaced with comma separated command list.",
	name: "setnotauthmessage",
};
