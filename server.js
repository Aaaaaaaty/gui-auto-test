const http = require('http')
const { spawn } = require('child_process');
let server = http.createServer((req, res) => {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    })
    req.on('end', () => {
        let result = body.split('&'),
            captureUrl  = '',
            selector = ''
        result.forEach((item, index) => {
            switch (item.split('=')[0])
                {
                    case 'captureUrl':
                        captureUrl = item.split('=')[1]
                    case 'selector':
                        selector = item.split('=')[1]
                }
        })
        let casperjs = spawn('casperjs', ['casper.js', captureUrl, selector]);
        casperjs.stdout.on('data', (data) => {
            console.log(`输出：${data}`);
        });        
        casperjs.on('close', (code) => {
            console.log(`子进程退出码：${code}`);
        });
    })
}).listen(3033)
