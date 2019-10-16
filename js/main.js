$(document).ready(function(){

    var url;

    if (option == "S"){
        url = "https://api.propublica.org/congress/v1/113/senate/members.json";
    } else {
        url = "https://api.propublica.org/congress/v1/113/house/members.json";
    }
    
    /**
     * GET DATA FROM SERVER
     */

    var settings = {
            method: 'GET',
            headers: new Headers({"X-API-Key": "dL6AYBNMhLmMPnLnznPolusuULMW80Fd99aXpFw7"})
    };
    
    $(function(){
        fetch(url, settings)
        .then(function(response){
                return response.json();
        })
        .then(function(json){
            app.members = json.results[0].members;
            getStatistics(json.results[0].members);
        })
        .catch(function(error){
            if (app.members == undefined){
                console.log("Fail");
            }
        })
    });

    var statisticsData = {
        "democrats": 0,
        "republicans": 0,
        "independients": 0,
        "percentDemVoted": 0,
        "percentRepVoted": 0,
        "percentIndVoted": 0,
        "percentTotalVoted": 0,
        "mostEngaged": [],
        "leastEngaged": [],
        "mostLoyal": [],
        "leastLoyal": []
    }

    function getStatistics(json){
        
        var members = json;

        /**
         * FILLING COUNTING DATA
         */
        var totalMemberVoted = 0;
        for(let i = 0; i < members.length; i++){
            if(members[i].total_votes != 0){
                totalMemberVoted++;
                switch (members[i].party){
                    case "R":
                        statisticsData.republicans++;
                        break;
                    case "D":
                        statisticsData.democrats++;
                        break;
                    case "I":
                        statisticsData.independients++;
                }
            }
        }
        statisticsData.percentRepVoted = ((statisticsData.republicans/members.length)*100).toFixed(2);
        statisticsData.percentDemVoted = ((statisticsData.democrats/members.length)*100).toFixed(2);
        statisticsData.percentIndVoted = ((statisticsData.independients/members.length)*100).toFixed(2);
        statisticsData.percentTotalVoted = ((totalMemberVoted/members.length)*100).toFixed(2);
        /**
         * CRAFTING ARRAYS STATISTICS
         */
        var top10percent = parseInt(members.length*0.10);
        /**
         * SORTING FOR LOYALTY TABLE
         */
        members.sort(
            function(a, b){
                if (a.votes_with_party_pct < b.votes_with_party_pct){
                    return -1;
                }
                if (a.votes_with_party_pct > b.votes_with_party_pct){
                    return 1;
                }
                return 0;
            }
        )
        for (let i = members.length; i > members.length-top10percent; i--) {
            statisticsData.mostLoyal.push(members[i]);
        }
        for (let i = 0; i < top10percent; i++) {
            statisticsData.leastLoyal.push(members[i]);
            
        }
        /**
         * SORTING FOR ATTENDANCE TABLE
         */
        members.sort(
            function(a, b){
                if (a.missed_votes_pct < b.missed_votes_pct){
                    return -1;
                }
                if (a.missed_votes_pct > b.missed_votes_pct){
                    return 1;
                }
                return 0;
            }
        )
        for (let i = members.length; i > members.length-top10percent; i--) {
            statisticsData.leastEngaged.push(members[i]);
        }
        for (let i = 0; i < top10percent; i++) {
            statisticsData.mostEngaged.push(members[i]);
            
        }
        /**
         * SORTING BY FULL NAME
         */
        members.sort(
            function(a, b){
                let nameA = a.first_name + " " + (a.middle_name? a.middle_name + " ": "") + a.last_name;
                let nameB = b.first_name + " " + (b.middle_name? b.middle_name + " ": "") + b.last_name;

                if (nameA < nameB){
                    return -1;
                }
                if (nameA > nameB){
                    return 1;
                }
                return 0;
            }
        )
        console.log(app.statistics.republicans);
    }

    /**
     *  VUE VARIABLE FOR JSON DATA
     */
    const app = new Vue({  
        el: '#app',  
        data: {
            members: [],
            statistics: statisticsData    
        }
    });
});