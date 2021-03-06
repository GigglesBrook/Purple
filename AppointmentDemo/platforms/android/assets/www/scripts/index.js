﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

// global variables
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;
var g_appointments = [];

var g_mainDate=19;

// this is called when an error happens in a transaction
function errorHandler(transaction, error)
{
//    alert('Error: ' + error.message + ' code: ' + error.code);
    alert('Error: FIX THIS' );
}

// this is called when a successful transaction happens
function successCallBack1()
{
//    alert("DEBUGGING: success 1");
}

function successCallBack2() {
//    alert("DEBUGGING: success 2");
}

function successCallBack3() {
//    alert("DEBUGGING: success 3");
}

function successCallBack4() {
//    alert("DEBUGGING: success 4");
}

function successCallBack5() {
//    alert("DEBUGGING: success 5");
}

function successCallBack6() {
//    alert("DEBUGGING: success 6");
}

function successCallBack7() {
//    alert("DEBUGGING: success 7");
}

function processAppointmentResults(transaction, resultAppointments)
{
    if (resultAppointments != null && resultAppointments.rows != null)
    {
        for (var i = 0; i < resultAppointments.rows.length; i++)
        {
            var row = resultAppointments.rows.item(i);

            var appointmentTime = row.AptTime;
            var appointmentUserName = row.UsrFirstName + ' ' + row.UsrLastName;

            document.getElementById("DayViewAppointmentList").innerHTML += '<li><span>' + appointmentTime + '</span><p>' + appointmentUserName + '</p></li>';
        }
    }
}




function GenerateSingleMonthCalender()
{
    document.getElementById("dayValue").innerHTML = g_mainDate;
    //    <a href="">Â«</a><span>17</span><a href="#">Â»</a>   // day should include this but it doesn't work as I'd like

    document.getElementById("monthValue").innerHTML = 'Febuary';

    var bodyString = '';
    var date = 0;
    var numDaysInPreviousMonth = 31;
    var numDaysInThisMonth = 28;

    var buttonIdStrings=["test"];;
    var buttonDates = [5];
    var buttonCount = 0;

    for ( row=0; row<5; row++ )
    {
        bodyString += '<tr>';

        if (date <= numDaysInThisMonth)
        {
            for (column = 0; column < 7; column++) {
                if (date <= 0) // lastMonth
                {
                    bodyString += '<td class="inactive">' + (date + numDaysInPreviousMonth) + '</td>';
                }
                else
                if (date > numDaysInThisMonth) // next month
                {
                    bodyString += '<td class="inactive">' + (date - numDaysInThisMonth) + '</td>';
                }
                else
                {
                    var buttonIdString = 'dateButton' + date;

                    buttonIdStrings[buttonCount]=buttonIdString;
                    buttonDates[buttonCount] = date;
                    buttonCount += 1;

                    bodyString += '<td><button id="' + buttonIdString + '" class="editbtn">' + date + '</button></td>';
                }

                date += 1;
            }
        }

        bodyString += '</tr>';
    }

    document.getElementById("calendarDaysBody").innerHTML = bodyString;

    // add some button event listeners

    for (i = 0; i < buttonCount; i++)
    {
        var buttonElement=document.getElementById(buttonIdStrings[i]);

        if ( buttonElement == null )
        {
            alert("Cant find [" + buttonIdString + "]");
        }
        else
        {
            buttonElement.addEventListener("click", SomeFunction );
            buttonElement.myParam = buttonDates[i];
        }
    }
}


function SomeFunction( evt )
{
    g_mainDate = evt.target.myParam;
    document.getElementById("dayValue").innerHTML = g_mainDate;
}





function nullHandler(){};


function ListDBValues() {

    if (!window.openDatabase) 
    {
        alert('Databases are not supported in this browser.');
        return;
    }


    // this next section will select all the content from the User table and then go through it row by row
    // appending the UserId  FirstName  LastName to the  #lbUsers element on the page
    document.getElementById("DayViewAppointmentList").innerHTML = "";
    document.getElementById("DayViewClientList").innerHTML = "";

    db.transaction(function (transaction)
    {
        var queryString = '';
        queryString += 'SELECT Apt.Time AS AptTime, Usr.FirstName AS UsrFirstName, Usr.LastName AS UsrLastName ';
        queryString += 'FROM Appointments Apt, User Usr ';
        queryString += 'WHERE Apt.UserId = Usr.UserId; ';

        transaction.executeSql( queryString, [], processAppointmentResults, errorHandler);
    }, errorHandler, successCallBack5);

    return;

}

function initialiseDatabase() {

    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }

    // this is the section that actually inserts the values into the User table


    db.transaction(function (transaction)
    {
        transaction.executeSql('INSERT INTO User( FirstName, LastName ) VALUES (?,?)', ["Christopher", "Stanforth"]);
        transaction.executeSql('INSERT INTO User( FirstName, LastName ) VALUES (?,?)', ["Fiona", "Stanforth"]);
        transaction.executeSql('INSERT INTO Appointments( Time, UserId ) VALUES (?,?)', ["2016-03-01 10:30:0.0", 1]);
        transaction.executeSql('INSERT INTO Appointments( Time, UserId ) VALUES (?,?)', ["2016-03-01 11:30:0.0", 2]);
    }, errorHandler, successCallBack5);
    
    // this calls the function that will show what is in the User table in the database
//    ListDBValues();

    GenerateSingleMonthCalender();

    return false;
}


function setupDatabase(){

    if (!window.openDatabase)
    {
        // not all mobile devices support databases  if it does not, the following alert will display
        // indicating the device will not be albe to run this application
        alert('Databases are not supported in this browser.');
        return;
    }

    // this line tries to open the database base locally on the device
    // if it does not exist, it will create it and return a database object stored in variable db
    db = openDatabase(shortName, version, displayName,maxSize);

    // this line will try to create the table User in the database just created/openned
    db.transaction(function (tx)
    {
        // you can uncomment this next line if you want the User table to be empty each time the application runs
        tx.executeSql('DROP TABLE Appointments', nullHandler, nullHandler);
        tx.executeSql('DROP TABLE User', nullHandler, nullHandler);

        // this line actually creates the table User if it does not exist and sets up the three columns and their types
        // note the UserId column is an auto incrementing column which is useful if you want to pull back distinct rows
        // easily from the table.
        tx.executeSql('CREATE TABLE IF NOT EXISTS Appointments(AppointmentId INTEGER NOT NULL PRIMARY KEY, Time TEXT NOT NULL, UserId Integer NOT NULL)', [], successCallBack2, errorHandler );
        tx.executeSql('CREATE TABLE IF NOT EXISTS User(UserId INTEGER NOT NULL PRIMARY KEY, FirstName TEXT NOT NULL, LastName TEXT NOT NULL)', [], successCallBack3, errorHandler);

        initialiseDatabase();

    }, errorHandler, successCallBack4);
    
}

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    document.getElementById("refreshBtn").addEventListener("click", ListDBValues );

    document.getElementById("testparagraph").innerHTML = "Hello JavaScript";

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );

        document.getElementById("testparagraph").innerHTML = "OnDevice Ready";

        setupDatabase();

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();