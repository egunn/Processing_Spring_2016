var table;
var button;
var selectedInvestor,selectedCompany;  //passes mouse selection to update functions

var connections = [];      //holds company and investor objects, and an investment amount. One for each investor-company pair.
var uniqueInvestors = [];  //list of investors (duplicates removed)
var companySystem = [];    //array of all company objects created using Company class
var investorSystem = [];   //array of all investor objects created using Investor class
var attractors = [];       //attractor for custom gravity
var selectedLabels = [];   //holds text labels for collision function

var aggregated = {};         //temporary object to store aggregated company value 
var aggregatedInvestors = {};//temporary object to store aggregated investor value 

var companyToDisplay = null; //tracks which company is highlighted with the mouse
var isMouseOver = false;     //tracks whether mouse is over a particle


//callback function that forces processing to wait until file loads before running rest of code.
//loads data table, fonts, and scripts containing function definitions (asynchronous loading
//causes trouble otherwise)
function preload() {
    table = loadTable("data/investments_clean.csv", "csv", "header");
    ralewayReg = loadFont('/fonts/raleway-regular.ttf');  
    ralewayMed = loadFont('/fonts/raleway-medium.ttf');  
    Particle;
    Company();
    Investor();
}


//***************************************************************
//SETUP
//***************************************************************

//runs once, at page load.
function setup() {
    
    //set basic canvas parameters
    var canvas = createCanvas(windowWidth, windowHeight);
    var width = windowWidth;
    var height = windowHeight;
    frameRate(30);
    background(245);
    colorMode(HSB, 360, 100, 100, 1);

    //create attractor 
    var at = new Attractor(createVector(width / 2, height / 2), 1);

    attractors.push(at);

    //for each row in table, grab name of company and amount in USD.
    //Look up company, aggragate total investment amount and store in aggregatedInvestors array under property invested.
    for (var r = 0; r < table.getRowCount(); r++) {
        var cname = table.getString(r, "company_name");
        var invested = table.getString(r, "amount_usd");
        var iname = table.getString(r, "investor_name");
        
        invested = parseInt(invested);

        if (!isNaN(invested)) {
            if (aggregated.hasOwnProperty(cname)) {
                aggregated[cname] += invested;

            } else {
                aggregated[cname] = invested;
            }

            if (aggregatedInvestors.hasOwnProperty(iname)) {
                aggregatedInvestors[iname] += invested;

            } else {
                aggregatedInvestors[iname] = invested;
            }

        }

    }

    //aggredatedInvestors contains all companies and sums, all investors and amounts (not associated by name)

    //create an empty array
    var aAggregated = [];

    //create a new object entry for each company, store key and sum of investments
    Object.keys(aggregated).forEach(function (key) {
        var company = {};

        company.name = key;
        company.sum = aggregated[key]
        aAggregated.push(company);
    });

    //aAggregated containts all companies, with sums 

    
    //likewise for investors
    var aAggregatedInvestors = [];
    Object.keys(aggregatedInvestors).forEach(function (key) {
        var investor = {};

        investor.name = key;
        investor.amount = aggregatedInvestors[key];
        aAggregatedInvestors.push(investor);
    });

    //aAggregatedInvestors stores all investors, with total amount invested 

    //sort array in descending order 
    aAggregated = aAggregated.sort(function (companyA, companyB) {
        return companyB.sum - companyA.sum;
    })

    //save top 50 companies
    aAggregated = aAggregated.slice(0, 50); 




    //go through tables for those 200 companies, and save connection {} for each one that stores
    //company, investor, amount, and data. 

    //Check whether company in this row of the table exists in the aAggregated array 
    //Make company particles for new companies, and populate the companySystem array
    //Do the same for investors, and connections; populate investorSystem and connections arrays
    for (var r = 0; r < table.getRowCount(); r++) {
        
        var compname = table.getString(r, "company_name");
        var invested = table.getString(r, "amount_usd");
        var investName = table.getString(r, "investor_name");
        
        var tempConn = {investor:{}, company:{}, amount:0};

        var foundCompany = aAggregated.find(function (element, index, array) { 
            
            if (element.name == compname) {
                tempConn.company = new Company(element.name, element.sum);

                var inSystem = companySystem.find(function(element, index, array){
                    if (element.name == compname){
                        return true;
                    }
                    else{
                        return false;
                    }
                });
                
                if (!inSystem) {
                    companySystem.push(tempConn.company);
                }
                
                return true;
            } 
            
            else {
                return false;
            }
        });


        if (foundCompany) {
            var foundInvestor = aAggregatedInvestors.find(function (element, index, array) {
                if (element.name == investName) {
                    tempConn.investor = new Investor(element.name, element.amount);
                     
                    return true;
                } else {
                    return false;
                }
            });

            if (foundInvestor) {
                tempConn.amount = table.getString(r, "amount_usd");
                conn = new Connection(tempConn);
                connections.push(conn);
            }

        }

    }

    //connections array contains the amount of _this_ investment, company name and sum of investments, investor name and total invested

    //go through connections array and extract unique investors to an array. 
    //If company is not yet in the array, add it.
    connections.forEach(function (d) {

        var invName = d.investor.name;
        
        var found = uniqueInvestors.find(function (uniqueInvestor) {
            return uniqueInvestor.name == invName;
        });

        if (!found) {
            uniqueInvestors.push(d.investor);
        }
    });


    //sort investors in descending order 
    uniqueInvestors = uniqueInvestors.sort(function (investorA, investorB) {
        return investorB.sum - investorA.sum;
    })


    //save top 200 investors
    investorSystem = uniqueInvestors.slice(0, 200); //return to 200 when done debugging
        
    
    //go back through connections array, and remove investors that are not in the top 200 list
    topConnections = [];
    connections.forEach(function (d) {

        var invName = d.investor.name;
        
        var found = investorSystem.find(function (investor) {
            return investor.name == invName;
        });

        if (found) {
            topConnections.push(d);
        }
    });
    

    //sort the investorSystem
    investorSystem.sort(function (a, b) {
        return a.radius - b.radius;
    });
    
    
    //calculate positions for the investors in the spiral, using radius to determine spacing and dist from center
    //update positions accordingly.
    var angle = 0;
    var investorRadius = 153;
        
    investorSystem.forEach(function(p, i){
        angle += TWO_PI/360 * p.radius*.7;
        investorRadius += (p.radius)*.055;
        var pos = createVector((investorRadius + p.radius) * Math.sin(angle) + width / 2, (investorRadius+p.radius) * Math.cos(angle) + height / 2);
             
        p.pos = pos;
        
    });
    
}