module.exports = {
	arguments: [{
		description: "list, add \"name of vote\", remove, close <id_of_vote>, clearall",
		key: "action",
		type: "string",
	},{
		description: "",
		key: "vote_id",
		type: "string",
	}],
	describe: "Modifies the Votes being run. ?vote add <Name of Vote> or ?vote list or ?vote remove <Vote ID (not the name)>.",
	handler: args => {
		if (args.settings.get("voting") == undefined) {
			var msgs = new array()
			 msgs['no_votes'] = 0;
			 msgs['votes'] = [];
		  }
			else msgs = args.settings.get("voting")
		switch(args.action) {
			case "add":
			console.log(msgs)
			    msgs['no_votes']++
					this_vote_id = msgs.no_votes
					this_vote = {"id" : this_vote_id , "name" : args.vote_id, "status" : "open" , "time_started" : new Date().getTime() , "voted" : []}
					console.log(msgs)
					msgs['votes'][this_vote_id]=this_vote;
  //        msgs.push(this_vote)
					args.settings.set("voting",msgs);
					this_message = "Vote Created u/Cuediin please vote on the topic of \""+args.vote_id+"\".\n"
					this_message += "Use the command \"?vote cast "+this_vote_id+" <voting option>\""
					args.send(this_message);
			  break;
				case "remove":
	//				args.send("Your vote ID removed.\n");
				  break;
					case "clearall":
					  args.settings.set("voting",{'no_votes':msgs['no_votes']+1,'votes':[]});
					  args.send("All votes removed.");
		//				args.send("Your vote ID removed.\n");
					  break;
					case "close":
		//				args.send("Your vote ID removed.\n");
					  break;
			case "list":
			  if (args.vote_id == undefined) {
			    args.send("ID / Votes / Status / Time Created");
	 					for(var key in msgs['votes']) {
							this_datetime = new Date(msgs['votes'][key]['time_started'])
							this_datetime_string = this_datetime.getFullYear()+"/"+(this_datetime.getMonth()+1)+"/"+this_datetime.getDate()+" "+this_datetime.getHours()+":"+this_datetime.getMinutes()
							args.send(msgs['votes'][key]['id']+" / "+msgs['votes'][key]['name']+" / "+msgs['votes'][key]['status']+" / "+this_datetime_string);
						  }
					}
				else {
					this_moderators = args.settings.get("moderators")
					this_moderators = this_moderators.replace(/^::/,"").replace(/::$/,"")
					this_moderator_array = this_moderators.split("::")
					this_report=""
					for(var key in this_moderator_array) {
						if (msgs['votes'][args.vote_id]['voted'][this_moderator_array[key]] == undefined) {
							this_report+= "u-"+this_moderator_array[key]+" has not \"?vote cast "+args.vote_id+" <voting option>\" for the topic \""+msgs['votes'][args.vote_id]['name']+"\"\n"
						  }
					  }
						args.send(this_report);
				}
	 			break;
			case "cast":
			  vote_cast = 0;
				this_error = "";
			  this_moderator = args.author.toLowerCase();
			  this_vote_id = args.vote_id.replace(/ .*/,"")
				this_vote_text = args.vote_id.replace(/^[0-9]+ /,"")
				this_vote_text = this_vote_text.toLowerCase().charAt(0);
				for(var key in msgs['votes']) {
          if (msgs['votes'][key]['id'] == this_vote_id) {
						if (msgs['votes'][key]['voted'][this_moderator] != undefined ) {
		    			this_error = "You have already voted, piss off!\n"
				      }
				    else	if ( (this_vote_text != "y") && (this_vote_text != "n") ) {
						  this_error = "Please vote using the options of yes or no\n"
					    }
				    else {
              vote_cast = 1
					    msgs['votes'][key]['voted'][this_moderator] = this_vote_text
					    }
						}
				 	 }
				if (vote_cast == 1) {
					 args.settings.set("voting",msgs);
					 args.send("Your vote has been cast.\n");
				   }
				else {
					if (this_error=="") {
						this_error = "Voting ID is not valid, please check your vote ID"
					  }
					this_error += "Problems with your vote please check your syntax.\n"
					args.send(this_error);
				  }
				break;
	 	 default:
		 	 args.send("Please use a correct arguement with the ?vote command\n");
		}
	},
	name: "vote",
};
