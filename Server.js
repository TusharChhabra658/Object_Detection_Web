const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/process', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.json({ success: false });
    }

    const inputVideoPath = path.join(__dirname, 'temp_video.mp4');
    require('fs').writeFileSync(inputVideoPath, req.file.buffer);

    const pythonScriptPath = 'image.py'; 
    exec(`python ${pythonScriptPath} ${inputVideoPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.json({ success: false });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
