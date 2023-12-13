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

roversa.onEvent(RoversaPin.P5, RoversaEvent.Down, () => {
    led.plot(4, 2)
})
gamerbit.onEvent(RoversaPin.P5, RoversaEvent.Up, () => {
    led.unplot(4, 2)
})

roversa.onEvent(RoversaPin.P8, RoversaEvent.Down, () => {
    led.plot(4, 4)
})
gamerbit.onEvent(RoversaPin.P8, RoversaEvent.Up, () => {
    led.unplot(4, 4)
})

roversa.onEvent(RoversaPin.P9, RoversaEvent.Down, () => {
    led.plot(4, 0)
})
gamerbit.onEvent(RoversaPin.P9, RoversaEvent.Up, () => {
    led.unplot(4, 0)
})

roversa.onEvent(RoversaPin.P13, RoversaEvent.Down, () => {
    led.plot(0, 2)
})
gamerbit.onEvent(RoversaPin.P13, RoversaEvent.Up, () => {
    led.unplot(0, 2)
})

roversa.onEvent(RoversaPin.P14, RoversaEvent.Down, () => {
    led.plot(2, 2)
})
gamerbit.onEvent(RoversaPin.P14, RoversaEvent.Up, () => {
    led.unplot(2, 2)
})

roversa.onEvent(RoversaPin.P15, RoversaEvent.Down, () => {
    led.plot(1, 4)
})
gamerbit.onEvent(RoversaPin.P15, RoversaEvent.Up, () => {
    led.unplot(1, 4)
})

roversa.onEvent(RoversaPin.P16, RoversaEvent.Down, () => {
    led.plot(1, 0)
})
gamerbit.onEvent(RoversaPin.P16, RoversaEvent.Up, () => {
    led.unplot(1, 0)
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
