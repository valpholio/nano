const http = require('http');
const nano = require('nano');
const couchdb = nano('http://da:123@127.0.0.1:5984/');

const hostname = '127.0.0.1';
const port = 3000;

const initdb = ()=> {
    couchdb.db.create('books', (error)=> {
        if (error) {
            console.log(error);
        }
        const books = couchdb.use('books');
        books.insert({ title: 'New book'}, '001').then((body) => {
            console.log('New book:');
            console.log(body);
            books.insert({ title: 'Another book'}, '002').then((body) => {
                console.log('Another book:');
                console.log(body);
                books.insert({ title: 'Blue book'}, '003').then((body) => {
                    console.log('Blue book:');
                    console.log(body);
                    const keys = ['001', '002', '003'];
                    books.fetch({keys: keys}).then((data) => {
                        console.log(data);
                    });
                });
            });
        });
    });
};

couchdb.db.destroy('books').then((body) => {
    initdb();
});

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
