'use strict'
process.on('uncaughtException', (err) => { console.log('uncaught', err.stack); })

const { spawn } = require('child_process')

const port = 9113
const ip = '0.0.0.0'
const http = require('http')
const prefix = 'sensor_'

var register = {}

var metrics = {}

metrics.register = (name) => {
  register[name] = {value:0}
}
metrics.set = (name, value) => {
  register[name]['value'] = value
}

metrics.register('temperature_celcius')
metrics.register('temperature_fahrenheit')
metrics.register('humidity')

metrics.server = () => {  

  const server = http.createServer((req, res) => {
    var http_status_code = 200
    var data = ''
  
    if (req.url == '/metrics') {
      const sensor = spawn('python', ['sensor.py'])

      sensor.stdout.on('data', (data) => {
        var sensor_data = JSON.parse(data)

        metrics.set('temperature_celcius', sensor_data.temperature_celcius)
        metrics.set('temperature_fahrenheit', sensor_data.temperature_fahrenheit)
        metrics.set('humidity', sensor_data.humidity)
      })

      sensor.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
      })

      sensor.on('close', (code) => {
        // console.log(`exit code ${code}`)

        data += collectMetrics()

        res.writeHead(http_status_code, { 'Content-Type': 'text/plain' })
        res.end(data)
      })

    }
    else {
      http_status_code = 404
      data = 'not found'

      res.writeHead(http_status_code, { 'Content-Type': 'text/plain' })
      res.end(data)
    }
  })
  
  server.listen(port, ip)
  console.log('metrics', 'ready to serve metrics')
}


function collectMetrics() {
  var text = ''
        
  Object.keys(register).forEach( (metric_name) => {
    var name = prefix + metric_name
    var metric = register[metric_name]

    text += name + ' ' + metric['value'] + '\n'
  })

  return text
}

metrics.server()