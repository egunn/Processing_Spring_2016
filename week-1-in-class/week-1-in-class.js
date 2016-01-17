// Learning Processing
// Daniel Shiffman
// http://www.learningprocessing.com

// Example 1-1: stroke and fill

function setup() {
  createCanvas(480, 270);
  stroke(0); 
  fill(150);
}

function draw() {

  //background(255);
    //draw semi-transparent rectangle to fade out the display over time
  fill(255,10);
  rect(0,0,width,height);

noStroke();    
//fill(random(255),random(255),random(255),25); //transparency
    
fill (255,0, map(sin(frameCount/10),-1,1,0,255),50);
//draw a circle, and vary its x-axis to make a ball that bounces from side to side.     
  ellipse(sin(frameCount/10)*100+200,cos(frameCount/20)*100+125,30,30); 
//framecount gives the number of iterations in sketch - constantly incrementing. Sine varies from -1 to 1, so value goes from -10 to 10 - adjust framecount to change rate (div by 10 to slow down). Add 100 to the scaled frameCount value to translate the ball into the body of the screen. Change scale multiplier to adjust slope.
    
    ellipse(cos(frameCount/20)*70+125,sin(frameCount/10)*70+200,30,30); 
    
}