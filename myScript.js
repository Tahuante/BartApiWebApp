
//http://api.bart.gov/api/sched.aspx?cmd=depart&orig=ASHB&dest=CIVC&date=now&key=MW9S-E7SL-26DU-VV8V&b=2&a=2&l=1&json=y

//http://api.bart.gov/api/sched.aspx?cmd=fare&orig=sfia&dest=pitt&key=MW9S-E7SL-26DU-VV8V&json=y


const fareURL = "http://api.bart.gov/api/sched.aspx?cmd=fare&orig=";
const fareKEYFormat = "&key=";

const bartURL = "http://api.bart.gov/api/sched.aspx?cmd=depart&orig=";

const bartDate = "&date=now&key=";
const bartFormat = "&b=2&a=2&l=1&json=y";

var origenStation = "sfia";
var destStation = "pitt";
var bartDest = "&dest=";
var bartKEY = "MW9S-E7SL-26DU-VV8V&b";
var displayBtn = document.getElementById('displayBtn');
var displayFare = document.getElementById('displayFare');
var fareRadio1 = document.getElementById('fareRadio1');
var fareRadio2 = document.getElementById('fareRadio2');
var fareBtn = document.getElementById('fareBtn');
let fareCalc = 0;


var urlRequest = fareURL + origenStation + bartDest + destStation + fareKEYFormat + bartKEY + bartFormat;
//console.log("check url ",urlResquest)


var bartStationFrom = document.getElementById('bartStationFrom');
var bartStationTo = document.getElementById('bartStationTo');

var displayInfo = document.getElementById('displayInfo');

var bartInfo;





displayBtn.addEventListener('click', function (e) {

    origenStation = bartStationFrom.value;
    destStation = bartStationTo.value;
    urlRequest = bartURL + origenStation + bartDest + destStation + bartDate + bartKEY + bartFormat;

    if (origenStation == "0" | destStation == "0") {
        alert("Please make a selection To and From in the the dropdown menus!");
    } else {
        urlRequest = bartURL + origenStation + bartDest + destStation + bartDate + bartKEY + bartFormat;
        console.log("This is urlRequest ->>> ", urlRequest);
        loadJSON(urlRequest, "SCHEDULE");
    }
    //console.log("check ",urlResquest)
    //loadJSONbart(urlResquest);

    //urlResquest2 = fareURL + origenStation + bartDest + destStation + fareKeyFormat + bartKey + bartFormat;
    // console.log("check ", urlResquest);

});


fareBtn.addEventListener('click', function (e) {
    origenStation = bartStationFrom.value;
    destStation = bartStationTo.value;
    fareCalc = 0;
    if (origenStation == "0" | destStation == "0") {
        alert("Please make a selection To and From in the the dropdown menus!");
    } else {
        var radioCheckFlag = false;
        if (fareRadio1.checked == true) {
            fareCalc = 1;
            console.log("radio1 enabled");
        } else if (fareRadio2.checked == true) {
            fareCalc = 2;
            console.log("radio2 enabled");
        } else {
            radioCheckFlag = true;
        }
        if (radioCheckFlag == true) {
            alert("Please check option single or round trip!!!");
            radioCheckFlag = false;
        } else {
            urlRequest = fareURL + origenStation + bartDest + destStation + fareKEYFormat + bartKEY + bartFormat;
            console.log("This is urlRequest ->>> ", urlRequest);
            loadJSON(urlRequest, "FARE");
        }
    }


});



function loadJSON(url, option) {
    //console.log("URL is " + url);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            bartInfo = JSON.parse(xhr.responseText);
            //console.log("option is ->", option);
            switch (option) {
                case 'SCHEDULE':
                    var result = bartInfo.root.schedule.request;
                    //alert("Stop for schedule");
                    console.log("This is length ->", typeof (result.trip.length), result.trip.length);
                    for (var i = 0; i < result.trip.length; i++) {
                        console.log("This is length ->", typeof (result.trip[i]['@origTimeMin']), result.trip[i]['@origTimeMin']);
                    }

                    displayInfo.innerHTML = "<br>The next available bart is at " + result.trip[0]['@origTimeMin'] + "<br>";
                    displayInfo.innerHTML = displayInfo.innerHTML + "The arrival time at " + result.trip[0]['@destTimeMin'];
                    break;
                case 'FARE':
                    var result = bartInfo.root.fares;
                    //console.log("This is length ->", typeof (result.fare.length), result.fare.length);
                    displayFare.innerHTML = "<br>FARES:<br>";
                    for (var i = 0; i < result.fare.length; i++) {

                        displayFare.innerHTML = displayFare.innerHTML + result.fare[i]['@name'] + " : $ ";
                        displayFare.innerHTML = displayFare.innerHTML + (result.fare[i]['@amount'] * fareCalc) + "<br>";
                        console.log("This is amount ->", typeof (result.fare[i]['@amount'] * fareCalc), result.fare[i]['@amount']);
                        console.log("This is name ->", typeof (result.fare[i]['@name']), result.fare[i]['@name']);
                    }
                    break;
                default:
                    break;
            }
        } else {
            alert("Did not load List");
        }
    }
    xhr.send();
}
    