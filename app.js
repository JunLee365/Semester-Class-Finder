var mysql = require("mysql");   // makes connection to my server from MySQL
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "365365365jJkK;",
    database: "hw4"
});
// Classes table: list of classes
// saved table: list iof saved classes on schedule


// on connection, SQL script is used to automatically remake the saved table
con.connect(function(err) {
    if (err) throw err;
    var sql = `DROP TABLE IF EXISTS saved;`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table deleted");
        sql =`CREATE TABLE saved SELECT * FROM courses LIMIT 0;`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Table created");
        });
    });
});

// Use express to read the URL
const express = require("express"); // Use Express 
const app = express();
const url = require('url');

// default: when on the main page adding classes
app.get("/", (req, res) => {
    writeSearch(req, res);
});

// schedule page: shows the schedule made
app.get("/schedule", (req, res) =>{
    writeSchedule(req, res);
});

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server started!");
});

// function triggered when user is at the main page adding classes
function writeSearch(req, res){
        res.writeHead(200, {"Content-Type": "text/html"});
        let query = url.parse(req.url, true).query;

        let search = query.search ? query.search : "";
        let filter = query.filter ? query.filter : "";

        let html = `
        <!DOCTYPE html>
        <html lang = "en">
            <head>
                <title>CSE Class Find</title>
                <style>
                    body, pre{
                        background-color:  #FFDAC7;
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    table{
                        background-color: gray;
                        width: 100%;
                    }
                    table td{
                        background-color: #C7ECFF;
                        text-align: left;
                    }
                    table div{
                        border-bottom: 1px solid black;
                        padding: 3px;
                    }
                </style>
            </head>

            <body>
                <h1>CSE Class Find</h1>
                <form method = "get" action = "/"> <b>Search</b>
                    <input type = "text" name = "search" value = "">
                    <b>in</b>
                    <select name = "filter">
                        <option value = "allFields">All Fields</option>
                        <option value = "courseName">Course Title</option>
                        <option value = "courseNum">Course Num</option>
                        <option value = "instructor">Instructor</option>
                        <option value = "day">Day</option>
                        <option value = "time">Time</option>
                    </select>
                    <input type = "submit" value = "Submit"><br><br>
                    Example searches: 316, Fodor, 2:30 PM, MW <br><br>
                    <a href = "/schedule"><b>Check generated schedule</b><a><br>
                </form>
                <br>`; 

    let sql = `SELECT * FROM courses;`;

    // sql to search all columns
    if(filter == "allFields"){
        sql = `SELECT * FROM courses
            WHERE Subject   LIKE '%` + search + `%' OR
            Course          LIKE '%` + search + `%' OR
            CourseName      LIKE '%` + search + `%' OR
            Component       LIKE '%` + search + `%' OR
            Section         LIKE '%` + search + `%' OR
            Days            LIKE '%` + search + `%' OR
            StartTime       LIKE '%` + search + `%' OR
            EndTime         LIKE '%` + search + `%' OR
            StartDate       LIKE '%` + search + `%' OR
            EndDate         LIKE '%` + search + `%' OR
            Duration        LIKE '%` + search + `%' OR
            InstructionMode LIKE '%` + search + `%' OR
            Building        LIKE '%` + search + `%' OR
            Room            LIKE '%` + search + `%' OR
            Instructor      LIKE '%` + search + `%' OR
            EnrollCap       LIKE '%` + search + `%' OR
            WaitCap         LIKE '%` + search + `%' OR
            CombDesc        LIKE '%` + search + `%' OR
            CombEnrollCap   LIKE '%` + search + `%';`;}
    // search course num
    else if (filter == "courseNum"){
        sql = `SELECT * FROM courses WHERE Course LIKE '%` + search + `%';`;
    }
    // course names
    else if (filter == "courseName"){
        sql = `SELECT * FROM courses WHERE CourseName LIKE '%` + search + `%';`;
    }
    // instructors
    else if (filter == "instructor"){
        sql = `SELECT * FROM courses WHERE Instructor LIKE '%` + search + `%';`;
    }
    // days
    else if (filter == "day"){
        sql = `SELECT * FROM courses WHERE Days LIKE '%` + search + `%' ORDER BY StartTime;`;
    }
    // course times
    else if (filter == "time"){
        sql = `SELECT * FROM courses WHERE StartTime LIKE '%` + search + `%' OR
        EndTime LIKE '%` + search + `%';`;
    }

    con.query(sql, function(err, result){
        if(err) throw err;
        for (let item of result) {
            html += `
            <form action ="/schedule" method = "get">
            <button name = "add" value="` + item.id + `"> Add CSE ` + item.Course + ` - ` + item.CourseName + ` - ` + item.Component + ` - Section ` + item.Section + `</button>
            </form>
    <pre>
    Days: ` + item.Days + `
    Start Time: ` + item.StartTime + `\t End Time:` + item.EndTime + `
    Start Date: ` + item.StartDate + `\t End Date:` + item.EndDate + `
    Duration: ` + item.Duration + `\t\t Instruction Mode: ` + item.InstructionMode + `
    Building: ` + item.Building + `
    Room: ` + item.Room + `
    Instructor: ` + item.Instructor + `
    Enrollment Cap: ` + item.EnrollCap + `\t Wait Cap: ` + item.WaitCap + `
    Combined Description: ` + item.CombDesc + `
    Combined Enrollment Cap: ` + item.CombEnrollCap + `</pre>`;
        }
        res.write(html + "\n\n</body>\n<\html>")
        res.end();
    });

};

// function triggered when user is at the schedule page seeing classes added
function writeSchedule(req, res) {
    let query = url.parse(req.url, true).query;
    let addQuery = `INSERT INTO saved SELECT * FROM courses WHERE courses.id="` + query.add + `";`

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title> Generated Schedule </title>
            <style type = text/css>
            body{
                background-color: #FFDAC7;
            }
            table{
                background-color: gray;
            }
            table, p, h1, a{
                font-family: Arial, Helvetica, sans-serif;
            }
            table th{
                background-color: #FFB894;
                text-align: center;
                font-size: 18px;
                padding: 3px;
                width: 180px;
            }
            table td{
                background-color: #C7ECFF;
                text-align: left;
                border-bottom: 1px solid black;
                padding: 3px;
            }
            </style>
        </head>
    <body>
        <h1> Generated Schedule </h1>
        <a href = "/"><b>Return to Search</b><a>
        <br><br>

        <table>
            <tr>
                <th> Mon </th>
                <th> Tues </th>
                <th> Wed </th>
                <th> Thur </th>
                <th> Fri </th>
            </tr>
            <tr>
                <td> Mon </td>
                <td> Tue </td>
                <td> Wed </td>
                <td> Thu </td>
                <td> Fri </td>
            </tr>
        </table>
    </body>
    </html>`;

    con.query(addQuery, function(err, result){
        if(err) console.log(err);
        con.query(constructSQLDayCommand("M"), function(err, result){

            if(err) throw err;
            html = html.replace("<td> Mon </td>", getDay(result, "MON"));
            con.query(constructSQLDayCommand("TU"), function(err, result){
                if(err) throw err;
                html = html.replace("<td> Tue </td>", getDay(result, "TUE"));
                con.query(constructSQLDayCommand("W"), function(err, result){
                    if(err) throw err;
                    html = html.replace("<td> Wed </td>", getDay(result, "WED"));
                    con.query(constructSQLDayCommand("TH"), function(err, result){
                        if(err) throw err;
                        html = html.replace("<td> Thu </td>", getDay(result, "THU"));
                        con.query(constructSQLDayCommand("F"), function(err, result){
                            if(err) throw err;
                            html = html.replace("<td> Fri </td>", getDay(result, "FRI"));
                            res.write(html + "\n\n</body>\n</html>");
                            res.end();
                        });
                    });
                });
            });
        });
    });
}

// SQL script to get query of classes for each weekdays in ascending order of time
function constructSQLDayCommand(search) {
    var sql = `SELECT DISTINCT * FROM saved WHERE Days like '%` + search + `%' ORDER BY STR_TO_DATE(StartTime, '%l:%i %p');`;
    return sql;
};

// prints the classes for each weekdays on display
function getDay(SQLResult, tableHeader){
    let retStr = "<td>";
    for (let item of SQLResult){
        retStr += "\n <b>" + item.StartTime + ` - ` +
        item.EndTime + `<br>` +
        item.Subject + " " +
        item.Course + "-" +
        item.Section + ` </b><p> ` +
        item.CourseName + `<br><br>` +
        item.Instructor + `<br><br>`;
    }
    return retStr + "</td>";
}