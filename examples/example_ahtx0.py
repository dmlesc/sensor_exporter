import board
import adafruit_ahtx0

sensor = adafruit_ahtx0.AHTx0(board.I2C())

print("temperature: %0.1f C" % sensor.temperature)
print("humidity: %0.1f %%" % sensor.relative_humidity)

print(sensor.temperature)
print(sensor.relative_humidity)