import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as fs from 'fs';
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Endpoint to check if the server is running
app.get('/ping', (req: Request, res: Response) => {
    res.json({ success: true });
});

// Endpoint to submit a form
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    // Load submissions from database.json
    let submissions: any[] = [];
    try {
        const data = fs.readFileSync('database.json', 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        console.error('Error reading database.json:', err);
    }

    // Add new submission
    const newSubmission = { name, email, phone, github_link, stopwatch_time };
    submissions.push(newSubmission);

    // Write submissions back to database.json
    fs.writeFileSync('database.json', JSON.stringify(submissions, null, 2), 'utf8');

    // Return success response
    res.json({ success: true, message: 'Submission saved successfully' });
});

// Endpoint to read a form submission by index
app.get('/read', (req: Request, res: Response) => {
    const { index } = req.query;

    // Load submissions from database.json
    let submissions: any[] = [];
    try {
        const data = fs.readFileSync('database.json', 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        console.error('Error reading database.json:', err);
    }

    // Check if index is valid
    const idx = parseInt(index as string, 10);
    if (idx < 0 || idx >= submissions.length) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Return the submission
    res.json({ success: true, submission: submissions[idx] });
});

// Endpoint to edit a form submission by index
app.put('/edit/:index', (req: Request, res: Response) => {
    const { index } = req.params;
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    // Load submissions from database.json
    let submissions: any[] = [];
    try {
        const data = fs.readFileSync('database.json', 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        console.error('Error reading database.json:', err);
    }

    // Check if index is valid
    const idx = parseInt(index, 10);
    if (idx < 0 || idx >= submissions.length) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Update the submission
    submissions[idx] = { name, email, phone, github_link, stopwatch_time };

    // Write submissions back to database.json
    fs.writeFileSync('database.json', JSON.stringify(submissions, null, 2), 'utf8');

    // Return success response
    res.json({ success: true, message: 'Submission updated successfully' });
});

// Endpoint to delete a form submission by index
app.delete('/delete/:index', (req: Request, res: Response) => {
    const { index } = req.params;

    // Load submissions from database.json
    let submissions: any[] = [];
    try {
        const data = fs.readFileSync('database.json', 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        console.error('Error reading database.json:', err);
    }

    // Check if index is valid
    const idx = parseInt(index, 10);
    if (idx < 0 || idx >= submissions.length) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Remove the submission
    submissions.splice(idx, 1);

    // Write submissions back to database.json
    fs.writeFileSync('database.json', JSON.stringify(submissions, null, 2), 'utf8');

    // Return success response
    res.json({ success: true, message: 'Submission deleted successfully' });
});

// Endpoint to search for a form submission by email
app.get('/search', (req: Request, res: Response) => {
    const { email } = req.query;

    // Load submissions from database.json
    let submissions: any[] = [];
    try {
        const data = fs.readFileSync('database.json', 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        console.error('Error reading database.json:', err);
    }

    // Find submissions by email
    const foundSubmissions = submissions.filter(submission => submission.email === email);

    // Return the submissions
    res.json({ success: true, submissions: foundSubmissions });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
