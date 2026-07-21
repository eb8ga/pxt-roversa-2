# Roversa PXT Extension for MakeCode
More info for Roversa can be found on [roversa.com](https://www.roversa.com) or on the [Roversa](https://www.globalcsed.org/tools.html) page at GlobalCSED.

## Roversa

![roversa v2.1.1](https://github.com/eb8ga/roversa2/blob/main/github/pics/CADView.png?raw=true)

### Buttons
Pins are matched to the following micro:bit inputs:

```P8``` = Menu

```P5``` = Play

```P9``` = Pause

```P13``` = Forward

```P14``` = Reverse

```P15``` = Right

```P16``` = Left

Roversa button `isPressed` allows users to select any of the 7 buttons mapped to the micro:bit on Roversa. Buttons include FWD, REV, LEFT, RIGHT, STOP, MENU, PLAY. Users can make these buttons do anything in Blocks and Javascript

```block
roversa.isPressed(RoversaPin.P5)
```
*Determines if a button is pressed*

Roversa button `onEvent` allows users to select any of the above buttons and create an event on the button *down*, *up*, or *click*. In the above example when you push the Menu button on Pin 5 the LED display the string "Hello".

```blocks
roversa.onEvent(RoversaPin.P5, RoversaEvent.Down, function() {
    basic.showString("Hello!")
})
```
*Registers code to run when a Roversa event is detected.*

### Calibrate

#### Speed
All movement runs at a percentage of full speed. Lower values give more reliable motion on cheaper motors. This one cap applies to driving and turning alike.

```block
roversa.setSpeed(70)
```
*Set how fast the robot drives, as a percentage of full speed (0-100).*

```block
roversa.speed()
```
*Reports the current speed percentage, so you can read it in Blocks.*

#### Steer trim (drift correction)
If Roversa curves instead of driving straight, use the steer trim to nudge it back. A positive value curves the robot to the right, a negative value to the left. It works by slowing the wheel on the inside of the curve, and it is applied automatically by every forward / backward / drive-distance block.

```block
roversa.setSteerTrim(0)
```
*Correct drift. -50 (left) to 50 (right).*

```block
roversa.steerTrimValue()
```
*Reports the current steer trim, so you can read it in Blocks.*

#### Calibrating distance and turning
Driving a set distance or turning a set number of degrees depends on knowing how fast Roversa actually moves. The two test blocks let you measure that: run one for a known time, measure the result with a ruler / protractor, then divide by the seconds and feed that into the matching calibrate block.

```block
roversa.driveForwardForSeconds(1)
```
*Test: drive straight forward for the given seconds, then stop. Measure the distance travelled.*

```block
roversa.setDistancePerSecond(10)
```
*Allows the setting of Roversa forward / reverse distance in mm per second. This tunes the move x distance commands.*

```block
roversa.turnRightForSeconds(1)
```
*Test: spin right on the spot for the given seconds, then stop. Measure the degrees turned.*

```block
roversa.setDegreesPerSecond(2)
```
*Allows the setting of Roversa turn amount in degrees per second. This tunes the turn x degrees commands.*

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
*Turns right through the requested degrees and then stops, needs **NumberOfDegreesPerSec** tuned to make accurate, as it uses a simple turn, wait, stop method.*
```block
roversa.turnLeft(90)
```
*Turns left through the requested degrees and then stops, needs **NumberOfDegreesPerSec** tuned to make accurate, as it uses a simple turn, wait, stop method.*

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
