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
    if (gamerbit.isPressed(RoversaPin.P5))
        led.scroll("P5 - Enter");
    if (gamerbit.isPressed(RoversaPin.P8))
        led.scroll("P8 - Play");
    if (gamerbit.isPressed(RoversaPin.P9))
        led.scroll("P9 - Stop");
    if (gamerbit.isPressed(RoversaPin.P13))
        led.scroll("P13 - Forward");
    if (gamerbit.isPressed(RoversaPin.P14))
        led.scroll("P14 - Reverse");
    if (gamerbit.isPressed(RoversaPin.P15))
        led.scroll("P15 - Right");
    if (gamerbit.isPressed(RoversaPin.P16))
        led.scroll("P16 - Left");
})
