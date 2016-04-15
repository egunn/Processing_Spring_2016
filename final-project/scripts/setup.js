var table;
var button;
var selectedInvestor,selectedCompany;

var connections = [];
var uniqueInvestors = [];
var allConnections =[];
var companySystem = [];
var investorSystem = [];
var attractors = [];
var selectedLabels = []; //holds text labels for collision function

var aggregated = {};
var aggregatedInvestors = {};
var clicked = {};

var companyToDisplay = null;
var mouseListener = false;
var isMouseOver = false;


//callback function that forces processing to wait until file loads before running rest of code.
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
    
    //associates canvas with #canvas object
    var canvas = createCanvas(windowWidth, windowHeight);
    var width = windowWidth;
    var height = windowHeight;

    //change refresh rate to 30 frames/second
    frameRate(30);

    background(245);

    //hue(0-360) saturation(0-100) brightness transparency
    colorMode(HSB, 360, 100, 100, 1);

    //create attractor 
    var at = new Attractor(createVector(width / 2, height / 2), 1);

    attractors.push(at);

    //for each row in table, grab name of company and amount in USD.
    //Look for company inside object file. If it exists, add USD to amount that was there.
    for (var r = 0; r < table.getRowCount(); r++) {
        var cname = table.getString(r, "company_name");
        var invested = table.getString(r, "amount_usd");
        var iname = table.getString(r, "investor_name");
        //console.log(iname);

        //convert string to integer to check for empty columns. Store in variable. 
        invested = parseInt(invested);

        //if it can't convert, returns NaN
        if (!isNaN(invested)) {
            //if it has a property with cname (eg Facebook) 
            //Object key is company name
            if (aggregated.hasOwnProperty(cname)) {
                //add invested amount to value
                aggregated[cname] += invested;

            } else {
                //otherwise, add a new property with the invested amount
                //have to use aggregated[] format b/c cname has spaces in it
                //can't do aggregated.Google Inc w/ a space
                aggregated[cname] = invested;
            }

            if (aggregatedInvestors.hasOwnProperty(iname)) {
                //add invested amount to value
                aggregatedInvestors[iname] += invested;

            } else {
                //otherwise, add a new property with the invested amount
                //have to use aggregated[] format b/c cname has spaces in it
                //can't do aggregated.Google Inc w/ a space
                aggregatedInvestors[iname] = invested;
            }

        }

    }

    //console.log(aggregatedInvestors);  //all companies and sums, all investors and amounts (not associated by name)

    //create an empty array
    var aAggregated = [];

    //Object is the master of all objects in JS 
    //get an array of all the properties in the object - gives a list of all 
    //the keys in the object. In this case, that's all the company names.
    //For each company, 
    Object.keys(aggregated).forEach(function (key) {
        //create a new object entry
        var company = {};

        //store name and sum here 
        company.name = key;
        company.sum = aggregated[key]
        aAggregated.push(company);
    });

    //console.log(aAggregated); //all companies, with sums 

    var aAggregatedInvestors = [];
    Object.keys(aggregatedInvestors).forEach(function (key) {
        //create a new object called entry
        var investor = {};

        //store name and sum here 
        investor.name = key;
        investor.amount = aggregatedInvestors[key];
        aAggregatedInvestors.push(investor);
    });

    //console.log(aAggregatedInvestors); //all investors, with total amount invested 

    //sort function on the array, anonymous fxn looks at each pair
    aAggregated = aAggregated.sort(function (companyA, companyB) {
        //sorts in descending order
        return companyB.sum - companyA.sum;
    })

    //save top 200 companies
    aAggregated = aAggregated.slice(0, 50); //return to 200 when done debugging




    //go through tables for those 200 companies, and save connection {} for each one that stores
    //company, investor, amount, and data. 

    //does company in this row of the table exist in the aAggregated array? 
    for (var r = 0; r < table.getRowCount(); r++) {
        //store company name from table
        var compname = table.getString(r, "company_name");
        var invested = table.getString(r, "amount_usd");
        var investName = table.getString(r, "investor_name");
        
        var tempConn = {investor:{}, company:{}, amount:0};

        //use find function on the aAggregated array. Find function runs an anonymous 
        //function that we define. Anonymous function needs an element, and index, and an array. Element 
        //is the thing we hand it, it creates an index to keep track of where the element is in the 
        //array, and the array is the aAggregated array that you are passing in. 

        //Compares element given to companyname stored from table. If same, returns true. If not, 
        //returns false (to aAggregated.find). aAggregated.find gives back what we were trying to 
        //find: the company name we were checking for
        var foundCompany = aAggregated.find(function (element, index, array) { 
            
            if (element.name == compname) {
                //make a new company particle, and store it in tempConn
                tempConn.company = new Company(element.name, element.sum);

                //check whether it's already in companySystem
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
            //if it's not already in aAggregated, 
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

    //console.log(connections); //amount of _this_ investment, company name and sum of investments, investor name and total invested

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


    //console.log(uniqueInvestors[0]);
    //sort function on the array, anonymous fxn looks at each pair
    uniqueInvestors = uniqueInvestors.sort(function (investorA, investorB) {
        //sorts in descending order
        return investorB.sum - investorA.sum;
    })


    //save top 200 investors
    investorSystem = uniqueInvestors.slice(0, 200); //return to 200 when done debugging
        
    
    //go back through connections array, and check whether 
    //the investors are found in the uniqueInvestors array. If not,
    //remove the connection.
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
    
    //console.log(connections);
    //console.log(topConnections);    
    
    investorSystem.sort(function (a, b) {
        return a.radius - b.radius;
    });
    
    var angle = 0;
    var investorRadius = 153;
    
    
    investorSystem.forEach(function(p, i){
        angle += TWO_PI/360 * p.radius*.7;
        investorRadius += (p.radius)*.055;
        var pos = createVector((investorRadius + p.radius) * Math.sin(angle) + width / 2, (investorRadius+p.radius) * Math.cos(angle) + height / 2);
             
        p.pos = pos;
        
    });
    
}