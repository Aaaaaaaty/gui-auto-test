const http = require('http')
const resemble = require('resemblejs')
const fs = require('fs')

let serverResult = http.createServer(getResult).listen(3044)
function getResult(req, res) {
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
    	diffpx(diffObj)
    })
}

function diffpx(diffObj) {
	let {diff, point} = diffObj
	resemble.outputSettings({
	    errorColor: {
	        red: 255,
	        green: 0,
	        blue: 0
	    },
	    errorType: 'movement',
	})
	var result = resemble(diff).compareTo(point).ignoreColors().onComplete((data) => {
	    console.log('对比结果完成')
		fs.writeFileSync('./images/output.png', data.getBuffer());
	})
}