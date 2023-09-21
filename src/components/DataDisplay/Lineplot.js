const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // 假设 clocker 的值是 1
    const clocker = 1;
    const jsonFilePath = `./src/data/log/time${clocker}.json`;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('There was an error reading the JSON file:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            // 在这里处理加载到的 JSON 数据，它存储在 jsonData 变量中
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jsonData));
            console(jsonData)
        } catch (error) {
            console.error('There was an error parsing JSON:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    });
});

const port = 8080; // 设置服务器端口号
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
