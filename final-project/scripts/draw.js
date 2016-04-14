//***************************************************************
//DRAW
//***************************************************************


function draw() {

    background(245);
    
    //Draw title and informational text
    noStroke();
    fill(360, 0, 50, 1);
    textSize(32);
    textFont(ralewayReg);
    text('The Investment Spiral', 47, 65); 
    fill(360, 0, 50, 1);
    textSize(14);
    text('A visualization of the top 200 companies', 50, 94);
    text('in the 2013 CrunchBase database', 50, 112);
    text('By Erica Gunn', 50, 136);
    text('NEU 2016', 50, 154);
    textSize(11);
    text('data from www.crunchbase.com', 50, height - 70);
    text('“CrunchBase 2013 Snapshot” extracted 2013-12-12',46, height - 56); 


/*  //Used to be activated when mouse was clicked to make a selection
        //console.log(connections);

        //Create a list of investors and connections to display
        investorsList = [];
        connectionsToDisplay = [];


        for (var i = 0; i < connections.length; i++) {
            
            var tempParticle;

            //check whether the investor is in the list
            if (connections[i].company.name == companyToDisplay.name) {

                investorObject = connections[i];
                var investorInList = investorsList.find(function (investorObject) {
                    return investorsList == investorObject.investor;
                });

                //if the investor isn't in the list
                if (!investorInList) {

                    //find the corresponding particle in the investorSystem array
                    for (var j = 0; j < investorSystem.length; j++) {

                        if (investorObject.investor.name == investorSystem[j].name) {
                            tempParticle = investorSystem[j];


                            //make a Connection object containing the company and investor particles, and the amount of this investment
                            var conn = new Connection({
                                company: companyToDisplay,
                                amount: connections[i].amount,
                                investor: tempParticle
                            });
                            connectionsToDisplay.push(conn);

                        }
                    }

                }

            }


        }
        
        connectionsToDisplay.forEach(function (e) {
            e.drawConnections();
        });


        //draw investors
        connectionsToDisplay.forEach(function (e) {
            e.investor.drawInvestors();
            e.investor.updateInvestors();
        });

    } */
    



  //  }


    /*if (companyToDisplay != null) {
                    
        companyToDisplay.hue = 60;
        

        companyToDisplay.drawCompanies();
        companyToDisplay.updateCompanies();

    } */
   // if (!companyToDisplay) {

        //run collision minimization 3x before giving me the results
        for (var STEPS = 0; STEPS < 4; STEPS++) {


            //pairwise comparison - save unique pair  particle a and b to compare to see if they are    
            //intersecting. If so, adjust by precise amount needed to remove overlap.
            for (var i = 0; i < companySystem.length - 1; i++) {
                for (var j = i + 1; j < companySystem.length; j++) {


                    var pa = companySystem[i];
                    var pb = companySystem[j];

                    var ab = p5.Vector.sub(pb.pos, pa.pos);
                    //distSq
                    var distSq = ab.magSq();

                    //since working with distance squared, also square the sum (faster than taking sqrt)
                    //if particles intersect
                    if (distSq <= sq(pa.radius + pb.radius)) {
                        var dist = sqrt(distSq);
                        //calculate the overlap distance
                        var overlap = (pa.radius + pb.radius) - dist;
                        //normalize the ab vector
                        ab.div(dist);
                        //scale it by the overlap distance
                        ab.mult(overlap * 0.5);
                        //add the ab vector to the position of particle b
                        pb.pos.add(ab);
                        //reverse the direction of the ab vector
                        ab.mult(-1);
                        //add it to the position of particle a
                        pa.pos.add(ab);

                        //damp velocity
                        pa.vel.mult(0.97);
                        pb.vel.mult(0.97);
                    }
                }
            }
        }
        
        selectedCompany = null;

        for (var i = companySystem.length - 1; i >= 0; i--) {
            //grab one particle from the system
            var p = companySystem[i];
            
            p.updateCompanies();
            p.drawCompanies();
            

        }
    
        selectedInvestor = null;
           
        //draw all of the investors in the investors system, using the positions stored in each object
        investorSystem.forEach(function (e) {
            e.updateInvestors();
            e.drawInvestors();
        })
        
        if (selectedInvestor){      
            //selectedInvestor.updateInvestors();
            selectedInvestor.drawInvestors();
            selectedInvestor.drawLabels();
        }
    
        if (selectedCompany){     
            //selectedCompany.updateCompanies();
            selectedCompany.drawCompanies();
            selectedCompany.drawLabels();
        } 

    //}

}




function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}