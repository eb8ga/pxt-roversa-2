// tests go here; this will not be compiled when this package is used as a library

// go right 90 degrees
input.onButtonPressed(Button.A, () => {
    roversa.turnRight(90);
})
// go forward 10
input.onButtonPressed(Button.B, () => {
    roversa.driveForwards(10);
})
// stop
input.onButtonPressed(Button.AB, () => {
    roversa.stop
})

basic.forever(() => {
    if (roversa.isPressed(RoversaPin.P5))
        led.scroll("P5 - Enter");
    if (roversa.isPressed(RoversaPin.P8))
        led.scroll("P8 - Play");
    if (roversa.isPressed(RoversaPin.P9))
        led.scroll("P9 - Stop");
    if (roversa.isPressed(RoversaPin.P13))
        led.scroll("P13 - Forward");
    if (roversa.isPressed(RoversaPin.P14))
        led.scroll("P14 - Reverse");
    if (roversa.isPressed(RoversaPin.P15))
        led.scroll("P15 - Right");
    if (roversa.isPressed(RoversaPin.P16))
        led.scroll("P16 - Left");
})
