//***************************************************************
//Particle
//***************************************************************

//Contains methods and static properties shared among all particles in the code

//literal notation - defines an object, not a function
var Particle = {

    drawParticles: function (pp) {
        noStroke();

        //draw the particle itself
        ellipse(this.pos.x
            , this.pos.y
            , this.radius * 2
            , this.radius * 2);
    },
    
    updateParticles: function () {

    },
    
    drawLabels: function (pp) {
        
        var maximumRadius = 57;
        
            fill(255);
            textFont(ralewayMed);
            textSize(14);
            textAlign(CENTER);
        
            //wrap text as necessary to fit inside particle
            if (textWidth(this.name) < 2 * maximumRadius - 10) {
                textAlign(CENTER);
                text(this.name, this.pos.x, this.pos.y -2);
                textSize(11);
                text("$" + nfc(this.sum,0), this.pos.x, this.pos.y + 14);
            } 
            else {
                twoLines = split(this.name, " ");
                var test = twoLines[0] + " " + twoLines[1];
                if (textWidth(test) < 2 * maximumRadius - 10){
                    text(test, this.pos.x, this.pos.y - 13);
                    text(twoLines[2], this.pos.x, this.pos.y + 2); 
                    textSize(11);
                    textAlign(CENTER);
                    text("$" + nfc(this.sum,0), this.pos.x, this.pos.y + 18)
                }
                else {
                    text(twoLines[0], this.pos.x, this.pos.y - 13);
                    text(twoLines[1], this.pos.x, this.pos.y + 2); 
                    textSize(11);
                    textAlign(CENTER);
                    text("$" + nfc(this.sum,0), this.pos.x, this.pos.y + 18)
                }
                
            }

    },
    
    //increase the particle size (used when the mouse is over it)
    incRadius: function(pp) {
        var maximumRadius = 57;
        this.radius += 4;
        if (this.radius >= maximumRadius) {
            this.radius = maximumRadius;
                        
        }
        
        

    }

}



