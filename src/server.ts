import http from 'http';
import app from './app';
import "dotenv/config";

const url = process.env.URL;
const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on ${url}:${port}`);
    console.log(`Swagger docs: ${url}:${port}/docs`);
})