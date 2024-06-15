const express = require('express');
const router = express.Router();
const connection = require('../connection'); // Adjust path as needed

// Route to handle course selection
router.post('/select-courses', (req, res) => {
    const userID = req.session.user.UserID; // Assume user is stored in session
    const courseIDs = req.body.courseIDs; // Array of selected course IDs

    if (!userID || !courseIDs) {
        return res.status(400).send('Invalid data');
    }

    // Delete previous selections
    connection.query('DELETE FROM UserCourses WHERE UserID = ?', [userID], (err, result) => {
        if (err) throw err;

        // Insert new selections
        const values = courseIDs.map(courseID => [userID, courseID]);
        connection.query('INSERT INTO UserCourses (UserID, CourseID) VALUES ?', [values], (err, result) => {
            if (err) throw err;
            res.send('Courses selected successfully');
        });
    });
});

// Route to fetch selected courses
router.get('/my-courses', (req, res) => {
    const userID = req.session.user.UserID;

    if (!userID) {
        return res.status(401).send('Unauthorized');
    }

    connection.query(`
        SELECT Courses.CourseID, Courses.CourseName
        FROM Courses
        INNER JOIN UserCourses ON Courses.CourseID = UserCourses.CourseID
        WHERE UserCourses.UserID = ?`, [userID], (err, results) => {
            if (err) throw err;
            res.json(results);
        });
});

module.exports = router;
