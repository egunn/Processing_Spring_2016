//***************************************************************
//Mouse Clicked
//***************************************************************
/*
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


//
    if (mouseListener == true && mouseX > width / 2 - 25 && mouseX < width / 2 + 25 && mouseY < height - 48 &&
        mouseY > height - 76) {

        companyToDisplay = null;
        mouseListener = false;
        investorsToDisplay = [];
    }//


}*/