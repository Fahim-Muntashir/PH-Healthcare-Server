import { Server } from 'http';
import app from './app';

const port = 3000;

async function main() {
    const server: Server = app.listen(port, () => {
        console.log("server listening on port " + port);
    })
}
main()