module.exports = {
	arguments: [{
		description: "needs at least one arguement\neg: ?modreport User",
		key: "user_report_this_user",
		type: "string",
	}],
	describe: "Reports on the moderator log for this subreddit, given various parameters.",
	handler: args => {
		const msgs = args.settings.get("user_stats") || {};
		if (args.user_report_this_user == undefined) {
			this_user = ""
			var keys = []; for(var key in msgs) keys.push(key);
			msgs_sorted = keys.sort(function(a,b){return msgs[b]-msgs[a]});
			top = 5
			top_counter=0;
			top_empty_users = [];
			top_messages_users = [];
			top_characters_users = [];
			for(var key in msgs_sorted) {
				if (msgs_sorted[key].includes(":no_messages")) {
					top_messages_users.push(msgs_sorted[key])
				  }
				else	if (msgs_sorted[key].includes(":no_empty_messages")) {
						top_empty_users.push(msgs_sorted[key])
					  }
						else if (msgs_sorted[key].includes(":no_total_characters")) {
							top_characters_users.push(msgs_sorted[key])
						  }
			}
//			console.log(msgs_sorted)
//			console.log([top_messages_users[0]])
			this_report = "==============================\n"
			this_report += "Report for Top "+top+" Message Count\n";
			if (top > top_messages_users.length) {
				top = top_messages_users.length
			  }
			for (top_counter = 0; top_counter < top; top_counter++) {
        this_report += String(top_messages_users[top_counter]).replace(/:.*/,"") + ":" + msgs[top_messages_users[top_counter]] + "\n";
			  }
			this_report += "==============================\n";
			this_report += "Report for Top "+top+" Empty Message Count\n";
			if (top > top_empty_users.length) {
				top = top_empty_users.length
			  }
			for (top_counter = 0; top_counter < top; top_counter++) {
        this_report += String(top_empty_users[top_counter]).replace(/:.*/,"") + ":" + msgs[top_empty_users[top_counter]] + "\n";
			  }
			this_report += "==============================\n";
			this_report += "Report for Top "+top+" Character Count\n";
			if (top > top_characters_users.length) {
				top = top_characters_users.length
			  }
			for (top_counter = 0; top_counter < top; top_counter++) {
        this_report += String(top_characters_users[top_counter]).replace(/:.*/,"") + ":" + msgs[top_characters_users[top_counter]] + "\n";
			  }
			this_report += "==============================\n";
  		}
		else {
			this_user = args.user_report_this_user;
			this_user = this_user.toLowerCase();
			if (msgs[this_user+":no_messages"] == undefined) {
				this_report = "==============================\n";
				this_report += "User "+this_user+" not found\n";
				this_report += "==============================\n";
			  }
			else {
			  this_first_seen_datetime_string = "N/A"
			  this_last_seen_datetime_string = "N/A"
			  if (msgs[this_user+":first_seen"] != undefined) {
			    this_datetime = new Date(msgs[this_user+":first_seen"])
			    this_first_seen_datetime_string = this_datetime.getFullYear()+"/"+(this_datetime.getMonth()+1)+"/"+this_datetime.getDate()+" "+this_datetime.getHours()+":"+this_datetime.getMinutes()
			    }
			  if (msgs[this_user+":last_seen"] != undefined) {
			    this_datetime = new Date(msgs[this_user+":last_seen"])
			    this_last_seen_datetime_string = this_datetime.getFullYear()+"/"+(this_datetime.getMonth()+1)+"/"+this_datetime.getDate()+" "+this_datetime.getHours()+":"+this_datetime.getMinutes()
			    }
			  this_report = "==============================\n"
			  this_report += "Report for "+this_user+"\n";
			  this_report += "User first seen:  "+this_first_seen_datetime_string+"\n";
			  this_report += "User last seen:  "+this_last_seen_datetime_string+"\n";
			  this_report += "Total Number of Messages: "+msgs[this_user+":no_messages"]+"\n";
			  this_report += "Total Number of Empty Messages: "+msgs[this_user+":no_empty_messages"]+"\n";
			  this_report += "Total Number of Characters: "+msgs[this_user+":no_total_characters"]+"\n";
			  this_report += "==============================\n";
		    }
			}
		args.send(this_report);
	},
	name: "userreport",
};
