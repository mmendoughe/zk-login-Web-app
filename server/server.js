const express = require('express');
const { exec } = require('child_process');
const cors = require ('cors');

const app = express();
const port = 3001; // Set to a different port if your React app also runs on 3000

// Middleware to parse JSON bodies
app.use(express.json());
// handle cross origin resource sharing errors caused by port forwarding 3000 to 3001 ??
app.use(cors());

// Endpoint to receive parameters and execute the script
app.post('/run-script', (req, res) => {
    const {id, proof, contract} = req.body;
    exec(`./proof_generation/proof_generation.sh "${id}" "${proof}" "${contract}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(stderr);
        }
        console.log(stdout);
        res.send(stdout);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});