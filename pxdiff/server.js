const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')
const resemble = require('resemblejs')
const { spawn } = require('child_process')
const querystring = require('querystring')
const multiparty = require('multiparty')
const { host } = require('./host.js')
const MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpg",
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
let resObj = {}
let server = http.createServer((req, res) => {
    serverStatic(req, res)
}).listen(3033)

function serverStatic(req, res) {
    let filePath
    if(~req.url.indexOf('api')){
        let ip = req.socket.remoteAddress.slice(7),
            nowTime = new Date().getTime(),
            id = ip + nowTime
        resObj[id] = res
        console.log('用户ip：' + ip)
        console.log(`------------------------------------------`)
        resolveData(req, res, id)
    } else if(~req.url.indexOf('upload')){
        getResult(req, res)
    } else {
        filePath = "." + url.parse(req.url).pathname
        sendFile(filePath, res)
    }
}

function sendFile(filePath, res) {
    fs.open(filePath, 'r+', function(err){
        console.log(err)
        if(err){
            send404(res)
        }else{
            let ext = path.extname(filePath)
            ext = ext ? ext.slice(1) : 'unknown'
            let contentType = MIME_TYPE[ext] || "text/plain"
            fs.readFile(filePath,function(err,data){
                if(err){
                    send500(res)
                }else{
                    res.writeHead(200,{'content-type':contentType})
                    res.end(data)
                }
            })
        }
    })
}
function resolveData(req, res, id) {
    console.log('开始处理数据')
    console.log(`------------------------------------------`)
    let form = new multiparty.Form()
    form.parse(req, function (err, fields, files) {
        let filename = files['file'][0].originalFilename,
            targetPath = __dirname + '/images/' + filename,
            captureUrl = fields['captureUrl'],
            selector = fields['selector']
        if(filename && captureUrl && selector) {
            fs.createReadStream(files['file'][0].path).pipe(fs.createWriteStream(targetPath))
            let casperjs = spawn('casperjs', ['casper.js', filename, captureUrl, selector, id])
            casperjs.stdout.on('data', (data) => {
                data = data.toString().replace(/[\r\n]/g, "")
                console.log(`数据日志：${data}`)
                 console.log(`------------------------------------------`)
            }) 
        } else {
            let errData = {
                status: 400,
                msg: 'wrong params'
            }
            resObj[id].writeHead(400, {'Content-type':'application/json'})
            resObj[id].end(JSON.stringify(errData))
        }
          
    })
}


function getResult(req, res) { //将抓取结果填写进表单并提交
    let body = ''
    req.on('data', (chunk) => {
        body += chunk
    })
    req.on('end', () => {
        let data = decodeURIComponent(body),
            diffObj = {}
        data.split('&').forEach((item) => {
            diffObj[item.split('=')[0]] = item.split('=')[1]
        })
        diffpx(diffObj, res)
    })
}

function diffpx(diffObj, res) { //像素对比
    let {diff, point, id} = diffObj
    resemble.outputSettings({
        errorColor: {
            red: 255,
            green: 0,
            blue: 0
        },
        errorType: 'movement'
    })
    function complete(data) {
        let imgName = 'diff'+ new Date().getTime() +'.png',
            imgUrl,
            analysisTime = data.analysisTime,
            misMatchPercentage = data.misMatchPercentage,
            resultUrl = './images/' + imgName
        console.log('对比结果完成: 像素差：' + misMatchPercentage + '%；耗时：'+ analysisTime +'ms；\n')
        fs.writeFileSync(resultUrl, data.getBuffer())
        imgObj = {
            status: 200,
            diffUrl: host + '/images/' + imgName,
            pointUrl: host + diff.slice(1),
            analysisTime: analysisTime,
            misMatchPercentage: misMatchPercentage
        }
        let resEnd = resObj[id]
        resEnd.writeHead(200, {'Content-type':'application/json'})
        resEnd.end(JSON.stringify(imgObj))
    }
    let result = resemble(diff).compareTo(point).ignoreColors().onComplete(complete)
}


function send404(res){
    res.end("<h1 style='text-align:center'>404</h1><p style='text-align:center'>file not found</p>")
}
function send500(res){
    res.end("<h1>500</h1>服务器内部错误！")
}
