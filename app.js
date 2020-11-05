var mysql = require("mysql");   // makes connection to my server from MySQL
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "365365365jJkK;",
    database: "hw4"
});

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

const express = require("express"); // Use Express 
const app = express();
const url = require('url');

app.get("/", (req, res) => {
    writeSearch(req, res);
});

app.get("/schedule", (req, res) =>{
    writeSchedule(req, res);
});

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server started!");
});

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
                    body{
                        background-color: rgb(255, 245, 240);
                        font-family: Arial, Helvetica, sans-serif;
                    }
                    table{
                        background-color: gray;
                        width: 100%;
                    }
                    table td{
                        background-color: rgb(255, 229, 212);
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
                <form method = "get" action = "/">
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
                    <a href = "/schedule"><b>Check Schedule</b><a><br>
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
            <button type = "button" class="toggle"> CSE ` + item.Course + ` - ` +
            item.CourseName + ` - ` + item.Component + ` - Section ` + item.Section + `</button>
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
    Combined Enrollment Cap: ` + item.CombEnrollCap + `<form action ="/schedule" method = "get">
    <button name = "add" value="` + item.id + `"> Add Class </button></form></pre>`;
        }
        res.write(html + "\n\n</body>\n<\html>")
        res.end();
    });

};

function writeSchedule(req, res) {
    let query = url.parse(req.url, true).query;
    let addQuery = `INSERT INTO saved SELECT * FROM courses WHERE courses.id="` + query.add + `";`

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title> Schedule </title>
            <style type = text/css>
            body{
                background-color:  rgb(255, 245, 240);
            }
            table{
                background-color: gray;
            }
            table, p, h1, a{
                font-family: Arial, Helvetica, sans-serif;
            }
            table th{
                background-color: rgb(255, 212, 160);
                text-align: center;
                font-size: 18px;
                padding: 3px;
                width: 180px;
            }
            table td{
                background-color: rgb(212, 245, 255);
                text-align: left;
                border-bottom: 1px solid black;
                padding: 3px;
            }
            </style>
        </head>
    <body>
        <h1> Schedule </h1>
        <a href = "/"><b>Return to Search</b><a>
        <br><br>

        <table>
            <tr>
                <th> Mon </th>
                <th> Tue </th>
                <th> Wed </th>
                <th> Thu </th>
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

function constructSQLDayCommand(search) {
    var sql = `SELECT * FROM saved WHERE Days like '%` + search + `%' ORDER BY StartTime;`;
    return sql;
};