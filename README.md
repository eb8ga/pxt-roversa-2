# Roversa PXT Extension for MakeCode
More info for Roversa can be found on [roversa.com](https://www.roversa.com) or on the [Roversa](https://www.globalcsed.org/tools.html) page at GlobalCSED.

## Roversa

![roversa v2.1.1](https://github.com/eb8ga/roversa2/blob/main/github/pics/CADView.png?raw=true)

### Buttons
Pins are matched to the following micro:bit inputs:

```P5``` = Enter

```P8``` = Play

```P9``` = Pause

```P13``` = Forward

```P14``` = Reverse

```P15``` = Right

```P16``` = Left

Roversa button `isPressed` allows users to select any of the 7 buttons mapped to the micro:bit on Roversa. Buttons include FWD, REV, LEFT, RIGHT, STOP, ENTER, PLAY. Users can make these buttons do anything in Blocks and Javascript

```block
roversa.isPressed(RoversaPin.P5)
```
*Determines if a button is pressed*

Roversa button `onEvent` allows users to select any of the above buttons and create an event on the button *down*, *up*, or *click*. In the above example when you push the Enter button on Pin 5 the LED display the string "Hello".

```blocks
roversa.onEvent(RoversaPin.P5, RoversaEvent.Down, function() {
    basic.showString("Hello!")
})
```
*Registers code to run when a Roversa event is detected.*

### Calibrate
Users can use bias to ensure that the servos are moving in a similar fashion. This will allow users to change the left or right motor regardless of trim. 0-50 adjust the left motor, 50-100 adjusts the right motor.

```block
roversa.biasDriving(50)
```
*Apply a bias to the wheels. 0 to 50 for left, 50 to 100 for right.*

Users can also adjust the amount of degrees per turn and amount of mm per second when using future function like turning a certain number of degrees or moving a specified distance. This ensures that Roversa is moving exactly as planned. Use these to coincide with `roversa.turnLeft` and `roversa.turnRight` for turning and `roversa.driveForwards` and `roversa.driveBackwards` to go a straight distance. In this example it will turn 2 degrees/s or move 10 mm/s.

```block
roversa.setDegreesPerSecond(2)
```
*Allows the setting of Roversa turn amount. This allows tuning for the turn x degrees commands*
 ```block
roversa.setDistancePerSecond(10)
```
*Allows the setting of Roversa forward / reverse distance. This allows tuning for the move x distance commands*

### Servo

Users can drive forward, backward, left and right turns which will only stop by calling the stop. Stop actually stops analog signal to ensure the robot fully stops regardless of bias. The nuetral position should pause the motors and keep them stationary and will depend on how your motors are trimmed.
```block
roversa.forward()
```
*Drives forwards. Call stop to stop*
```block
roversa.backward()
```
*Drives backwards. Call stop to stop*
```block
roversa.right()
```
*Turns right. Call stop to stop*
```block
roversa.left()
```
*Turns left. Call stop to stop*
```block
roversa.neutral()
```
*Sends servos to 'neutral' position.\r\nOn a well trimmed 360 this is stationary, on a normal servo this is 90 degrees*

Users can also select specific distances to drive the robot forward and backwards. This is also similar to selecting specific angles for turning. Be sure to use the calibration before using these last 4 functions to make sure your robot is going the correct distances and angles. In this example it is driving 10 mm or turning 90 degrees.

```block
roversa.driveForwards(10)
```
*Drives forwards the requested distance and then stops*
```block
roversa.driveBackwards(10)
```
*Drives backwards the requested distance and then stops*
```block
roversa.turnRight(90)
```
*Turns right through the requested degrees and then stops, needs **NumberOfDegreesPerSec** tuned to make accurate, as it uses a simple turn, wait, stop method. Runs the servos at slower than the left function to reduce wheel slip*
```block
roversa.turnLeft(90)
```
*Turns left through the requested degrees and then stops, needs **NumberOfDegreesPerSec** tuned to make accurate, as it uses a simple turn, wait, stop method. Runs the servos at slower than the right function to reduce wheel slip*

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
