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
        strokeWeight(.25);
        line(this.investor.pos.x, this.investor.pos.y, this.company.pos.x, this.company.pos.y);
    }

}


//***************************************************************
//Text labels for highlighted investors
//***************************************************************

function CollisionLabels(investor, centerCompany) {
        this.pos = createVector(investor.pos.x, investor.pos.y).sub(createVector(centerCompany.pos.x,    
            centerCompany.pos.y));
        this.center = centerCompany;
        this.investor = {pos:null, name:null, defaultRadius: null};
        this.investor.pos = createVector(investor.pos.x,investor.pos.y);
        this.investor.name = investor.name;
        this.investor.defaultRadius = investor.defaultRadius;

        this.theta = atan2(this.investor.pos.y - this.center.pos.y, this.investor.pos.x - this.center.pos.x);
    
        this.draw = function() {
            
            //draw labels with company name and dollar amount
            push();
                                                   
                translate(this.investor.pos.x,this.investor.pos.y);

                //lower left quadrant
                if(this.investor.pos.x <= width/2 && this.investor.pos.y >= height/2){
                    textAlign(RIGHT);
                    translate((this.investor.defaultRadius+10)*cos(this.theta), (this.investor.defaultRadius+10)*sin(this.theta));// + .15));
                }
                //upper left quadrant
                else if(this.investor.pos.x < width/2 && this.investor.pos.y < height/2){
                    textAlign(RIGHT);
                    translate((this.investor.defaultRadius+5)*cos(this.theta), (this.investor.defaultRadius+5)*sin(this.theta));// + .15));
                }
                //lower right quadrant
                else if(this.investor.pos.x >= width/2 && this.investor.pos.y >= height/2){
                    textAlign(LEFT);
                    translate((this.investor.defaultRadius+10)*cos(this.theta), (this.investor.defaultRadius+10)*sin(this.theta));
                }
                //upper right quadrant
                else if(this.investor.pos.x > width/2 && this.investor.pos.y < height/2){
                    textAlign(LEFT);
                    translate((this.investor.defaultRadius+5)*cos(this.theta), (this.investor.defaultRadius+5)*sin(this.theta));
                }

                noStroke();
                textSize(11);
                textFont(ralewayReg);
                fill(70);

                text(this.investor.name, 0,0);
            
            pop();
        }
        
        this.update = function() {
            //collision function for investor labels when company selected
            if (selectedCompany && selectedLabels!= [] ){

                for (var STEPS = 0; STEPS < 4; STEPS++) {
                    for (var i = 0; i < selectedLabels.length - 1; i++) {
                        for (var j = i + 1; j < selectedLabels.length; j++) {

                            var pa = selectedLabels[i];
                            var pb = selectedLabels[j];

                            if (sq(pa.investor.pos.y-pb.investor.pos.y) < 196){
                                if (pb.investor.pos.y > pa.investor.pos.y   &&  
                                    sq(pa.investor.pos.x-pb.investor.pos.x) < sq(textWidth(pb.investor.name) + textWidth(pa.investor.name))){  
                                    
                                    
                                    pb.investor.pos.y += 1.5;
                                    pa.investor.pos.y -= 1.5;
                                }
                                selectedLabels[i].investor.pos.y = pa.investor.pos.y;
                                selectedLabels[j].investor.pos.y = pb.investor.pos.y;
                            }

                           
                        }
                    }
                }
                
            }

        }

}


