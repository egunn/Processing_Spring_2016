//What happened to category colors??
//Why do company particles return to the right size after mouseOver, and investor particles do not??

var table;
//input all companies as properties in the aggregated object 
var aggregated = {};
var aggregatedInvestors = {};
var connections = [];
var uniqueInvestors = [];
var allConnections =[];
var selectedInvestor;
var clicked = {};
var companyToDisplay = null;
var button;
var mouseListener = false;

//callback function that forces processing to wait until file loads before running rest of code.
function preload() {
    table = loadTable("data/investments_clean.csv", "csv", "header");
    ralewayReg = loadFont('/fonts/raleway-regular.ttf');  
    ralewayMed = loadFont('/fonts/raleway-medium.ttf');  
}

var companySystem = [];
var investorSystem = [];
var attractors = [];


//***************************************************************
//SETUP
//***************************************************************

//runs once, at page load.
function setup() {
    
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth, windowHeight);
    var width = windowWidth;
    var height = windowHeight;

    //change refresh rate to 30 frames/second
    frameRate(30);

    background(245);

    //hue(0-360) saturation(0-100) brightness transparency
    colorMode(HSB, 360, 100, 100, 1);

    //create attractor 
    var at = new Attractor(createVector(width / 2, height / 2), 1);

    attractors.push(at);

    //for each row in table, grab name of company and amount in USD.
    //Look for company inside object file. If it exists, add USD to amount that was there.
    for (var r = 0; r < table.getRowCount(); r++) {
        var cname = table.getString(r, "company_name");
        var invested = table.getString(r, "amount_usd");
        var iname = table.getString(r, "investor_name");
        //console.log(iname);

        //convert string to integer to check for empty columns. Store in variable. 
        invested = parseInt(invested);

        //if it can't convert, returns NaN
        if (!isNaN(invested)) {
            //if it has a property with cname (eg Facebook) 
            //Object key is company name
            if (aggregated.hasOwnProperty(cname)) {
                //add invested amount to value
                aggregated[cname] += invested;

            } else {
                //otherwise, add a new property with the invested amount
                //have to use aggregated[] format b/c cname has spaces in it
                //can't do aggregated.Google Inc w/ a space
                aggregated[cname] = invested;
            }

            if (aggregatedInvestors.hasOwnProperty(iname)) {
                //add invested amount to value
                aggregatedInvestors[iname] += invested;

            } else {
                //otherwise, add a new property with the invested amount
                //have to use aggregated[] format b/c cname has spaces in it
                //can't do aggregated.Google Inc w/ a space
                aggregatedInvestors[iname] = invested;
            }

        }

    }

    //console.log(aggregatedInvestors);  //all companies and sums, all investors and amounts (not associated by name)

    //create an empty array
    var aAggregated = [];

    //Object is the master of all objects in JS 
    //get an array of all the properties in the object - gives a list of all 
    //the keys in the object. In this case, that's all the company names.
    //For each company, 
    Object.keys(aggregated).forEach(function (key) {
        //create a new object entry
        var company = {};

        //store name and sum here 
        company.name = key;
        company.sum = aggregated[key]
        aAggregated.push(company);
    });

    //console.log(aAggregated); //all companies, with sums 

    var aAggregatedInvestors = [];
    Object.keys(aggregatedInvestors).forEach(function (key) {
        //create a new object called entry
        var investor = {};

        //store name and sum here 
        investor.name = key;
        investor.amount = aggregatedInvestors[key];
        aAggregatedInvestors.push(investor);
    });

    //console.log(aAggregatedInvestors); //all investors, with total amount invested 

    //sort function on the array, anonymous fxn looks at each pair
    aAggregated = aAggregated.sort(function (companyA, companyB) {
        //sorts in descending order
        return companyB.sum - companyA.sum;
    })

    //save top 200 companies
    aAggregated = aAggregated.slice(0, 50); //return to 200 when done debugging




    //go through tables for those 200 companies, and save connection {} for each one that stores
    //company, investor, amount, and data. 

    //does company in this row of the table exist in the aAggregated array? 
    for (var r = 0; r < table.getRowCount(); r++) {
        //store company name from table
        var compname = table.getString(r, "company_name");
        var invested = table.getString(r, "amount_usd");
        var investName = table.getString(r, "investor_name");
        
        var tempConn = {investor:{}, company:{}, amount:0};

        //use find function on the aAggregated array. Find function runs an anonymous 
        //function that we define. Anonymous function needs an element, and index, and an array. Element 
        //is the thing we hand it, it creates an index to keep track of where the element is in the 
        //array, and the array is the aAggregated array that you are passing in. 

        //Compares element given to companyname stored from table. If same, returns true. If not, 
        //returns false (to aAggregated.find). aAggregated.find gives back what we were trying to 
        //find: the company name we were checking for
        var foundCompany = aAggregated.find(function (element, index, array) { 
            
            if (element.name == compname) {
                //make a new company particle, and store it in tempConn
                tempConn.company = new Company(element.name, element.sum);

                //check whether it's already in companySystem
                var inSystem = companySystem.find(function(element, index, array){
                    if (element.name == compname){
                        return true;
                    }
                    else{
                        return false;
                    }
                });
                
                if (!inSystem) {
                    companySystem.push(tempConn.company);
                }
                
                return true;
            } 
            //if it's not already in aAggregated, 
            else {
                return false;
            }
        });


        if (foundCompany) {
            var foundInvestor = aAggregatedInvestors.find(function (element, index, array) {
                if (element.name == investName) {
                    tempConn.investor = new Investor(element.name, element.amount);
                     
                    return true;
                } else {
                    return false;
                }
            });

            if (foundInvestor) {
                tempConn.amount = table.getString(r, "amount_usd");
                conn = new Connection(tempConn);
                connections.push(conn);
            }

        }

    }

    //console.log(connections); //amount of _this_ investment, company name and sum of investments, investor name and total invested

    //go through connections array and extract unique investors to an array. 
    //If company is not yet in the array, add it.
    connections.forEach(function (d) {

        var invName = d.investor.name;
        
        var found = uniqueInvestors.find(function (uniqueInvestor) {
            return uniqueInvestor.name == invName;
        });

        if (!found) {
            uniqueInvestors.push(d.investor);
        }
    });


    //console.log(uniqueInvestors[0]);
    //sort function on the array, anonymous fxn looks at each pair
    uniqueInvestors = uniqueInvestors.sort(function (investorA, investorB) {
        //sorts in descending order
        return investorB.sum - investorA.sum;
    })


    //save top 200 investors
    investorSystem = uniqueInvestors.slice(0, 200); //return to 200 when done debugging
    

/*
    //create company particles
    for (var i = 0; i < aAggregated.length; i++) {
        //has to be less than the length of aAggregated - increase back to 100 when done debugging
        //console.log(aAggregated[i]);
        var c = new Company(aAggregated[i].name, aAggregated[i].sum);
        companySystem.push(c);
    }  
    */
    /*
    //set up unique investors array
    for (var i = 0; i < uniqueInvestors.length; i++) {
        //calculate x and y positions to place all unique investors in a ring around the force layout.
       // var angle = i * TWO_PI / uniqueInvestors.length;
       // var investorRadius = 190;
        var pos = createVector( width / 2, height / 2);
        //****************
        //check scaling and sort!! find max/min, map to paricle size for investors
        //var size = map(uniqueInvestors[i].amount, , 600,000,000,3,50);

        //create investor particles + push to storage array
        var p = new Investor(uniqueInvestors[i].name, uniqueInvestors[i].amount, pos);
        investorSystem.push(p);

    }*/
    
    investorSystem.sort(function (a, b) {
        return a.radius - b.radius;
    });
    
    var angle = 0;
    var investorRadius = 155;
    
    investorSystem.forEach(function(p, i){
        angle += TWO_PI/360 * p.radius*.7;
        //var angle = i * TWO_PI / investorSystem.length;
        investorRadius += (p.radius)*.055;
        var pos = createVector((investorRadius + p.radius) * Math.sin(angle) + width / 2, (investorRadius+p.radius) * Math.cos(angle) + height / 2);
      
       
        p.pos = pos;
        
    });
    
}


//***************************************************************
//DRAW
//***************************************************************


function draw() {

    background(245);
    
    //console.log(mouseListener);
    
    //if (!mouseListener){
        
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
    //}

    
    //if (mouseListener){
        /*fill(360, 0, 70, 1);
        textSize(18);
        text('Investments for ' + companyToDisplay.name, 50, 80); */

   // }
    
    // console.log(investorSystem);

    
    //if the mouse is clicked to select a single company, draw back button 
    //and relevant investors/connections
/*    if (mouseListener == true) {
        /*
        if (mouseX > width / 2 - 25 && mouseX < width / 2 + 25 && mouseY < height - 48 &&
        mouseY > height - 76){
            //draw highlighted back button
            fill(360, 0, 40, .9);
            rect(width / 2 - 25, height - 72, 50, 24, 8);
            fill(360, 0, 70, 1);
            textSize(12);
            textAlign(CENTER);
            text('back', width / 2, height - 56);
        }
        else {
            //draw back button
            fill(360, 0, 40, .7);
            rect(width / 2 - 25, height - 72, 50, 24, 8);
            fill(360, 0, 70, 1);
            textSize(12);
            textAlign(CENTER);
            text('back', width / 2, height - 56);
        }


        //go through the connections array, and find the company selected.
        //Compile all of the investors for that company, and store them to a companyInvestors array
        //Has a company object with company name and total invested, an investor object with 
        //investor name and x and y (in circle), and an amount for the individual investment.
        //Does not (yet) have an x and y for the company circle!!
        //Want to find which investors relate to the current company, and then turn their circles
        //teal and scale relative to the size of the investment.


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
    
   // else { //if mouselistener = false

          //}
        /*allConnections.forEach(function (e){
            e.drawConnections();
        })*/

        // console.log(investorSystem);

        //draw all of the investors in the investors system, using the positions stored in each object
        investorSystem.forEach(function (e) {
            e.drawInvestors();
            e.updateInvestors();
        })
        
        if (selectedInvestor){
            
            selectedInvestor.updateInvestors();
        }


  //  }


    if (companyToDisplay != null) {
                    
        companyToDisplay.hue = 60;
        

        companyToDisplay.drawCompanies();
        companyToDisplay.updateCompanies();

    } else {

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


        for (var i = companySystem.length - 1; i >= 0; i--) {
            //grab one particle from the system
            var p = companySystem[i];

            p.drawCompanies();
            p.updateCompanies();

        }

    }

}




function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


//***************************************************************
//Particle
//***************************************************************

//Contains methods and static properties shared among all particles in 
//the code

//literal notation - defines an object, not a function
//can't use "this" or console.log inside of a JSON!
var Particle = {
    
    //inside a function in an object, can use this, console.
    drawParticles: function (pp) {
        noStroke();

        //draw the particle itself (better to do this after the line, so that the particle draws on top)
        //print(pp.constructor.name);
    
        ellipse(this.pos.x
            , this.pos.y
            , this.radius * 2
            , this.radius * 2);
    },
    
    updateParticles: function () {

    }

}



//***************************************************************
//Company
//***************************************************************

//Contains methods and properties unique to Companies, calls
//Particle for general methods. Needs to create any object properties
//that Particle will need to implement its methods (available through
//this.property)

var Company = function (n, s) {

    //set properties of Company object
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.name = n;
    this.sum = s;

    //set particle radius
    this.radius = sqrt(s) / 4000;
    this.defaultRadius = this.radius;

    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng), sin(tempAng));

    this.pos.div(this.radius);
    this.pos.mult(1000);
    this.pos.set(this.pos.x + width / 2, this.pos.y + height / 2);

    var acceleration = createVector(0, 0);

    this.hue = 310;//100;

    this.drawCompanies = function () {
        if(!mouseListener){
            //set fill color for company bubble
            fill(this.hue, 100, 85, .8); //90
            
            //call prototype function for shared features
            this.drawParticles(this);
        }
        else if(mouseListener){  //(if on the "back" screen)
            
            //eliminate transparency, set constant radius, and make text white
            fill(this.hue, 90, 85, 1); //85
            //this.radius = 55; //(maxRadius value)  
            this.drawParticles(this);
            
            //draw label
            fill(255);
                textSize(14);
                textAlign(CENTER);
                if (textWidth(this.name) < 2 * 55 - 10) {
                    text(this.name, this.pos.x, this.pos.y + 5);

                } 
                else {
                    twoLines = split(this.name, " ");
                    text(twoLines[0], this.pos.x, this.pos.y - 3);
                    text(twoLines[1], this.pos.x, this.pos.y + 11);
                }
       
        }
       
    }

    
    this.updateCompanies = function () {    

        //this.draw is a public function; checkMouse is a private function. 
        //With something that uses this, it "knows" it's inside a particle 
        //instance. Private functions do not have a context for where they 
        //are - don't know what "this" is. When it is called, pass it 
        //"this": checkMouse(this);

        function checkMouse(instance) {
            var mousePos = createVector(mouseX, mouseY);

            if (mousePos.dist(instance.pos) <= instance.radius) {
                incRadius(instance);
                instance.hue = 340;//60;
                isMouseOver = true;
            } 
            
            else {
                //if (!mouseListener) {
                    instance.hue = 270;//130;
                    isMouseOver = false;
                    if (instance.radius - instance.defaultRadius > 4) {
                        instance.radius -= 4;
                    }
                    else if (instance.radius - instance.defaultRadius < 4 && instance.radius - instance.defaultRadius > 1) {
                        instance.radius -= 1;
                    }
                    else {
                        instance.radius = instance.defaultRadius;
                    }
                    
               // }

           }

        }       
        
        
        var maximumRadius = 57;

        function incRadius(instance) {
            instance.radius += 4;
            if (instance.radius > maximumRadius) {
                instance.radius = maximumRadius;
                fill(255);
                textFont(ralewayMed);
                textSize(14);
                textAlign(CENTER);
                if (textWidth(instance.name) < 2 * maximumRadius - 10) {
                    text(instance.name, instance.pos.x, instance.pos.y - 2);
                    if(instance.sum){                    
                        textSize(11);
                        textAlign(CENTER);
                        text("$" + nfc(instance.sum,0), instance.pos.x, instance.pos.y + 14);
                    }
                } else {
                    twoLines = split(instance.name, " ");
                    text(twoLines[0], instance.pos.x, instance.pos.y - 13);
                    text(twoLines[1], instance.pos.x, instance.pos.y + 2);
                    textSize(11);
                    textAlign(CENTER);
                    text("$" + nfc(instance.sum,0), instance.pos.x, instance.pos.y + 17);
                }

            }

        }
        
        //if (!mouseListener) {checkMouse(this)};
        checkMouse(this);
    
        //go through attractor array and update Company particles accordingly
        attractors.forEach(function (A) {
            //create a new vector att that points from the particle to the attractor. Using
            //a.pos.sub(position) doesn't work, because it changes the position vector of A itself
            //console.log(A.getPos());
            var att = p5.Vector.sub(A.getPos(), this.pos);
            //scale the new vector according to the distance^2. 
            var distanceSq = att.magSq();
            //don't need to calc the distance itself; use the magnitude squared b/c less 
            //computationally intensive to use the non-sqrt function.
            if (distanceSq > 1) {
                //multiply by the size to attract based on particle size 
                //att.div(distanceSq*pSize);
                att.normalize();
                att.div(10);
                //multiply or divide depending on the result of the distance calc. 
                //Threshold at 1 so that particles don't accelerate to infinity
                att.mult(1 * A.getStrength());
                //add this vector to the particle acceleration
                //att.mult(this.radius*this.radius/10);
                this.accel.add(att);
            }
            //tell it who "this" is - want it to be the object that it is inside (particle), 
            //rather than the one that was input (attractor)    
        }, this);
        
        
        this.updateParticles();

        //update the velocity and position vectors  
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);

    // if (mouseListener) {
    //        this.vel.mult(0.9);
    //    }
        
        

    }

}

//Assigns Particle as a prototype of Company
Company.prototype = Particle;


//***************************************************************
//Investors
//***************************************************************

var Investor = function (n, s) {
    this.name = n;
    this.sum = s;
    this.pos = createVector(0, 0);
    this.radius = sqrt(this.sum) / 6000;
    this.defaultRadius = this.radius;

    this.drawInvestors = function () {
        //fill(190,100,90,.7);
        fill(169, 100, 60, .95);

        //call prototype function for shared features
        this.drawParticles(this);
    }
    
    this.updateInvestors = function() {
      
        function checkMouse(instance) {
            var mousePos = createVector(mouseX, mouseY);
            
            //if(!mouseListener) {

                if (mousePos.dist(instance.pos) <= instance.defaultRadius) {
                    incRadius(instance);
                    //instance.hue = 60;
                    isMouseOver = true;
                    selectedInvestor = instance;
                    
                    connections.forEach(function(d,i){
                        var connectIndex = i;
                        //console.log(selectedInvestor.name);
                        if (d.investor.name == selectedInvestor.name){
                            
                            var tempCompany = d.company;
                            d.investor.pos = selectedInvestor.pos;
                            
                            companySystem.forEach(function(d){
                                //console.log(tempCompany);
                                if (d.name == tempCompany.name){
                                    connections[i].company.pos = d.pos;
                                    d.hue = 340;
                                };
                            })
                            
                            d.drawConnections();
                        };
                    })    
                } 

                else {
                    instance.hue = 130;
                    isMouseOver = false;
                    if (instance.radius - instance.defaultRadius > 4) {
                        instance.radius -= 4;
                    }
                    else if (instance.radius - instance.defaultRadius < 4 && instance.radius - instance.defaultRadius > 1) {
                        instance.radius -= 1;
                    }
                    else {
                        instance.radius = instance.defaultRadius;
                    }
                }

            //} 
            /*
            else if (mouseListener) {
                instance.drawInvestorLabels();
            }*/
        
            
        }
        
        var maximumRadius = 55;

        function incRadius(instance) {
            instance.radius += 4;
            if (instance.radius > maximumRadius) {
                instance.radius = maximumRadius;
                fill(255);
                textFont(ralewayMed);
                textSize(14);
                textAlign(CENTER);
                instance.drawInvestorLabels();
            }

        }
        
        checkMouse(this);
        
    }

    this.drawInvestorLabels = function () {
        
        var maximumRadius = 55;
        
        //on "back" screen, show labels by default
       // if (mouseListener){

          /*  noStroke();
            fill(55);
            textSize(12);
            textAlign(CENTER);
            //position text above the investor circles
            text(this.name, this.pos.x, this.pos.y - this.radius - 5);*/
       // }
        
        //if (!mouseListener){
            //console.log('here');
            if (textWidth(this.name) < 2 * maximumRadius - 10) {
                text(this.name, this.pos.x, this.pos.y -2);
                textSize(11);
                textAlign(CENTER);
                text("$" + nfc(this.sum,0), this.pos.x, this.pos.y + 14);
            } 
            else {
                twoLines = split(this.name, " ");
                text(twoLines[0], this.pos.x, this.pos.y - 13);
                text(twoLines[1], this.pos.x, this.pos.y + 2); 
                textSize(11);
                textAlign(CENTER);
                text("$" + nfc(this.sum,0), this.pos.x, this.pos.y + 18)
            }

            
        //}

    }
}

Investor.prototype = Particle;


//***************************************************************
//Investments
//***************************************************************

var Investment = function(connection){
    this.size = 5;
    //this.frequency = this.
}

//***************************************************************
//ATTRACTOR
//***************************************************************

var Attractor = function (pos, s) {
    var pos = pos.copy();
    var strength = s;

    this.draw = function () {
        noStroke();
        fill(0, 100, 100);
        ellipse(pos.x, pos.y, strength, strength);
    }   

    this.getStrength = function () {
        return strength;
    }

    this.getPos = function () {
        return pos.copy();
    }
}


//***************************************************************
//Connection
//***************************************************************

var Connection = function (conn) {
    this.color = (68);
    this.investor = conn.investor;
    this.company = conn.company;
    this.amount = conn.amount;

    this.drawConnections = function () {    
        stroke(this.color);
        strokeWeight(.5);
        line(this.investor.pos.x, this.investor.pos.y, this.company.pos.x, this.company.pos.y);
    }

}


//***************************************************************
//Mouse Clicked
//***************************************************************

function mouseClicked() {

    if (mouseListener == false) {
        for (var i = 0; i < companySystem.length; i++) {
            var particle = companySystem[i];
            var mouseVec = createVector(mouseX, mouseY);
            var particleVec = particle.pos.copy();

            var vecPtoPoint = particleVec.sub(mouseVec); //p5.Vector.sub(point, particle);
            if (vecPtoPoint.magSq() < sq(particle.radius)) {
                //click // activate
                companyToDisplay = particle;
                investorsToDisplay = [];
                mouseListener = true;
                break;
            } else {
                investorsToDisplay = [];
                mouseListener = false;
            }
        }


    }

/*
    if (mouseListener == true && mouseX > width / 2 - 25 && mouseX < width / 2 + 25 && mouseY < height - 48 &&
        mouseY > height - 76) {

        companyToDisplay = null;
        mouseListener = false;
        investorsToDisplay = [];
    }*/


}