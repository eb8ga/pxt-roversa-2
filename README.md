# Roversa PXT Extension for MakeCode
More info for Roversa can be found on [roversa.com](https://www.roversa.com) or on the [Roversa](https://www.globalcsed.org/tools.html) page at GlobalCSED.

## Roversa

![roversa v2.1.1](https://github.com/Roversa-Robotics/roversa2/blob/main/github/pics/CADView.png?raw=true)

### Buttons
Pins are matched to the following micro:bit inputs:

```P8``` = Menu

```P5``` = Play

```P9``` = Stop

```P13``` = Forward

```P14``` = Backward

```P15``` = Right

```P16``` = Left

Note that Play is on pin P5, which is the same pin the micro:bit's own button A uses.
The two are one electrical line, so a press of either is seen by both: `isPressed` and
`onEvent` on Play also fire when button A is pressed, and anything bound to button A
also fires when Play is pressed. Pick a different micro:bit button if you need the two
to stay apart.

Roversa button `isPressed` allows users to select any of the 7 buttons mapped to the micro:bit on Roversa. Buttons include FWD, REV, LEFT, RIGHT, STOP, MENU, PLAY. Users can make these buttons do anything in Blocks and Javascript

```block
roversa.isPressed(RoversaPin.P5)
```
*Determines if a button is pressed*

Roversa button `onEvent` allows users to select any of the above buttons and create an event on the button *down*, *up*, or *click*. In the above example when you push the Menu button on Pin 8 the LED display the string "Hello".

```blocks
roversa.onEvent(RoversaPin.P8, RoversaEvent.Down, function() {
    basic.showString("Hello!")
})
```
*Registers code to run when a Roversa event is detected.*

### Calibrate
Calibration is split into three groups, one for each thing Roversa needs to know. Work through them in order: steering first, then distance, then turning. Each group has the blocks that store a setting, and the test blocks you use to find the right value. No maths required — the extension does the conversion for you.

#### Steering calibration

**Speed** — all movement runs at a percentage of full speed. Lower values give more reliable motion on cheaper motors. This one cap applies to driving and turning alike, so set it before you calibrate anything else.

```block
roversa.setSpeed(70)
```
*Set how fast the robot drives, as a percentage of full speed (0-100).*

```block
roversa.speed()
```
*Reports the current speed percentage, so you can read it in Blocks.*

**Steer trim (drift correction)** — if Roversa curves instead of driving straight, use the steer trim to nudge it back. A positive value slows the right wheel, a negative value slows the left wheel. It is applied automatically by every forward / backward / drive-distance block.

Roversa is not symmetrical — the caster wheel trails when pushed but wanders when pulled, and continuous-rotation servos rarely behave the same in both rotation directions — so **forward and backward each keep their own correction**. Calibrate them separately. The drive test blocks in [Distance calibration](#distance-calibration) are handy for checking the trim over a long straight run.

```block
roversa.setSteerTrim(0)
```
*Correct drift, -50 to 50. With no direction chosen this sets forward and backward together.*

```block
roversa.setSteerTrim(10, RoversaDirection.Forward)
```
*Correct drift going forward only.*

```block
roversa.setSteerTrim(-5, RoversaDirection.Backward)
```
*Correct drift going backward only.*

> Order matters: a plain `set steer trim` sets **both** directions, so placing one *after* a forward- or backward-only block will overwrite it. Set the shared value first, then the per-direction ones.

```block
roversa.steerTrimValue()
```
*Reports the current steer trim so you can read it in Blocks. Reports the forward value unless you pick backward.*

#### Distance calibration
The step blocks and `drive forwards` a set distance only work once Roversa knows how long its motors take to move one step. Run a test block, adjust the milliseconds until Roversa travels exactly one step, then store that time.

> Tip: the steer trim is applied while driving straight, so set your steer trim first. Otherwise Roversa curves during the distance test and the number will be off.

**Step size** — "drive forward" and "drive backward" move one step. A step is 150 mm by default, which is one square on the Roversa mat. If your mat has a different square size, set the step size once in `on start` and every step block follows it.

```block
roversa.setStepSize(150)
```
*Sets how far one step is, in millimeters.*

```block
roversa.stepSizeValue()
```
*Reports the current step size so you can read it in Blocks.*

**Testing** — run the test, changing the milliseconds until Roversa travels exactly one step (one square on your mat).

```block
roversa.driveForwardForMilliseconds(1000)
```
*Test: drive straight forward for the given milliseconds, then stop.*

```block
roversa.driveBackwardForMilliseconds(1000)
```
*Test: drive straight backward for the given milliseconds, then stop. Also useful for checking the backward steer trim over a long run.*

**Storing the time**

```block
roversa.setMovementTime(1250)
```
*Stores how many milliseconds it takes to move one step. This tunes the step blocks and the drive-distance blocks. You can set the step size before or after this block.*

#### Turn calibration
`turn` a set number of degrees only works once Roversa knows how long it takes to spin. Run the test, changing the milliseconds until Roversa spins exactly one full circle (360°), then store that time.

```block
roversa.turnRightForMilliseconds(2400)
```
*Test: spin right on the spot for the given milliseconds, then stop.*

```block
roversa.setTurnTime(2400)
```
*Stores how many milliseconds it takes to spin a full 360° turn. This tunes the turn blocks.*
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

## Testing

The test suite lives in [test.ts](test.ts). It covers every block in the extension,
split into five groups: one group of automatic checks on the calibration values, which
runs on start and needs no hardware, and four manual groups that drive a real Roversa
from the micro:bit buttons.

How to run the tests, what each group should do, and the pass and fail criteria for
each one are documented in the comment block at the top of `test.ts`.

## License

MIT

## Supported targets

* for PXT/microbit
(The metadata above is needed for package search.)
