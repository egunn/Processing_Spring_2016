















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
        strokeWeight(.25);
        line(this.investor.pos.x, this.investor.pos.y, this.company.pos.x, this.company.pos.y);
    }

}


