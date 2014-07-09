<!--generated by https://github.com/tcr/markdocs-->

# Tessel API Documentation

Documentation for Tessel's hardware APIs. These are available for code running on Tessel, and is imported by `require('tessel')`.

### Contents

* [Ports and LEDs (Tessel)](#tessel)
* [Pins and Buttons](#pins)
* [SPI](#spi)
* [I2C](#i2c)
* [UART](#uart)
* [System](#system)


### Tessel

Tessel is the root object for each of the different ports on the device.

```js
var tessel = require('tessel'); // import tessel
var gpio = tessel.port['GPIO']; // select the GPIO port
gpio.digital[1].write(1);  // turn digital pin #1 high
```


&#x20;<a href="#api-map-Port-tessel-port" name="api-map-Port-tessel-port">#</a> <i>map&lt;Port&gt;</i>&nbsp; tessel<b>.port</b> = {}  
A list of ports available on Tessel. Keys for this are `"A"`, `"B"`, `"C"`, `"D"`, or `"GPIO"`.

&#x20;<a href="#api-array-Pin-tessel-led" name="api-array-Pin-tessel-led">#</a> <i>array&lt;Pin&gt;</i>&nbsp; tessel<b>.led</b> = []  
An array of 4 LEDs available on the Tessel board. These are [`Pin` objects](#pins). Their board order is different than their array index order; they're in rainbow order on the board. See below:

| Index | Position (from micro-USB) | Color | Name  |
|-------| ------------------------- | ----- | ----- |
|   0   | 3rd                       | Green | LED1  |
|   1   | 4th                       | Blue  | LED2  |
|   2   | 1st                       | Red   | Error |
|   3   | 2nd                       | Amber | Conn  |

```js
// Toggle an LED every 200ms
(function blink (value) {
  tessel.led[1].write(value);
  setTimeout(blink, 200, !value);
})(true)
```


### Pins

GPIO access for digital and analog signal lines. Each port exposes its available pins through the `.pin`, `.digital`, `.analog`, and `.pwm` arrays.

```js
var tessel = require('tessel'); // import tessel
var gpio = tessel.port['GPIO']; // select the GPIO port
gpio.digital.map(function (pin, i) {
  console.log('Value of digital pin', i, '=', pin.read());
})
gpio.analog.map(function (pin, i) {
  console.log('Value of analog pin', i, '=', pin.read() * pin.resolution, '/', pin.resolution);
})
```


Ports A, B, C, and D have 3 digital pins which can be addressed as such:  


```js
tessel.port['A'].digital[0];
tessel.port['A'].digital[1];
tessel.port['A'].digital[2];
```

Additionally the pins can be addressed by the silkscreen printed on Tessel:  


```js
tessel.port['A'].pin['G1']; // this is the same as digital[0]
tessel.port['A'].pin['G2']; // this is the same as digital[1]
tessel.port['A'].pin['G3']; // this is the same as digital[2]
```


&#x20;<a href="#api-string-port-id" name="api-string-port-id">#</a> <i>string</i>&nbsp; port<b>.id</b>  
The unique ID of this port. On Tessel, this would be one of `"A"`, `"B"`, `"C"`, `"D"`, or `"GPIO"`.

&#x20;<a href="#api-array-number-port-digital" name="api-array-number-port-digital">#</a> <i>array&lt;number&gt;</i>&nbsp; port<b>.digital</b> = []  
An array of which pins are digital inputs/outputs. Has 3 pins for ports A, B, C, and D and 6 pins for the GPIO port.

&#x20;<a href="#api-array-number-port-analog" name="api-array-number-port-analog">#</a> <i>array&lt;number&gt;</i>&nbsp; port<b>.analog</b> = []  
An array of which pins are analog inputs. Is only available on the GPIO port.

&#x20;<a href="#api-array-number-port-pwm" name="api-array-number-port-pwm">#</a> <i>array&lt;number&gt;</i>&nbsp; port<b>.pwm</b> = []  
An array of which pins are PWM outputs (may overlap analog array).

&#x20;<a href="#api-number-port-pwmFrequency" name="api-number-port-pwmFrequency">#</a> port<b>.pwmFrequency</b> ( frequency )  
Sets the frequency of PWM for a given port. Only the GPIO bank supports PWM pins on Tessel.

&#x20;<a href="#api-array-number-port-pin" name="api-array-number-port-pin">#</a> <i>array&lt;number&gt;</i>&nbsp; port<b>.pin</b> = []  
An array of all pins on the port. You can differentiate them by their `.type` and `.isPWM` attributes.

&#x20;<a href="#api-new-port-Pin-pin" name="api-new-port-Pin-pin">#</a> <i>new</i>&nbsp; port<b>.Pin</b> ( pin )  
Create and return `pin` object.

&#x20;<a href="#api-string-pin-type" name="api-string-pin-type">#</a> <i>string</i>&nbsp; pin<b>.type</b>  
"digital" or "analog".

&#x20;<a href="#api-number-pin-resolution" name="api-number-pin-resolution">#</a> <i>number</i>&nbsp; pin<b>.resolution</b>  
Digital pins: 1. Analog pins: ADC resolution of output pins ( e\.g\. 1023 for Tessel ).

&#x20;<a href="#api-pin-input" name="api-pin-input">#</a> pin<b>.input</b>()  
Set `pin` to be an input.

&#x20;<a href="#api-pin-output-value" name="api-pin-output-value">#</a> pin<b>.output</b> ( value )  
Set `pin` to be an output with value `value`. Note that the Analog pins cannot be outputs.

&#x20;<a href="#api-pin-rawDirection-isOutput" name="api-pin-rawDirection-isOutput">#</a> pin<b>.rawDirection</b>( isOutput )  
Set `pin` as input or output.

&#x20;<a href="#api-pin-write-value" name="api-pin-write-value">#</a> pin<b>.write</b> ( value )  
Behaves the same as `pin.output`. Sets pin as an output with `value`. Digital pins: output is set HIGH if `value` is truthy, otherwise LOW.

&#x20;<a href="#api-pin-pwmDutyCycle-value" name="api-pin-pwmDutyCycle-value">#</a> pin<b>.pwmDutyCycle</b> ( dutyCycleFloat )  
Creates a PWM signal with a duty cycle of `dutyCycleFloat`, the fraction of the PWM period in which the signal is high. Range is between [0-1] inclusive. Only works with pins with true property of `isPWM`.

&#x20;<a href="#api-pin-rawWrite-value" name="api-pin-rawWrite-value">#</a> pin<b>.rawWrite</b> ( value )  
Sets the pin to `value`. Does not change the direction of the pin.

&#x20;<a href="#api-pin-read" name="api-pin-read">#</a> pin<b>.read</b> ()  
Sets the pin as an input and reads a digital or analog `value`. For digital pins, `1` is returned if the value is HIGH, otherwise `0` if LOW. For analog pins the range is between [1-0] inclusive.

&#x20;<a href="#api-pin-rawRead" name="api-pin-rawRead">#</a> pin<b>.rawRead</b> ()  
Reads from the pin ***without** first setting the direction as an input. Only available on digital pins.

&#x20;<a href="#api-pin-pull-mode" name="api-pin-pull-mode">#</a> pin<b>.pull</b> ( mode )  
Sets the pin as a pullup, pulldown, or neutral pin. Mode is one of `pullup`, `pulldown` or `none`. Passing in no argument is equivalent to `none`.

&#x20;<a href="#api-pin-mode" name="api-pin-mode">#</a> pin<b>.mode</b> ()  
Returns the mode of the pin.

External GPIO Interrupts can be used much like regular Node EventEmitters. There are seven external interrupts you can work with. You can read more in depth discussion about gpio interrupts in [our External GPIO Walkthrough](https://github.com/tessel/docs/blob/master/detailedWalkthroughs/gpioInterrupts.md).

&#x20;<a href="#api-pin-on-type-callback-time-type" name="api-pin-watch-type-callback-time-type">#</a> pin<b>.on</b> ( type, callback(time, type) )  
Sets a listener for a signal edge on `pin`. `time` is the milliseconds since boot up and `type` can be one of `rise`, `fall`, `change`. The `high` and `low` level triggers cannot be used with `on` because they would fire repeatedly and wreak havoc on the runtime.

&#x20;<a href="#api-pin-once-type-callback-time-type" name="api-pin-once-type-callback-time-type">#</a> pin<b>.once</b> ( type, callback(time, type) )  
Sets a listener for a a single event of the trigger type on the `pin`. `time` is the milliseconds since boot up and `type` can be one of `rise`, `fall`, `change`, `high`, or `fall`.

&#x20;<a href="#api-pin-removeListener-type-listener" name="api-pin-removeListener-type-listener">#</a> pin<b>.removeListener</b> ( type, listener )  
Removes the `listener` callback for a given `type` of trigger (eg. 'rise' or 'high') on a pin.

&#x20;<a href="#api-pin-removeListener-type-listener" name="api-pin-removeListener-type-listener">#</a> pin<b>.removeAllListeners</b> ( type )  
Removes all of the listeners for a given trigger `type` on a `pin`.

### Buttons

Tessel has two buttons. The `reset` button (nearer to the edge of the board) will stop running any program that is currently executing and restart the microcontroller (erasing any memory in RAM).

The `config` button will eventually be used for other purposes but is currently a simple way to get user feedback into a script:
```js
var tessel = require('tessel');

tessel.button.on('press', function(time) {
  console.log('the button was pressed!', time);
});

tessel.button.on('release', function(time) {
  console.log('button was released', time);
});
```
Please note that the button `press` and `release` events will use one of the seven External GPIO Interrupts (for one or both events).

The buttons can also be used to put the board into DFU Mode which can be understood as the stage just prior to reprogramming the board. This is useful if the board is no longer able to communicate like typical with a host computer. To activate DFU mode, hold down the `config` button while pressing and releasing the `reset` button so that the `config` button is pressed down when the board comes out of a reset. Then release the `config button`.

### SPI

A SPI channel.

```js
var port = tessel.port['A'];
var spi = new port.SPI({
  clockSpeed: 4*1000*1000, // 4MHz
  cpol: 1, // polarity
  cpha: 0, // clock phase
});

spi.transfer(new Buffer([0xde, 0xad, 0xbe, 0xef]), function (err, rx) {
  console.log('buffer returned by SPI slave:', rx);
})

```


&#x20;<a href="#api-new-port-SPI-options" name="api-new-port-SPI-options">#</a> <i>new</i>&nbsp; port<b>.SPI</b> ( [options] )  
Creates a SPI object. Options is an object specifying any of the following:

* **channel** (optional) &mdash; An optional numeric index for selecting a SPI channel. Defaults to the first (or only) SPI channel.
* **clockSpeed** (default `100000`) &mdash; SPI clock speed in Hz.
* **cpol** (default `0`) &mdash; Clock polarity. Options are 0 or 1, or 'low' and 'high'.
* **cpha** (default `0`) &mdash; Clock phase. Options are 0 or 1, or 'first' and 'second'.
* **dataMode** (default `0`) &mdash; An alternative to defining **cpol** and **cpha** explicitly, you can [use mode numbers](http://en.wikipedia.org/wiki/Serial_Peripheral_Interface_Bus#Mode_numbers).
* **bitOrder** (default `"msb"`) &mdash; Bit order, most significant bit first or least. Options are 'msb' or 'lsb'.
* **frameMode** (default `"normal"`) &mdash; SPI frame format. Only one format is supported at the moment, `"normal"`.
* **chipSelect** (default `null`) &mdash; Pin to use as a default chip select pin. If a pin is specified, this pin is toggled in master mode whenever data is to be sent/received on the bus.
* **chipSelectActive** (default `"low"`) &mdash; If a **chipSelect** pin is specified, this defines the polarity of the CS line when *active*.
* **role** (default `master`) &mdash; Determines the role the SPI channel plays, either "master" or "slave". (Currently not supported.)

&#x20;<a href="#api-spi-transfer-txbuf-callback-err-rxbuf" name="api-spi-transfer-txbuf-callback-err-rxbuf">#</a> spi<b>.transfer</b> ( txbuf, callback(err, rxbuf) )  
Transfers a Buffer `txbuf` to the slave and receives a response in `rxbuf`.

&#x20;<a href="#api-spi-receive-len-callback-err-rxbuf" name="api-spi-receive-len-callback-err-rxbuf">#</a> spi<b>.receive</b> ( len, callback(err, rxbuf) )  
Reads `len` bytes from a slave. Returns a buffer.

&#x20;<a href="#api-spi-send-txbuf-callback-err" name="api-spi-send-txbuf-callback-err">#</a> spi<b>.send</b> ( txbuf, callback(err) )  
Sends a Buffer `txbuf` to the slave.

&#x20;<a href="#api-spi-setClockSpeed-clockspeed" name="api-spi-setClockSpeed-clockspeed">#</a> spi<b>.setClockSpeed</b> ( clockspeed )
Sets the clockspeed.

&#x20;<a href="#api-spi-setDataMode-mode" name="api-spi-setDataMode-mode">#</a> spi<b>.setDataMode</b> ( mode )
Sets the data mode.

&#x20;<a href="#api-spi-setFrameMode-mode" name="api-spi-setFrameMode-mode">#</a> spi<b>.setFrameMode</b> ( mode )
Sets the frame mode.

&#x20;<a href="#api-spi-setRole-role" name="api-spi-setRole-role">#</a> spi<b>.setRole</b> ( role )
Sets the role.

&#x20;<a href="#api-spi-setChipSelectMode-mode" name="api-spi-setChipSelectMode-mode">#</a> spi<b>.setChipSelectMode</b> ( mode )
Sets the chip select settings.

&#x20;<a href="#api-spi-lock-callback" name="api-spi-lock-callback">#</a> spi<b>.lock</b> ( callback )
Locks SPI so that only one SPI port is communicating at a time. To read more about SPI Bus Locking, check out our discussion about the [Bus Locking and Raw Transfers API](https://github.com/tessel/docs/blob/master/detailedWalkthroughs/spiLocksRawTransfers.md).


### I2C

An I2C channel.

```js
var port = tessel.port['A'];
var slaveAddress = 0xDE;
var i2c = new port.I2C(slaveAddress)
i2c.transfer(new Buffer([0xde, 0xad, 0xbe, 0xef]), function (err, rx) {
  console.log('buffer returned by I2C slave ('+slaveAddress.toString(16)+'):', rx);
})
```


&#x20;<a href="#api-new-port-I2C-address-idx" name="api-new-port-I2C-address-idx">#</a> <i>new</i>&nbsp; port<b>.I2C</b> ( address, [idx] )  
Creates an I2C channel for a device of a specific `address`. Multiple I2C channels can be used in parallel.

&#x20;<a href="#api-i2c-transfer-txbuf-rxbuf_len-callback-err-rxbuf" name="api-i2c-transfer-txbuf-rxbuf_len-callback-err-rxbuf">#</a> i2c<b>.transfer</b> ( txbuf, rxbuf_len, callback(err, rxbuf) )  
Transfers a Buffer `txbuf` to the client and receives a response of length `rxbuf_len`.

&#x20;<a href="#api-i2c-receive-rxbuf_len-callback-err-rxbuf" name="api-i2c-receive-rxbuf_len-callback-err-rxbuf">#</a> i2c<b>.receive</b> ( rxbuf_len, callback(err, rxbuf) )  
Reads `rxbuf_len` bytes from a client.

&#x20;<a href="#api-i2c-send-txbuf-callback-err" name="api-i2c-send-txbuf-callback-err">#</a> i2c<b>.send</b> ( txbuf, callback(err) )  
Sends a Buffer `txbuf` to the client.

### UART

A UART channel.

```js
var port = tessel.port['A'];
var uart = new port.UART({
  baudrate: 115200
})

uart.write('ahoy hoy\n')
uart.on('data', function (data) {
  console.log('received:', data);
})

// UART objects are streams!
// pipe all incoming data to stdout:
uart.pipe(process.stdout);
})
```


&#x20;<a href="#api-new-port-UART-idx-options-implements-DuplexStream" name="api-new-port-UART-idx-options-implements-DuplexStream">#</a> <i>new</i>&nbsp; port<b>.UART</b> ( [idx[, options]] ) implements DuplexStream  
Creates a UART channel. Defaults: `{"baudrate": 9600, "dataBits": 8, "parity": "even", "stopBits": 2}`

&#x20;<a href="#api-array-number-uart-baudRates" name="api-array-number-uart-baudRates">#</a> <i>array&lt;number&gt;</i>&nbsp; uart<b>.baudRates</b> = []  
An array of valid baud rates supported by the system.

&#x20;<a href="#api-uart-setBaudRate-rate" name="api-uart-setBaudRate-rate">#</a> uart<b>.setBaudRate</b> ( rate )  
Sets the baud `rate` to a valid rate in `baudRates`.

&#x20;<a href="#api-uart-setDataBits-bits" name="api-uart-setDataBits-bits">#</a> uart<b>.setDataBits</b> ( bits )  
Sets the number of data `bits` to the number 5, 6, 7, or 8.

&#x20;<a href="#api-uart-setStopBits-bits" name="api-uart-setStopBits-bits">#</a> uart<b>.setStopBits</b> ( bits )  
Sets the number of data `bits` to the number 1 or 2.

&#x20;<a href="#api-uart-setParity-parity" name="api-uart-setParity-parity">#</a> uart<b>.setParity</b> ( parity )  
Sets the `parity` to the value "none", "odd", or "even".

&#x20;<a href="#api-uart-write-buf" name="api-uart-write-buf">#</a> uart<b>.write</b> ( buf )  
Writes a buffer to the UART connection.

&#x20;<a href="#api-uart-emits-data" name="api-uart-emits-data">#</a> uart &rarr; <i>emits "data"</i>  
Data that arrives over the UART channel is sent as a Node.js stream.

<!--/markdocs:generated-->

### System

&#x20;<a href="#api-process-sendfile-filename-buf" name="api-process-sendfile-filename-buf">#</a> process<b>.sendfile</b> ( filename, buffer )  A `buffer` can be sent over USB to a file named `filename` on a host computer's file system. You must start the script with -u and the argument of which directory to save the folder. For example, `tessel run test.js -u ./recordings` will save the file in the recordings directory.

&#x20;<a href="#api-deviceId" name="api-deviceId">#</a> tessel<b>.deviceId</b> (  )  Get the Inique ID of your Tessel.

## License

MIT