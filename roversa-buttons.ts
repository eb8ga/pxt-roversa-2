namespace gamerbit {
      let initialized = false;
      function init() {
        if (initialized) return;
        pins.pushButton(DigitalPin.P5)
        pins.pushButton(DigitalPin.P8)
        pins.pushButton(DigitalPin.P9)
        pins.pushButton(DigitalPin.P13)
        pins.pushButton(DigitalPin.P14)
        pins.pushButton(DigitalPin.P15)
        pins.pushButton(DigitalPin.P16)
        initialized = true;
    }
}
