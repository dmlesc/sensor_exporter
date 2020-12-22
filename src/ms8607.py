import board
import busio
from adafruit_ms8607 import MS8607

i2c = busio.I2C(board.SCL, board.SDA)
sensor = MS8607(i2c)
sensor_name = 'ms8607'

pressure = sensor.pressure
temperature_celcius = round(sensor.temperature, 2)
temperature_fahrenheit = round(temperature_celcius * 1.8 + 32, 2)
humidity = round(sensor.relative_humidity, 2)

out = '{"sensor_name":"' + sensor_name + '","metrics":{'
out += '"temperature_celcius":' + str(temperature_celcius)
out +=  ',"temperature_fahrenheit":' + str(temperature_fahrenheit)
out += ',"humidity":' + str(humidity)
out += ',"pressure":' + str(pressure) + '}'
out += '}'

print(out)