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
    
    companies = [];
    
    for (var i=0; i<10; i++){
        var c = new Company();
        companies.push(c);
    }
    
    investors = [];
    
    for (var i=0; i<20; i++){
        //keep here, because Investor doesn't know how many investor particles there are
        var angle = TWO_PI/18
        var radius = 100+i*3;
        pos = createVector(radius*sin(angle*i)+width/2,radius*cos(angle*i)+height/2);
        
        var inv = new Investor(pos, 20+2*i);
        investors.push(inv);
    }
    
    //console.log(investors);
}


//***************************************************************
//DRAW
//***************************************************************


function draw() {

    background(0);
    
    companies.forEach(function(e){
        e.drawCompanies();
    })
    
    investors.forEach(function(e){
        //console.log('draw called');
        e.drawInvestors();
    })
    
}




function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


//***************************************************************
//Particle
//***************************************************************

//Contains methods and properties shared among all particles in 
//the code

//literal notation - defines an object, not a function
//can't use "this" or console.log inside of a JSON!
var Particle = {
    
    //inside a function in an object, can use this, console.
    drawParticles: function(){
        //console.log(this);
        fill(this.color);
        ellipse(this.pos.x,this.pos.y,this.size, this.size);  
    }
}

 

//***************************************************************
//Company
//***************************************************************

//Contains methods and properties unique to Companies, calls
//Particle for general methods. Needs to create any object properties
//that Particle will need to implement its methods (available through
//this.property)

var Company = function () {
        
    this.pos = createVector((Math.random()-.5)*150+width/2,(Math.random()-.5)*150+height/2);
    this.size = 5;
    this.color = 'rgb(0,100,0)';
    
    var p = this;
    
    this.drawCompanies = function(p){
        stroke('rgb(100,220,100)');
        //p.draw();
        this.drawParticles();
    }
}
                                                                     
//Assigns Particle as a prototype of Company
Company.prototype = Particle;


//***************************************************************
//Investors
//***************************************************************

var Investor = function(pos, s) {
    this.size = s;
    this.color = 'rgb(0,0,100)';
    this.pos = pos;

    
    this.drawInvestors = function(p) {
        stroke('rgb(100,100,225)');
        strokeWeight(.5);
        line(width/2,height/2,this.pos.x,this.pos.y);
        noStroke();
        this.drawParticles();
    } 
    
}

Investor.prototype = Particle;

