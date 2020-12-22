import board
import adafruit_ahtx0

sensor = adafruit_ahtx0.AHTx0(board.I2C())
sensor_name = 'aht20'

temperature_celcius = round(sensor.temperature, 2)
temperature_fahrenheit = round(temperature_celcius * 1.8 + 32, 2)
humidity = round(sensor.relative_humidity, 2)

out = '{"sensor_name":"' + sensor_name + '","metrics":{'
out += '"temperature_celcius":' + str(temperature_celcius)
out +=  ',"temperature_fahrenheit":' + str(temperature_fahrenheit)
out += ',"humidity":' + str(humidity) + '}'
out += '}'

print(out)