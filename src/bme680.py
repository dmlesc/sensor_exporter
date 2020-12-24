import board
import busio
import adafruit_bme680

i2c = busio.I2C(board.SCL, board.SDA)
sensor = adafruit_bme680.Adafruit_BME680_I2C(i2c)
sensor_name = 'bme680'

sensor.seaLevelhPa = 1013.25

temperature_celcius = round(sensor.temperature, 2)
temperature_fahrenheit = round(temperature_celcius * 1.8 + 32, 2)
humidity = round(sensor.humidity, 2)
pressure = round(sensor.pressure, 2)
gas = sensor.gas
altitude = round(sensor.altitude, 2)

out = '{"sensor_name":"' + sensor_name + '","metrics":{'
out += '"temperature_celcius":' + str(temperature_celcius)
out +=  ',"temperature_fahrenheit":' + str(temperature_fahrenheit)
out += ',"humidity":' + str(humidity)
out += ',"pressure":' + str(pressure)
out += ',"gas":' + str(gas)
out += ',"altitude":' + str(altitude) + '}'
out += '}'

print(out)