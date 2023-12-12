# Roversa PXT Extension for MakeCode
More info for Roversa can be found on the [Roversa](https://www.globalcsed.org/tools.html) page at GlobalCSED.

## Roversa

![roversa v2.1](https://github.com/GlobalCSEd/roversa/blob/main/RAW_PICS/roversa%20v2.2-Getting%20Started%20GuideBCKGND.png?raw=true)

### Buttons

```block
roversa.isPressed(RoversaPin.P5)
```

Roversa button `isPressed` allows users to select any of the 7 buttons mapped to the micro:bit on Roversa. Buttons include FWD, REV, LEFT, RIGHT, STOP, ENTER, PLAY. Users can make these buttons do anything in Blocks and Javascript

```block
roversa.onEvent(RoversaPin.P5, RoversaEvent.Down, function() {
    basic.showString("Hello!")
})
```

Roversa button "on" allows users to select any of the above buttons and create an event on the button down, up, or click. In the above example when you push the Enter button on Pin 5 the LED display the string "Hello".

### Calibrate

```block
roversa.biasDriving(50)
```

Users can use bias to ensure that the servos are moving in a similar fashion. This will allow users to change the left or right motor regardless of trim. 0-50 adjust the left motor, 50-100 adjusts the right motor.

Users can also adjust the amount of degrees per turn and amount of mm per second when using future function like turning a certain number of degrees or moving a specified distance. This ensures that Roversa is moving exactly as planned.

### Servo

Users can drive forward, backward, left and right turns which will only stop by calling the stop. Stop actually stops analog signal to ensure the robot fully stops regardless of bias.

The nuetral position should pause the motors and keep them stationary. 

Users can also select specific distances to drive the robot forward and backwards. This is also similar to selecting specific angles for turning. Be sure to use the calibration before using these last 4 functions to make sure your robot is going the correct distances and angles. 

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
