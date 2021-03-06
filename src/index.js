const config = {
	credentials: {},
	settingsManager: "@snooful/json-settings",
	...require("./../config.json"),
};

const Snoowrap = require("snoowrap");

const log = require("./debug.js");

const version = require("./../package.json").version;

const path = require("path");

// Set up in a way where legacy settings managers work too
const setMan = require(config.settingsManager);
const SettingsManager = setMan.SettingsManager || setMan;
const extension = setMan.extension || "";

log.settings("passing off settings handling to the '%s' module", config.settingsManager);

const settings_filename = '/home/chatbot/settings_' + config.environment + extension;
const settings = new SettingsManager(settings_filename);
const locales = require("./locales.json");
const format = require("string-format");
const upsidedown = require("upsidedown");

const pify = require("./utils/promisify");

const chance = new require("chance").Chance();
/**
 * Selects a string.
 * @param {(object|*[]|*)} msg If an object, selects an key based on the weight value. If an array, picks a random element. Otherwise, converts to a string.
 */
function chanceFormats(msg) {
	if (Array.isArray(msg)) {
		return chance.pickone(msg);
	} else if (msg instanceof Object) {
		return chance.weighted(Object.keys(msg), Object.values(msg));
	} else {
		return msg.toString();
	}
}
/**
 * Gets the subreddit from a channel.
 * @param {*} channel The channel to get the subreddit from.
*/
function channelSub(channel) {
	if (channel.data) {
		const data = JSON.parse(channel.data);
		return data.subreddit ? data.subreddit.name : channel.url;
	} else {
		return channel.url;
	}
}
/**
 * The prefix required by commands to be considered by the bot.
 */
const prefix = config.prefix;
const this_bot_owner = config.bot_owner;

const parser = require("@snooful/orangered-parser");
const creq = require("clear-require");

/**
 * Reloads the commands.
 */
function reload() {
	parser.clear();
	creq.all();
	parser.registerDirectory("./src/commands");
}
reload();

/**
 * Logs an error to console.
 * @param {*} error The error that occurred.
 * @returns {string} The error message.
 */
function safeFail(error) {
	console.log(error)
	const errMsg = error instanceof Error ? error.message : error;
	log.main("an error occurred: %s", errMsg);
	return errMsg;
}
process.on("unhandledRejection", safeFail);
process.on("unhandledException", safeFail);

/**
 * The client information.
 */
let client = {};

/**
 * Formats a string.
 * @param {string} lang A language code. If the key is not localized in this language or this value is not provided, uses en-US.
 * @param {string} key The key to localize.
 * @param {...any} formats The values to provide for placeholders.
 * @return {?string} A string if a localization could be provided, or null.
 */
function localize(lang = "en-US", key = "", ...formats) {
	const thisLocal = lang ? (locales[lang] || locales["en-US"]) : locales["en-US"];
	const msg = thisLocal[key] || locales["en-US"][key];

	if (msg) {
		const msgChosen = chanceFormats(msg);

		const formatted = format(msgChosen, ...formats);
		return lang === "uǝ" ? upsidedown(formatted) : formatted;
	} else {
		return null;
	}
}

function cue_sendmessage(channel,message) {
	channel_message = new Promise((resolve, reject) => {
		channel.sendUserMessage(message, (sentMessage, error) => {
			if (error) {
				reject(error);
			} else {
				resolve(sentMessage);
			}
		});
	 });
}


	/**
	 * Runs a command.
	 * @param {string} command The command to run, including prefix.
	 * @param {*} channel The channel the command was sent from.
	 * @param {*} message The message representing the command.
	 * @returns {undefined} Nothing is returned.
	 */

function 	cue_command_wrap(channel,unprefixedCmd,message,settingsWrapper) {
	let chData = {
			parsable: null,
		};
		if (channel.data) {
			try {
				chData = {
					parsable: true,
					...JSON.parse(channel.data),
				};
			} catch (error) {
				chData = {
					parsable: false,
				};
			}
		}


		try {
			parser.parse(unprefixedCmd, {
				author: message._sender.nickname,
				chData,
				channel,
				client,
				locales,
				/**
				 * Formats a string based on the set language of the subreddit/DM.
				 */
				localize: (...args) => {
					return localize(settingsWrapper.get("lang"), ...args);
				},
				localizeO: localize,
				log: log.commands,
				message,
				prefix,
				reddit,
				registry: parser.getCommandRegistry(),
				reload,
				sb,
				send: content => {
					return new Promise((resolve, reject) => {
						channel.sendUserMessage(content.toString(), (error , sentMessage) => {
							if (error) {
								reject(error);
							} else {
								resolve(sentMessage);
							}
						});
					});
				},
				settings: settingsWrapper,
				version,
			});
		} catch (error) {
			safeFail(error);
		}
	}

function update_user_stats(this_user,this_sub,command,this_utc) {
	user_report_this_user = this_user.toLowerCase();
	const settingsWrapper = settings.subredditWrapper(this_sub);
	const msgs = settingsWrapper.get("user_stats") || {};
	if (msgs[user_report_this_user+":no_messages"] == undefined) {
		msgs[user_report_this_user+":no_messages"] = 0;
		msgs[user_report_this_user+":no_empty_messages"] = 0;
		msgs[user_report_this_user+":no_total_characters"] = 0;
        msgs[user_report_this_user+":first_seen"] = this_utc;
        msgs[user_report_this_user+":last_seen"] = this_utc;
	}
	if (msgs[user_report_this_user+":first_seen"] == undefined) {
    msgs[user_report_this_user+":first_seen"] = this_utc;
	}

	if (command.length>0) {
		msgs[user_report_this_user+":no_messages"]++;
	  }
	else {
		msgs[user_report_this_user+":no_empty_messages"]++;
		}
	msgs[user_report_this_user+":no_total_characters"] += command.length;
    msgs[user_report_this_user+":last_seen"] = this_utc;
	settingsWrapper.set("user_stats", msgs);
  }

function is_valid_command(this_command) {
		var is_valid_command = "true";
		this_regexp = "^\\"+prefix+"[a-z0-9_-]+"
		if (this_command.match(new RegExp(this_regexp)) == null) {
			is_valid_command="false";
		  }
		return is_valid_command;
	  }

function handleCommand(command = "", channel = {}, message = {}) {
	this_sub = channelSub(channel);
	this_user = message._sender.nickname;
	update_user_stats(this_user,this_sub,command,message['createdAt']);
	let this_mod_channel = channel
	const settingsWrapper = settings.subredditWrapper(this_sub);
	if (settingsWrapper.get("mod_only") == undefined) {
		settingsWrapper.set("mod_only","false");
		settingsWrapper.set("notauth_message","Bite Me u/{USER}, only mods can use and abuse me. Allowed Commands are:\n{allowed_commands}");
		cue_sendmessage(this_mod_channel,localize("bot_welcome"))
		settingsWrapper.set("allowed_bot_commands","::");
		settingsWrapper.set("moderators","");
		settingsWrapper.set("channel_logs","");
		settingsWrapper.set("emotes_allowall","false");
		settingsWrapper.set("emotes",{});
		}
if (settingsWrapper.get("emotes_allowall") == undefined ) {
settingsWrapper.set("emotes_allowall","false"); }

		if (settingsWrapper.get("channel_logs") == undefined) {
			settingsWrapper.set("channel_logs","");
		  }
			if (settingsWrapper.get("allowed_bot_commands") == undefined) {
				settingsWrapper.set("allowed_bot_commands","::");
			  }
    if (settingsWrapper.get("emotes") == undefined) {
				settingsWrapper.set("emotes",{});
			  }
		 if (settingsWrapper.get("moderators") == undefined ) {
			  this_moderators = ""
				}
	this_allowed_bot_commands = settingsWrapper.get("allowed_bot_commands")
	if (message._sender.nickname !== client.nickname) {
		 this_command=""
				if (command.startsWith(prefix)) {
			command_line = command
			this_regexp = "^\\"+prefix+"[a-zA-Z0-9_-]+"
			this_command = command_line.replace(prefix, "").replace(/ .*$/,"").toLowerCase();
			command_line =  command_line.replace(/ .*$/,"").toLowerCase() + command_line.replace(new RegExp(this_regexp),"");
			command = command_line
	  	}
	  if (is_valid_command(command) == "true") {
	  	const unprefixedCmd = command.replace(prefix, "");
			this_moderators = settingsWrapper.get("moderators")
      emotes = settingsWrapper.get("emotes")
	  	if (
				(settingsWrapper.get("mod_only") == "false") ||
			 (this_user.toLowerCase() == this_bot_owner.toLowerCase()) ||
			 (this_moderators.includes("::"+this_user.toLowerCase()+"::")) ||
			  (this_allowed_bot_commands.includes("::"+unprefixedCmd.replace(/ .*/,"").toLowerCase()+"::")) ||
				( (settingsWrapper.get("emotes_allowall") == "true" ) && (emotes[this_command] !== undefined) )
			 ) {
				if ( parser.getCommandRegistry().has(this_command) == true) {
		      cue_command_wrap(channel,unprefixedCmd,message,settingsWrapper);
			    }
			  else if (emotes[this_command] !== undefined) {
						this_emote = emotes[this_command].replace(/{USER}/g, message._sender.nickname)
						cue_sendmessage(channel,this_emote)
					  }
					else {
						cue_sendmessage(channel,"Command \""+this_command+"\" not found.")
					  }
				if ( (settingsWrapper.get("channel_logs") !== "") ) {
					// && !(unprefixedCmd.includes(/^vote cast/))) {
			  	this_channel_url = settingsWrapper.get("channel_logs")
//		      pify(sb.GroupChannel.getChannel.bind(sb.GroupChannel), this_channel_url).then(this_channel => {
//			     cue_sendmessage(this_channel,this_user+" sent the mod command \""+command+"\" from channel \""+channel['name']+"\"")
//			     });
				 }
		    log.commands("recieved command '%s' from '%s' channel", unprefixedCmd, channel.name);
	      }
	    else {
	      allowed_commands = settingsWrapper.get("allowed_bot_commands").replace("::","").replace(/::/g,", ").replace(/, $/g,"\n");
	      this_message = "" + settingsWrapper.get("notauth_message").replace("{USER}",this_user).replace("{allowed_commands}",allowed_commands)
	      cue_sendmessage(channel,this_message)
        }
      }
	}
}

const Sendbird = require("sendbird");
const sb = new Sendbird({
	appId: "2515BDA8-9D3A-47CF-9325-330BC37ADA13",
});

// Use error-first callbacks, like every other library does
sb.setErrorFirstCallback(true);

/**
 * Accepts invites to all channels with pending invitations.
 */
function acceptInvitesLate() {
	// Query for group channels
	const query = sb.GroupChannel.createMyGroupChannelListQuery();
	pify(query.next.bind(query)).then(list => {
		// Accept the invites!
		list.filter(channel => {
			return channel.myMemberState === "invited";
		}).forEach(channel => {
			pify(channel.acceptInvitation.bind(channel)).then(() => {
				log.invites("accepted late channel invitation to '%s'", channel.name);
			}).catch(() => {
				log.invites("failed to accept late channel invitation to '%s'", channel.name);
			});
		});
	}).catch(() => {
		log.invites("failed to get list of channels to accept late invites");
	});
}

const reddit = new Snoowrap(Object.assign(config.credentials, {
	userAgent: `Snooful v${version}`,
}));

/**
 * Grabs a new access token and connects to Sendbird.
 */
function launch() {
	// Fetch our access token.
	log.main("fetching new access token");
	reddit.oauthRequest({
		baseUrl: "https://s.reddit.com/api/v1",
		method: "get",
		uri: "/sendbird/me",
	}).then(sbInfo => {
		// Get our Reddit user ID
		log.main("getting id");
		reddit.getMe().id.then(id => {
			// We have both necessary values, so let's connect to Sendbird!
			log.main("connecting to sendbird");
			pify(sb.connect.bind(sb), "t2_" + id, sbInfo.sb_access_token).then(userInfo => {
				// We did it! Let's store the user info in a higher scope.
				log.main("connected to sendbird");
				client = userInfo;

				// Let's catch up on the invites we might've missed while offline.
				acceptInvitesLate();
			}).catch(() => {
				log.main("couldn't connect to sendbird");
			});
		}).catch(() => {
			log.main("could not get id");
		});
	}).catch(() => {
		log.main("could not get access token");
	});
}
launch();

const handler = new sb.ChannelHandler();

handler.onMessageReceived = (channel, message) => handleCommand(message.message, channel, message);
handler.onUserReceivedInvitation = (channel, inviter, invitees) => {
	if (invitees.map(invitee => invitee.nickname).includes(client.nickname)) {
		// I have been invited to a channel.
		log.invites("invited to channel");

		// Let's join!
		pify(channel.acceptInvitation.bind(channel)).then(() => {
			log.invites(`automatically accepted channel invitation to ${channel.name}`);

			// Now that we've joined, let's send our introductory message!
			pify(channel.sendUserMessage.bind(channel), channel.sendUserMessage(localize("en-US", "invite_message", {
				inviter: inviter.nickname,
				me: client.nickname,
				prefix,
			}))).then(() => {
				log.invites("sent introductory message");
			}).catch(() => {
				log.invites("failed to send introductory message");
			});
		}).catch(() => {
			log.invites("failed to accept channel invitation");
		});
	}
};



handler.onUserJoined = (channel, user) => {
	if (user.nickname === client.nickname) return;

	log.gateway("user joined, handling join message");

	const sub = channelSub(channel);
	if (settings.get(sub, "join_message") !== undefined) {
		pify(channel.sendUserMessage.bind(channel), settings.get(sub, "join_message").replace(/{USER}/g, user.nickname).replace(/\\n/g, "\n")).then(() => {
			log.gateway("sent join message");
		}).catch(() => {
			log.gateway("failed to send join message");
		});
	}
};
handler.onUserLeft = (channel, user) => {
	if (user.nickname === client.nickname) return;

	log.gateway("user left, handling leave message");

	const sub = channelSub(channel);
	if (settings.get(sub, "leave_message") !== undefined) {
		pify(channel.sendUserMessage.bind(channel), settings.get(sub, "leave_message").replace(/{USER}/g, user.nickname)).then(() => {
			log.gateway("sent leave message");
		}).catch(() => {
			log.gateway("failed to send leave message");
		});
	}
};

sb.addChannelHandler("handler", handler);
