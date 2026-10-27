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
If Roversa curves instead of driving straight, use the steer trim to nudge it back. A positive value slows the right wheel, a negative value slows the left wheel. It is applied automatically by every forward / backward / drive-distance block.

Roversa is not symmetrical — the caster wheel trails when pushed but wanders when pulled, and continuous-rotation servos rarely behave the same in both rotation directions — so **forward and reverse each keep their own correction**. Calibrate them separately.

```block
roversa.setSteerTrim(0)
```
*Correct drift, -50 to 50. With no direction chosen this sets forward and reverse together.*

```block
roversa.setSteerTrim(10, RoversaDirection.Forward)
```
*Correct drift going forward only.*

```block
roversa.setSteerTrim(-5, RoversaDirection.Reverse)
```
*Correct drift in reverse only.*

> Order matters: a plain `set steer trim` sets **both** directions, so placing one *after* a forward- or reverse-only block will overwrite it. Set the shared value first, then the per-direction ones.

```block
roversa.steerTrimValue()
```
*Reports the current steer trim so you can read it in Blocks. Reports the forward value unless you pick reverse.*

#### Calibrating distance and turning
`drive forwards` a set distance and `turn` a set number of degrees only work once Roversa knows how long its motors need. You calibrate by running a **test** block, adjusting the milliseconds until Roversa produces a known result, then saving that time. No maths required — the extension does the conversion for you.

> Tip: the steer trim is applied while driving straight, so set your steer trim first. Otherwise Roversa curves during the distance test and the number will be off.

**Step size** — "drive forward one step" and "drive backward one step" move one step. A step is 150 mm by default, which is one square on the Roversa mat. If your mat has a different square size, set the step size once in `on start` and every step block follows it.

```block
roversa.setStepSize(150)
```
*Sets how far one step is, in millimeters.*

```block
roversa.stepSizeValue()
```
*Reports the current step size so you can read it in Blocks.*

**Distance** — run the test, changing the milliseconds until Roversa travels exactly one step (one square on your mat), then store that time.

```block
roversa.driveForwardForMilliseconds(1000)
```
*Test: drive straight forward for the given milliseconds, then stop.*

```block
roversa.driveBackwardForMilliseconds(1000)
```
*Test: drive straight backward for the given milliseconds, then stop. Useful for checking the reverse steer trim over a long run.*

```block
roversa.setMovementTime(1250)
```
*Stores how many milliseconds it takes to move one step. This tunes the step blocks and the drive-distance blocks.*

```block
roversa.setMovementTime(1250, 200)
```
*Expand the block to give the step size at the same time. This example also sets the step size to 200 mm. Leave it collapsed to keep the step size you already set.*

**Turning** — run the test, changing the milliseconds until Roversa spins exactly one full circle (360°), then store that time.

```block
roversa.turnRightForMilliseconds(2400)
```
*Test: spin right on the spot for the given milliseconds, then stop.*

```block
roversa.setTurnTime(2400)
```
*Stores how many milliseconds it takes to spin a full 360° turn. This tunes the turn-degrees blocks.*

### Servo

Users can drive forward or backward one step, and turn left or right 90 degrees. Each block stops on its own when the move is done. Stop actually stops analog signal to ensure the robot fully stops regardless of bias. The nuetral position should pause the motors and keep them stationary and will depend on how your motors are trimmed.
```block
roversa.forward()
```
*Drives forward one step (150 mm unless you set a different step size), then stops*
```block
roversa.backward()
```
*Drives backward one step (150 mm unless you set a different step size), then stops*
```block
roversa.right()
```
*Turns right 90 degrees, then stops*
```block
roversa.left()
```
*Turns left 90 degrees, then stops*

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
*Turns right through the requested degrees and then stops. Needs the full-turn calibration tuned to be accurate, as it uses a simple turn, wait, stop method.*
```block
roversa.turnLeft(90)
```
*Turns left through the requested degrees and then stops. Needs the full-turn calibration tuned to be accurate, as it uses a simple turn, wait, stop method.*

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
