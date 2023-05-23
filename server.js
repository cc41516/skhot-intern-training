import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// 获取__filename
function getCurrnetFile () {
    return fileURLToPath(import.meta.url);
}
// 获取__dirname
function getCurrnetDir () {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    return __dirname;
}

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
const __dirname = getCurrnetDir();

app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})

server.listen(port, () => {
	console.log('Listening on port ' + port);
})