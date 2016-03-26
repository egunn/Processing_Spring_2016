//What happened to category colors??
//Why do company particles return to the right size after mouseOver, and investor particles do not??


var table;
//input all companies as properties in the aggregated object 
var aggregated = {};
var aggregatedInvestors = {};
var connections = [];
var uniqueInvestors = [];
var clicked = {};
var companyToDisplay = null;
var button;
var mouseListener = false;

//callback function that forces processing to wait until file loads before running rest of code.
function preload(){
    table=loadTable("data/investments_clean.csv","csv","header");
}

var companySystem = [];
var investorSystem =[];
var attractors = [];


//***************************************************************
//SETUP
//***************************************************************

//runs once, at page load.
function setup() {
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth,windowHeight-125);
    var width = windowWidth;
    var height = windowHeight-125;
    
    //change refresh rate to 30 frames/second
    frameRate(30);
    
    background(0);
   
    //hue(0-360) saturation(0-100) brightness transparency
    colorMode(HSB,360,100,100,1);
    
    //create attractor 
    var at = new Attractor(createVector(width/2,height/2),1);
    
    attractors.push(at);
    
    //for each row in table, grab name of company and amount in USD.
    //Look for company inside object file. If it exists, add USD to amount that was there.
    for (var r=0;r<table.getRowCount();r++){
        var cname = table.getString(r,"company_name");
        var invested = table.getString(r,"amount_usd");
        var iname = table.getString(r,"investor_name");
        //console.log(iname);
        
        //convert string to integer to check for empty columns. Store in variable. 
        invested = parseInt(invested);

        //if it can't convert, returns NaN
        if(!isNaN(invested)){
            //if it has a property with cname (eg Facebook) 
            //Object key is company name
            if(aggregated.hasOwnProperty(cname)){
                //add invested amount to value
                aggregated[cname]+=invested;
                
            }
            else {
                //otherwise, add a new property with the invested amount
                //have to use aggregated[] format b/c cname has spaces in it
                //can't do aggregated.Google Inc w/ a space
                aggregated[cname] = invested;
            }
            
            if(aggregatedInvestors.hasOwnProperty(iname)){
                //add invested amount to value
                aggregatedInvestors[iname]+=invested;
                
            }
            else {
                //otherwise, add a new property with the invested amount
                //have to use aggregated[] format b/c cname has spaces in it
                //can't do aggregated.Google Inc w/ a space
                aggregatedInvestors[iname] = invested;
            }
                  
        }   
         
    }
    
    //console.log(aggregatedInvestors);  //all companies and sums, all investors and amounts (not associated by name)
    
    //create an empty array
    var aAggregated =[];
    
    //Object is the master of all objects in JS 
    //get an array of all the properties in the object - gives a list of all 
    //the keys in the object. In this case, that's all the company names.
    //For each company, 
    Object.keys(aggregated).forEach(function(key){
        //create a new object entry
        var company = {};
        
        //store name and sum here 
        company.name = key;
        company.sum = aggregated[key]
        aAggregated.push(company);
    });
    
    //console.log(aAggregated); //all companies, with sums 
    
    var aAggregatedInvestors = [];
    Object.keys(aggregatedInvestors).forEach(function(key){
        //create a new object called entry
        var investor = {};
        
        //store name and sum here 
        investor.name = key;
        investor.amount = aggregatedInvestors[key];
        aAggregatedInvestors.push(investor);
    });

    //console.log(aAggregatedInvestors); //all investors, with total amount invested 
    
    //sort function on the array, anonymous fxn looks at each pair
    aAggregated = aAggregated.sort(function(companyA,companyB){
        //sorts in descending order
        return companyB.sum - companyA.sum;
    })
    
    //save top 200 companies
    aAggregated = aAggregated.slice(0,50); //return to 200 when done debugging

    
    
    
    //go through tables for those 200 companies, and save connection {} for each one that stores
    //company, investor, amount, and data. 
    
    //does company in this row of the table exist in the aAggregated array? 
    for (var r=0;r<table.getRowCount();r++){
        //store company name from table
        var compname = table.getString(r,"company_name");
        var invested = table.getString(r,"amount_usd");
        var investName = table.getString(r,"investor_name");
        
        //use find function on the aAggregated array. Find function runs an anonymous 
        //function that we define. Anonymous function needs an element, and index, and an array. Element 
        //is the thing we hand it, it creates an index to keep track of where the element is in the 
        //array, and the array is the aAggregated array that you are passing in. 
        
        var foundCompany = aAggregated.find(function(element, index, array){
            //Compares element given to companyname stored from table. If same, returns true. If not, 
            //returns false (to aAggregated.find). aAggregated.find gives back what we were trying to 
            //find: the company name we were checking for
            if(element.name == compname) {return true;}
            else {return false;}
        });
                

        if(foundCompany){
            var foundInvestor = aAggregatedInvestors.find(function(element, index, array){
               if(element.name == investName) {return true;}
               else {return false;}
            });
            
            if(foundInvestor){
                //make a new connection object
                var connection = {};
                //and store the company in the connection object.
                connection.company = foundCompany;
                connection.investor = foundInvestor;
                connection.amount = table.getString(r,"amount_usd");
                connections.push(connection);
            }
            
        }
        
    }

    //console.log(connections); //amount of _this_ investment, company name and sum of investments, investor name and total invested
    
    
    //go through connections array and extract unique investors to an array. 
    //If company is not yet in the array, add it.
    connections.forEach(function(d)  {
        var found = uniqueInvestors.find(function(uniqueInvestor){
            return uniqueInvestor == d.investor;});
           
        if (!found){ 
            uniqueInvestors.push(d.investor);
            
        }
    });
    
 
    //sort function on the array, anonymous fxn looks at each pair
    uniqueInvestors = uniqueInvestors.sort(function(investorA,investorB){
        //sorts in descending order
        return investorB.sum - investorA.sum;
    })

            
    //save top 200 investors
    uniqueInvestors = uniqueInvestors.slice(0,200); //return to 200 when done debugging
    
    
    //create company particles
    for(var i=0;i<aAggregated.length;i++){ 
        //has to be less than the length of aAggregated - increase back to 100 when done debugging
        //console.log(aAggregated[i]);
        var c = new Company(aAggregated[i].name,aAggregated[i].sum);
        companySystem.push(c);
    }
    
    console.log(uniqueInvestors);
    
    //set up unique investors array
    for(var i=0; i<uniqueInvestors.length;i++){
        //calculate x and y positions to place all unique investors in a ring around the force layout.
        var angle = i*360/uniqueInvestors.length;
        var investorRadius = 190;
        var pos = createVector(investorRadius*Math.sin(angle)+width/2,investorRadius*Math.cos(angle)+height/2);   
//****************
//check scaling and sort!! find max/min, map to paricle size for investors
        //var size = map(uniqueInvestors[i].amount, , 600,000,000,3,50);
        
        //create investor particles + push to storage array
        var p = new Investor(uniqueInvestors[i].name, uniqueInvestors[i].amount, pos);
        investorSystem.push(p);
        
    } 
    
}


//***************************************************************
//DRAW
//***************************************************************


function draw() {

    background(0);
    
    //if the mouse is clicked to select a single company, draw back button 
    //and relevant investors/connections
    if(mouseListener ==true) {
        
        //draw back button
        fill(360,0,40,.7);
        rect(width/2-25,height-52,50,24,8);
        fill(360,0,70,1);
        textSize(12);
        textAlign(CENTER);
        text('back',width/2,height-36);
                          
    
        //go through the connections array, and find the company selected.
        //Compile all of the investors for that company, and store them to a companyInvestors array
        //Has a company object with company name and total invested, an investor object with 
        //investor name and x and y (in circle), and an amount for the individual investment.
        //Does not (yet) have an x and y for the company circle!!
        //Want to find which investors relate to the current company, and then turn their circles
        //teal and scale relative to the size of the investment.
                
        
        //console.log(connections);
        
        //Create a list of investors and connections to display
        investorsList=[];
        connectionsToDisplay=[];

        
        for (var i = 0; i<connections.length; i++){
            
            var tempParticle;
                  
            //check whether the investor is in the list
            if (connections[i].company.name == companyToDisplay.name){
                    
                investorObject = connections[i];
                var investorInList = investorsList.find(function(investorObject){
                    return investorsList == investorObject.investor;
                });

                //if the investor isn't in the list
                if(!investorInList){

                    //find the corresponding particle in the investorSystem array
                    for(var j=0; j<investorSystem.length; j++){

                        //console.log(investorObject.investor.name);
                        //console.log(investorSystem[j].name);
                        if(investorObject.investor.name == investorSystem[j].name){
                            tempParticle = investorSystem[j];
                            
                                                
                            //make a Connection object containing the company and investor particles, and the amount of this investment
                            var conn = new Connection({company: companyToDisplay, amount:connections[i].amount, investor:tempParticle});
                            connectionsToDisplay.push(conn);
                        }
                    }
                        
                }

            }


        }

        
        connectionsToDisplay.forEach(function(e){
            e.drawConnections();
        })
                
    
        //And draw them
        connectionsToDisplay.forEach(function(e){
            e.investor.drawInvestors();
            e.investor.updateParticles();
        })

        }

     
    else{
    
        //draw all of the investors in the investors system, using the positions stored in each object
        investorSystem.forEach(function(e){
            e.drawInvestors();
            e.updateParticles();
        })
            
           
    }  

    
    if (companyToDisplay != null){
        
        companyToDisplay.drawCompanies();
        companyToDisplay.updateCompanies();
            
    }
    
    else {

        //run collision minimization 3x before giving me the results
        for(var STEPS = 0; STEPS < 4; STEPS++) {
            

            //pairwise comparison - save unique pair  particle a and b to compare to see if they are    
            //intersecting. If so, adjust by precise amount needed to remove overlap.
            for(var i=0;i<companySystem.length-1;i++){
                for(var j=i+1;j<companySystem.length;j++){
                    

                    var pa = companySystem[i];
                    var pb = companySystem[j];

                    var ab= p5.Vector.sub(pb.pos,pa.pos);
                    //distSq
                    var distSq = ab.magSq();

                    //since working with distance squared, also square the sum (faster than taking sqrt)
                    //if particles intersect
                    if(distSq <=sq(pa.radius+pb.radius)){
                        var dist = sqrt(distSq);
                        //calculate the overlap distance
                        var overlap = (pa.radius+pb.radius)-dist;
                        //normalize the ab vector
                        ab.div(dist);
                        //scale it by the overlap distance
                        ab.mult(overlap*0.5);
                        //add the ab vector to the position of particle b
                        pb.pos.add(ab);
                        //reverse the direction of the ab vector
                        ab.mult(-1);
                        //add it to the position of particle a
                        pa.pos.add(ab);

                        //"dumping" velocity - add friction when there are collisions. If overlapping,
                        //don't move as fast. Replaces limit function, which is computationally
                        //expensive
                        pa.vel.mult(0.97);
                        pb.vel.mult(0.97);
                    }
                }
            }
        }
    
   
        for(var i = companySystem.length-1; i>=0; i--) {
            //grab one particle from the system
            var p = companySystem[i];

            p.drawCompanies();
            p.updateCompanies();

        }  
        
    } 
    
    attractors.forEach(function(at) {
        at.draw();
    });
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
    drawParticles: function(){
        noStroke();
        
        //draw the particle itself (better to do this after the line, so that the particle draws on top)
        ellipse(this.pos.x,
            this.pos.y,
            this.radius*2,
            this.radius*2);       

    },
    
    updateParticles: function() {
        
        //this.draw is a public function; checkMouse is a private function. 
        //With something that uses this, it "knows" it's inside a particle 
        //instance. Private functions do not have a context for where they 
        //are - don't know what "this" is. When it is called, pass it 
        //"this": checkMouse(this);
        
        function checkMouse(instance) {
            var mousePos = createVector(mouseX,mouseY);
                        
            if(mousePos.dist(instance.pos)<=instance.radius){
                //console.log("mouseOver");
                incRadius(instance);
                instance.hue=60;
                isMouseOver = true;
            }
            else{
                instance.hue=100;
                isMouseOver = false;
                if(instance.radius>instance.defaultRadius){
                    instance.radius-=4;
                }
                
            }
                
        }
        

        var maximumRadius = 55;
        
        function incRadius(instance){
            instance.radius+=4;
            if(instance.radius>maximumRadius){
                instance.radius = maximumRadius;
                fill(255); 
                textSize(14);
                textAlign(CENTER);
                if(textWidth(instance.name)<2*maximumRadius-10){
                    text(instance.name,instance.pos.x,instance.pos.y+5);
                }
                else {
                    twoLines = split(instance.name," ");
                    text(twoLines[0],instance.pos.x,instance.pos.y-3);
                    text(twoLines[1],instance.pos.x,instance.pos.y+11);
                }
                
            }

        }
      
        checkMouse(this);
        
    }

}

 

//***************************************************************
//Company
//***************************************************************

//Contains methods and properties unique to Companies, calls
//Particle for general methods. Needs to create any object properties
//that Particle will need to implement its methods (available through
//this.property)

var Company = function (n,s) {
    
    //set properties of Company object
    this.vel = createVector(0,0);
    this.accel = createVector(0,0);
    this.name = n;
    this.sum = s;
    
    //set particle radius
    this.radius = sqrt(s)/4000;
    this.defaultRadius = this.radius;
        
    var tempAng = random(TWO_PI);
    this.pos = createVector(cos(tempAng),sin(tempAng));
    
    this.pos.div(this.radius);
    this.pos.mult(1000);
    this.pos.set(this.pos.x + width/2, this.pos.y + height/2);

    var acceleration = createVector(0,0);
    
    this.hue = 100;
      
    this.drawCompanies = function(){
        //add company-specific draw features here
        fill(this.hue,90,100,0.8); 

        //call prototype function for shared features
        this.drawParticles();
    }
    
    this.updateCompanies = function(){
        
        //*******Need to separate Companies and Investors here!!
        //go through attractor array and update Company particles accordingly
        attractors.forEach(function(A){
            //create a new vector att that points from the particle to the attractor. Using
            //a.pos.sub(position) doesn't work, because it changes the position vector of A itself
            //console.log(A.getPos());
            var att = p5.Vector.sub(A.getPos(),this.pos);
            //scale the new vector according to the distance^2. 
            var distanceSq = att.magSq();
            //don't need to calc the distance itself; use the magnitude squared b/c less 
            //computationally intensive to use the non-sqrt function.
            if(distanceSq>1){
                //multiply by the size to attract based on particle size 
                //att.div(distanceSq*pSize);
                att.normalize();
                att.div(10);
                //multiply or divide depending on the result of the distance calc. 
                //Threshold at 1 so that particles don't accelerate to infinity
                att.mult(1*A.getStrength());
                //add this vector to the particle acceleration
                //att.mult(this.radius*this.radius/10);
                this.accel.add(att);
            }
        //tell it who "this" is - want it to be the object that it is inside (particle), 
        //rather than the one that was input (attractor)    
        },this);
        
        
        this.updateParticles();
        
        //update the velocity and position vectors  
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        this.accel.mult(0);
        
        if(mouseListener){
            this.vel.mult(0.9);
        }
        
    }
    
}
                                                                     
//Assigns Particle as a prototype of Company
Company.prototype = Particle;


//***************************************************************
//Investors
//***************************************************************

var Investor = function(n, s, pos) {
    this.name = n;
    this.sum = s;
    this.pos = pos;
    this.radius = 5;
    this.defaultRadius = this.radius;
    
    this.drawInvestors = function() {
        fill(190,100,90,.7);
            
        //call prototype function for shared features
        this.drawParticles();
    } 
    
}

Investor.prototype = Particle;


//***************************************************************
//ATTRACTOR
//***************************************************************

var Attractor = function(pos,s){
    var pos = pos.copy();
    var strength = s;
    
    this.draw = function() {
        noStroke();
        fill(0,100,100);
        ellipse(pos.x,pos.y,strength,strength);
    }
    
    this.getStrength = function() {
        return strength;
    }
        
    this.getPos = function() {
        return pos.copy();
    }
}


//***************************************************************
//Connection
//***************************************************************

var Connection = function(conn){
    this.color = (200);
    this.investor = conn.investor;
    this.company = conn.company;
    this.amount = conn.amount;
       
    this.drawConnections = function() {
        //console.log(this);    
        stroke(this.color);
        strokeWeight(.5);
        line(this.investor.pos.x,this.investor.pos.y,this.company.pos.x,this.company.pos.y);
    }
    
}


//***************************************************************
//Mouse Clicked
//***************************************************************

function mouseClicked() {
    
    if(mouseListener == false){
        for(var i=0; i<companySystem.length; i++){
            var particle = companySystem[i];
            var mouseVec = createVector(mouseX,mouseY);
            var particleVec = particle.pos.copy();

            var vecPtoPoint = particleVec.sub(mouseVec);//p5.Vector.sub(point, particle);
            if(vecPtoPoint.magSq() < sq(particle.radius)){
                //click // activate
                companyToDisplay = particle;
                investorsToDisplay = [];
                mouseListener = true;
                break;
            }
            else{
                investorsToDisplay = [];
                mouseListener = false; 
            }
        }
        

    }
    
    
    if(mouseListener == true && mouseX > width/2-25 &&  mouseX < width/2+25  && mouseY < height-28  &&  
       mouseY > height-56){
 
        companyToDisplay = null;
        mouseListener = false;
        investorsToDisplay = [];
    }
    
    
}
