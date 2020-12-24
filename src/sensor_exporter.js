'use strict'
process.on('uncaughtException', (err) => { console.error('uncaught: ', err.stack) })

const http = require('http')
const { spawn } = require('child_process')

const port = 9113
const ip = '0.0.0.0'
const prefix = 'sensor_'
const sensors = ['aht20.py', 'ms8607.py', 'bme680.py']

const server = http.createServer((req, res) => {
  if (req.url == '/metrics') {
    var text = ''
    var complete = 0

    sensors.forEach( (sensor) => {
      const process = spawn('python', [sensor])

      process.stdout.on('data', (data) => {
        var sensor_data = JSON.parse(data)
        var sensor_name = sensor_data.sensor_name
        var metrics = sensor_data.metrics
  
        Object.keys(metrics).forEach( (name) => {
          var value = metrics[name]
          text += prefix + name + '{sensor_name="' + sensor_name + '"} ' + value + '\n'
        })
      })
  
      process.stderr.on('data', (data) => { console.error(`stderr: ${data}`) })

      process.on('close', (code) => { /*console.log(`exit code ${code}`*/
        if (++complete == sensors.length) {
          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.end(text)
        }
      })
    })
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('not found')
  }
})

server.listen(port, ip)
console.log('ready to serve sensor data')