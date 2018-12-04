module.exports = {
	arguments: [{
		description: "needs at least one arguement\neg: ?modreport type=banuser\ntype=XX :XX is one of banuser, unbanuser, removelink, approvelink, removecomment, approvecomment, addmoderator, invitemoderator, uninvitemoderator, acceptmoderatorinvite, removemoderator, addcontributor, removecontributor, editsettings, editflair, distinguish, marknsfw, wikibanned, wikicontributor, wikiunbanned, wikipagelisted, removewikicontributor, wikirevise, wikipermlevel, ignorereports, unignorereports, setpermissions, setsuggestedsort, sticky, unsticky, setcontestmode, unsetcontestmode, lock, unlock, muteuser, unmuteuser, createrule, editrule, deleterule, spoiler, unspoiler\n\nmod=YY :YY is the name of the user.\n\nevents=ZZ :ZZ is the last ZZ number of events.\n",
		key: "my_args",
		type: "string",
	}],
	describe: "Reports on the moderator log for this subreddit, given various parameters.",
	handler: args => {
		mod_actions = "::banuser::unbanuser::removelink::approvelink::removecomment::approvecomment::addmoderator::invitemoderator::uninvitemoderator::acceptmoderatorinvite::removemoderator::addcontributor::removecontributor::editsettings::editflair::distinguish::marknsfw::wikibanned::wikicontributor::wikiunbanned::wikipagelisted::removewikicontributor::wikirevise::wikipermlevel::ignorereports::unignorereports::setpermissions::setsuggestedsort::sticky::unsticky::setcontestmode::unsetcontestmode::lock::unlock::muteuser::unmuteuser::createrule::editrule::deleterule::spoiler::unspoiler::"
		my_args = {"mod":"","events":"","action":""}
		these_args = ""+args.my_args+"";
		these_args = these_args.split(' ')
		for (var key in these_args) {
				this_arg =
				my_args[these_args[key].replace(/=.*/g,"")] = these_args[key].replace(/.*=/g,"")
		}
		this_options_updated = "false"
		this_options = {};
		if (my_args['type'] !== "") { this_options['type'] = my_args['type'];this_options_updated = "true";}
		if (my_args['mod'] !== "") { this_options['mods'] = [ my_args['mod'] ];this_options_updated = "true";}
		if (this_options_updated == "false") {this_options = null;}
		args.reddit.getSubreddit(args.chData.subreddit.name).getModerationLog(this_options).then( modInfo => {
			this_report = ""
			this_line = "here"
			this_counter = 0
    	for (var key in modInfo) {
				if (modInfo[key]['created_utc']>0) {
					this_utc = modInfo[key]['created_utc']
          this_datetime = new Date(this_utc*1000)
          this_datetime_string = this_datetime.getFullYear()+"/"+(this_datetime.getMonth()+1)+"/"+this_datetime.getDate()+" "+this_datetime.getHours()+"::"+this_datetime.getMinutes()
				  this_line = ""+this_datetime_string+"\n"+modInfo[key]['mod']+"::"+modInfo[key]['target_author']+"::"+modInfo[key]['action']+"\n";
					if ( (my_args['events'] == "") || ( (my_args['events']>1) && (my_args['events']>this_counter) ) ) {
					  this_counter++;
					  args.send(this_line);
					}
				}
				}
		 });
	},
	name: "modreport",
};
