import board
import adafruit_ahtx0

sensor = adafruit_ahtx0.AHTx0(board.I2C())

temperature_celcius = round(sensor.temperature, 1)
temperature_fahrenheit = round(temperature_celcius * 1.8 + 32, 1)
humidity = round(sensor.relative_humidity, 1)

out = '{"temperature_celcius":' + str(temperature_celcius)
out +=  ',"temperature_fahrenheit":' + str(temperature_fahrenheit)
out += ',"humidity":' + str(humidity) + '}'

print(out)