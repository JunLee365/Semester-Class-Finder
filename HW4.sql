-- In case user needs to be set...
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '365365365jJkK;';
flush privileges;

-- How to setup the server before running HW #4
-- 1] Create and use schema
CREATE SCHEMA hw4; USE hw4;

-- 2] Import .csv file to make a table and provide courses table with PRIMARY KEY :o
ALTER TABLE hw4.courses ADD id INT PRIMARY KEY AUTO_INCREMENT FIRST;
ALTER TABLE hw4.courses DROP id; 
  
-- After using these 3 scripts, make sure to run the server of HW #4 on VSCode
-- It should be done then (instructions end here) ----------------------------------------

-- Here below are all the stuff I figured out manually

-- UPDATE recitation days (success)
/*UPDATE hw4.courses SET Days = 'M' WHERE Days = 'RECM';
SELECT * FROM hw4.courses;*/

-- Script to reset the table (automated)
DROP TABLE IF EXISTS hw4.saved;
CREATE TABLE hw4.saved SELECT * FROM courses LIMIT 0;
SELECT * FROM hw4.saved;

-- Original code (of adding row)
INSERT INTO saved SELECT * FROM courses WHERE courses.id=1;
SELECT * FROM hw4.saved;
SELECT * FROM hw4.courses;

-- ALTER TABLE hw4.saved ADD PRIMARY KEY (Course, Section);
-- ALTER TABLE hw4.saved ADD id INT REFERENCES hw4.courses(id);
-- DELETE FROM saved;-- Deletes a row
-- ALTER TABLE hw4.saved DROP id;


-- DRAFT CODE
-- INSERT IGNORE
/*INSERT IGNORE INTO saved (id, Subject, Course, CourseName, Component, Section, Days, StartTime, EndTime, StartDate, EndDate, Duration, InstructionMode, Building, Room, Instructor, EnrollCap, WaitCap, CombDesc, CombEnrollCap) 
VALUES (1,	"CSE",101,"Introduction to Computers,LEC",	"1",	"MWF",	"11:00 AM",	"11:53 AM",	"25-Jan-21","19-May-21",53,	"In Person",	"TBA",	"TBA",	"Kevin McDonnell",	210,	70,"","");*/

-- sorts by time (AM and PM considered)
SELECT StartTime from courses ORDER BY STR_TO_DATE(StartTime, '%l:%i %p');
-- %l:%i %p


