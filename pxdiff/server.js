const http = require('http')
const fs=require('fs')
const url=require('url')
const path=require('path')
const { spawn } = require('child_process')

let MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}

let server = http.createServer((req, res) => {
    serverStatic(req, res)
    resolveData(req, res)
}).listen(3033)

let serverResult = http.createServer(getResult).listen(3044)
function getResult(req, res) {
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    })
    req.on('end', () => {
        console.log(body)
    })
}

function serverStatic(req, res) {
    let filePath
    if(~req.url.indexOf('api')){
        resolveData(req, res)
    } else{
        filePath = "./" + url.parse(req.url).pathname;
        fs.open(filePath, 'r+', function(err){
            if(err){
                send404(res);
            }else{
                let ext = path.extname(filePath);
                ext = ext ? ext.slice(1) : 'unknown';
                let contentType = MIME_TYPE[ext] || "text/plain";
                fs.readFile(filePath,function(err,data){
                    if(err){
                        res.end("<h1>500</h1>服务器内部错误！");
                    }else{
                        res.writeHead(200,{'content-type':contentType});
                        res.end(data.toString());
                    }
                });//fs.readfile
            }
        })//path.exists
    }
}
function resolveData(req, res) {
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
}
function send404(res){
    res.end("<h1 style='text-align:center;'>404</h1><p style='text-align:center;'>file not found</p>")
}
