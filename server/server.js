const express = require("express");
const { exec } = require("child_process");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = 3001; // Set to a different port if your React app also runs on 3000

// Middleware to parse JSON bodies
app.use(express.json());
// handle cross origin resource sharing errors caused by port forwarding 3000 to 3001 ??
app.use(cors());

// Endpoint to receive parameters and execute the script
app.post('/run-script', (req, res) => {
  const { id, nonce, pass1, pass2, pass3, pass4, hash1, hash2 } = req.body;
  console.log(id, nonce);
  exec(
    `./proof_generation/proof_generation.sh "${pass1}" "${pass2}" "${pass3}" "${pass4}" "${hash1}" "${hash2}" "${id}" "${nonce}"`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send(stderr);
      }
      console.log(stdout);
      const proofFilePath = path.join(__dirname, "proof.json");
      console.log(`Reading proof file from: ${proofFilePath}`);

      try {
        const data = await fs.readFile(proofFilePath, "utf-8");
        const proofJson = JSON.parse(data);
        console.log("Proof JSON:", proofJson);
        res.json(proofJson);
      } catch (readError) {
        console.error(`Error reading proof file: ${readError}`);
        res.status(500).send("Error reading proof file");
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
