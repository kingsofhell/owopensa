var teams = [];
var reqCount = 0;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function getSrs(element) {
var team = {name:"", averageSr:"", players: []};
var players = 0;
var averageSr = 0;
element.find("div.player-card-container > div.player-in-game-name").each(function(k,v) { 
var tag = $(v).find("h1").text();
tag = tag.replace("#","-");
var teamHeader = $(v).parent().parent().parent().parent().parent().find(".team-name-header");
var teamName = teamHeader.text()
team.name = teamName;


$.ajax({url:"https://playoverwatch.com/en-us/career/pc/" + tag, dataType: 'html', success: function(data) {
	var srContainer = $(data).find(".masthead-player-progression > .competitive-rank > .u-align-center.h5")[1];
	var player = {"tag": tag, "sr:": null}
	if (srContainer) {
		player.sr = srContainer.innerHTML;
		$(v).find("h1").append(" " + srContainer.innerHTML);		
			if (players == 0) {
				averageSr = srContainer.innerHTML;
				teamHeader.append("<div class='avgsr'>" + averageSr + "</div>")
				$("div.click-container > div.team-label:contains('" + teamName + "')").append("<div class='teamsr'> "+ averageSr +"</div>");
				team.averageSr = averageSr;
				players++
			}
			else {
				var currentAvg = averageSr;
				var multiply = currentAvg*players;
				averageSr = Math.ceil((multiply + parseInt(srContainer.innerHTML))/(players +1));
				//teamHeader.find("div.avgsr").empty();
				//teamHeader.find("div.avgsr").text(newAvg);
				players++;
				teamHeader.find("div.avgsr").empty();
				teamHeader.find("div.avgsr").text(averageSr);
				$("div.click-container > div.team-label:contains('" + teamName + "')").find("div.teamsr").empty()
				$("div.click-container > div.team-label:contains('" + teamName + "')").find("div.teamsr").text(" " + averageSr);
				team.averageSr = averageSr;
				players++
			}

	}
	team.players.push(player);
}, async: true})
})
teams.push(team);
}





$('.click-container').each(function(k,v) { 
	v.click(); 
	sleep(100);
	$('.modal').hide() // closes all active pop ups.
$('.modal-backdrop').remove() // removes the grey overlay.
	
})

$(".expanded-team-modal").each(function(k,v) { getSrs($(v))})



teams.sort(function(a,b) {
	return b.averageSr - a.averageSr;
})


$("body").append("<div id='teamRank'><div id='average'></div><table id='ranks' class='table table-dark'></table></div>");

for (var i = 0; i < teams.length; i++) {
	var team = teams[i];
	var players = "";
	for (var j = 0; j < team.players.length; j++) {
		players += team.players[j].tag.replace("-","#") + " <a href='https://www.overbuff.com/players/pc/" + team.players[j].tag + "?mode=competitive'>" + team.players[j].sr + "</a><br>";
	}
	$("#ranks").append("<tr><td>"+ (parseInt(i)+1) +"</td><td>" + team.name + "</td><td>" + team.averageSr + "</td><td>" + players + "</td>");
}

var numTeams = 0;
var totalsr = 0;
teams.forEach(function(team){ if (team.averageSr) {numTeams++; totalsr += parseInt(team.averageSr)}});
$("#average").text("Average Team SR: " + parseInt(totalsr/numTeams));

var tournament = $("bf-tournament-teams").html()


teams.forEach(function(team){ if (team.averageSr) {numTeams++; totalsr += parseInt(team.averageSr)}});
var tournament = $("bf-tournament-teams").html()

$(tournament).find(".click-container")


$(tournament).find(".click-container").sort(function(a,b ){
	return parseInt($(b).find(".teamsr").text()) -  parseInt($(a).find(".teamsr").text()); 
}).appendTo($("bf-tournament-teams"))

$(".click-container").each(function(k,v) {
	$(v).find("h1").prepend("<div>" + k + "&nbsp;</div>")
})