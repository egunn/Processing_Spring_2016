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
    text('A visualization of the top 50 companies', 50, 94);
    text('in the 2013 CrunchBase database', 50, 112);
    text('By Erica Gunn', 50, 136);
    text('NEU 2016', 50, 154);
    textSize(11);
    text('data from www.crunchbase.com', 50, height - 70);
    text('“CrunchBase 2013 Snapshot” extracted 2013-12-12',46, height - 56); 
    
    //if nothing is selected, show Companies and Investors labels.
    if (isMouseOver == false) {

        //from https://processing.org/tutorials/text/
        push();
        var message = "Companies";
        var arclength = 0;
        var message2 = "Investors";
        var arclength2 = 0;
        noFill();
        textAlign(CENTER);
        fill(235);
        noStroke();
        var r = 130;
        var r2 = 240;
        translate(width/2,height/2);
        ellipse(0, 0, 2*r,2*r);
        ellipse(0, 0, 2*r2,2*r2);

        //draw arc text labels
        for (var i = 0; i<message.length; i++){
            var currentChar = message.charAt(i)
            w = textWidth(currentChar);
            arclength += w/2 + 1.3;
            var theta = 31*PI/24 + (arclength/r);

            push();
            //console.log(r);
            translate(r*cos(theta), r*sin(theta));
            rotate(theta+PI/2); 
            textSize(14);
            textFont(ralewayReg);
            fill(90);
            text(currentChar,0,0);
            pop();
            arclength += w/2 + 1.3;

        }

        for (var i = 0; i<message2.length; i++){
            var currentChar2 = message2.charAt(i)
            w2 = textWidth(currentChar2);
            arclength2 += w2/2 + 1.2;
            var theta2 = 32*PI/24 + (arclength2/r2);

            push();
            //console.log(r);
            translate(r2*cos(theta2), r2*sin(theta2));
            rotate(theta2+PI/2); 
            textSize(14);
            textFont(ralewayReg);
            fill(90);
            text(currentChar2,0,0);
            pop();
            arclength2 += w2/2 + 1.2;

        }


        pop(); 
    }
    

    //run collision function to check that the particles are not overlapping.
    for (var STEPS = 0; STEPS < 4; STEPS++) {

        for (var i = 0; i < companySystem.length - 1; i++) {
            for (var j = i + 1; j < companySystem.length; j++) {


                var pa = companySystem[i];
                var pb = companySystem[j];

                //create vector between particles, compare to radii. If too close, move apart.
                var ab = p5.Vector.sub(pb.pos, pa.pos);
                var distSq = ab.magSq();

                if (distSq <= sq(pa.radius + pb.radius)) {
                    var dist = sqrt(distSq);
                    var overlap = (pa.radius + pb.radius) - dist;
                    ab.div(dist);
                    ab.mult(overlap * 0.5);
                    pb.pos.add(ab);
                    ab.mult(-1);
                    pa.pos.add(ab);

                    //damp velocity
                    pa.vel.mult(0.97);
                    pb.vel.mult(0.97);
                }
            }
        }
    }

    //reset selection and mouse highlight tracking variables
    selectedCompany = null;
    isMouseOver = false;

    //update & draw companies
    for (var i = companySystem.length - 1; i >= 0; i--) {
        var p = companySystem[i];

        p.updateCompanies();
        p.drawCompanies();
    }

    selectedInvestor = null;


    //update & draw investors
    investorSystem.forEach(function (e) {
        e.updateInvestors();
        e.drawInvestors();
    })

    //if an investor is highlighted, draw it
    if (selectedInvestor){      
        selectedInvestor.drawInvestors();
        selectedInvestor.drawLabels();
    }

    //if a company is highlighted, draw it
    if (selectedCompany){     
        //selectedCompany.updateCompanies();
        selectedCompany.drawCompanies();
        selectedCompany.drawLabels();
    } 

    //add labels appropriate to the selection
    selectedLabels.forEach(function(d){ 
        d.update();
        d.draw();
    })

    selectedLabels = [];
    

}



//resize canvas when window size is changed
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}