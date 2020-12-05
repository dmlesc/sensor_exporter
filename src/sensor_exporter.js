'use strict'
process.on('uncaughtException', (err) => { console.log('uncaught: ', err.stack) })

const http = require('http')
const { spawn } = require('child_process')

const port = 9113
const ip = '0.0.0.0'
const prefix = 'sensor_'

var register = {}

function register_metric (name) {
  register[name] = 0
}

function set_metric (name, value) {
  register[name] = value
}

function metrics_assemble () {
  var text = ''
        
  Object.keys(register).forEach( (metric_name) => {
    var name = prefix + metric_name
    text += name + ' ' + register[metric_name] + '\n'
  })

  return text
}


register_metric('temperature_celcius')
register_metric('temperature_fahrenheit')
register_metric('humidity')


const server = http.createServer((req, res) => {
  if (req.url == '/metrics') {
    const sensor = spawn('python', ['sensor.py'])

    sensor.stdout.on('data', (data) => {
      var sensor_data = JSON.parse(data)

      set_metric('temperature_celcius', sensor_data.temperature_celcius)
      set_metric('temperature_fahrenheit', sensor_data.temperature_fahrenheit)
      set_metric('humidity', sensor_data.humidity)
    })

    sensor.stderr.on('data', (data) => { console.error(`stderr: ${data}`) })

    sensor.on('close', (code) => { // console.log(`exit code ${code}`)
      var response_text = metrics_assemble()

      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end(response_text)
    })

  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('not found')
  }
})

server.listen(port, ip)
console.log('ready to serve sensor data')