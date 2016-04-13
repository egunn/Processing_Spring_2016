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

    },
    
    drawLabels: function (pp) {
        
        var maximumRadius = 57;
        
        //on "back" screen, show labels by default
       // if (mouseListener){

          /*  noStroke();
            fill(55);
            textSize(12);
            textAlign(CENTER);
            //position text above the investor circles
            text(this.name, this.pos.x, this.pos.y - this.radius - 5);*/
       // }
        
            fill(255);
            textFont(ralewayMed);
            textSize(14);
            textAlign(CENTER);
        
        //if (!mouseListener){
            //console.log('here');
            if (textWidth(this.name) < 2 * maximumRadius - 10) {
                textAlign(CENTER);
                text(this.name, this.pos.x, this.pos.y -2);
                textSize(11);
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

    },
    
    
    incRadius: function(pp) {
        var maximumRadius = 57;
        this.radius += 4;
        if (this.radius > maximumRadius) {
            this.radius = maximumRadius;
            this.drawParticles();
            this.drawLabels(this);

        }

    }

}



