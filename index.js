const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const path = require('path')
const fs = require('fs')

app.post('/transcribe',upload.single('file'), (req, res) => {
 var dataToSend;
 fs.copyFileSync(path.join('uploads', req.file.filename), path.join('./',req.file.originalname))
 fs.unlinkSync(req.file.path)
 const python = spawn('python3', ['runTranscribe.py', req.file.originalname]);
 python.stdout.on('data', function (data) {
  dataToSend = data.toString();
 });

 python.on('close', (code) => {
  fs.unlinkSync(req.file.originalname)
  fs.unlinkSync(path.basename(req.file.originalname, path.extname(req.file.originalname))req.file.originalname)
  res.send({text: dataToSend})
 });
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
