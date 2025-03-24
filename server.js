const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');

let arr = [];
const server = http.createServer((req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };

    let body = '';

    req.on('data', (chunk) => {
        body += chunk;
    });

    if (req.url === '/todos' && req.method === 'GET') {
        res.writeHead(200, headers);
        const data = {
            "code": "success",
            "data": arr,
        };
        res.end(JSON.stringify(data));
    } else if (req.url === '/todos' && req.method === 'POST') {
        req.on('end', () => {
            try {
                const title = JSON.parse(body).title;
                if (title !== undefined) {
                    res.writeHead(200, headers);
                    arr.push({
                        title: title,
                        id: uuidv4(),
                    });
                    const data = {
                        status: 'success'
                    };
                    res.end(JSON.stringify(data));
                }
            } catch (err) {
                errorHandle(res);
            }
        });
    } else if (req.url === '/todos' && req.method === 'DELETE') { // delete全部
        try {
            res.writeHead(200, headers);
            arr = [];
            const data = {
                status: 'success',
            };
            res.end(JSON.stringify(data));
        } catch (err) {
            res.writeHead(400, headers);
            const data = {
                status: 'failed',
            };
            res.end(JSON.stringify(data));
        }
    } else if (req.url.startsWith('/todos/') && req.method === 'DELETE') { // delete單筆
        const id = req.url.split('/').pop();
        if (id !== undefined) {
            res.writeHead(200, headers);
            arr = arr.filter((ele) => ele.id !== id);
            const data = {
                status: 'success',
            };
            res.end(JSON.stringify(data));
        }
    } else if (req.url === '/todos' && req.method === 'PATCH') {
        req.on('end', () => {
            try {
                res.writeHead(200, headers);
                const { title, id } = JSON.parse(body);
                if (title !== undefined && id !== undefined) {
                    arr.forEach((item) => {
                        if (item.id === id) {
                            item.title = title;
                        }
                    });
                    const data = {
                        status: 'success',
                        data: arr,
                    };
                    res.end(JSON.stringify(data));
                } else {
                    errorHandle(res);
                }
            } catch (err) {
                errorHandle(res);
            }
        });
    } else {
        res.writeHead(404, headers);
        const data = {
            status: '404',
            message: '無此 api',
        };
        res.end(JSON.stringify(data));
    }
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server running at http://localhost:3000/');
});