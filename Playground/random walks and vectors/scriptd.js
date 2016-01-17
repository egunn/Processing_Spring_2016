//declare an empty array to hold the walker(s)
var walkers = [];

//create some variables with which to populate the walkers
var walkerX, walkerY;

//write a function to construct the walker objects
function Walker(x,y){
    //set x and y parameters
    //(use constant value for now; later, update to use input x and y)
    this.x = x;
    this.y = y;
    
    this.display = function() {
        stroke(0);
        //point(this.x,this.y);
        ellipse(this.x,this.y,5,5);
    }
    
    this.randomWalk = function() {
        //console.log('test');
        //choose a random value between -1 and 1 for x and y; this will determine whether the walker steps right, left, or stays put. (Note that this does not work without converting the random number to an int before subtracting - otherwise, it moves consistently down and to the right, with only minor fluctuations!)
        var stepX = int(random(3))-1;
        var stepY = int(random(3))-1;
        this.x += stepX;
        this.y += stepY;
    }
    
    this.walkRight = function() {
        r = random(1);
        
        //40% chance of moving right
        if (r<0.4) {
            this.x = x++;
        }
        //20% chance of moving left
        else if (r<0.6) {
            this.x = x--;
        }
        //20% chance of moving down
        else if (r<0.8) {
            this.y = y++;
        }
        //20% chance of moving up
        else {
            this.y = y--;
        }
    }
}

//set up the canvas - this section runs only once
function setup() {
    createCanvas(1024,768);
    //stroke('none');
    //fill(155);
    //set the canvas to white
    background(255);
    test = new Walker(500,350);
}

//the draw function runs many times per second (30?) - anything in here executes continuously
function draw() {
    
    test.display();
    test.walkRight();
}