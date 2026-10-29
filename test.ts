/**
 * **********************************************************************************************************************************************
 * Roversa extension test suite
 *
 * WHAT THIS COVERS
 * Every block the extension exports, in five groups:
 *   A. Calibration state          automatic, no hardware needed
 *   B. Basic movement             manual, needs a Roversa on the floor
 *   C. Advanced movement          manual, needs a Roversa on the floor
 *   D. Calibration test blocks    manual, needs a Roversa on the floor
 *   E. Buttons and events         manual, needs a Roversa's buttons
 *
 * HOW TO RUN
 *   1. Open this repository in MakeCode (makecode.microbit.org, "Import" the repo URL).
 *   2. Open the JavaScript view and the simulator console. Group A runs on start and
 *      reports to the console, so group A can be checked in the simulator alone.
 *   3. For groups B to E, download the hex, flash a micro:bit, seat it in a Roversa,
 *      and stand the Roversa on a flat floor with at least 1 m clear in front of it.
 *   4. Press the micro:bit buttons listed below to run each group. Groups are
 *      independent and can be run in any order, any number of times.
 *
 * HOW RESULTS ARE REPORTED
 *   Group A writes one "PASS" or "FAIL" line per check to the serial console, then
 *   shows a tick (all passed) or a cross followed by the failure count on the LEDs.
 *   Groups B to D are judged by watching the robot against the expected result
 *   written next to each step. Group E reports to serial and to the LED display.
 *
 * PASS / FAIL CRITERIA
 *   Group A  PASS when the LEDs show a tick and every console line reads PASS.
 *            FAIL on any cross, any FAIL line, or any error in the console.
 *   Group B  PASS when the robot performs each move in order, finishes each move
 *            stopped and still, and ends roughly back where it started.
 *   Group C  PASS when the measured distances and angles match the requested ones
 *            within the tolerance given for each step.
 *   Group D  PASS when each timed test block drives or spins for about the time
 *            requested, and the steer trim visibly changes which way the robot pulls.
 *   Group E  PASS when every one of the seven buttons lights its own LED while held
 *            and prints its own down and up lines to the console.
 *   Any group FAILS if the micro:bit shows an error code, the servos keep running
 *   after a move finishes, or the program stops responding to the buttons.
 *
 * NOTE ON PIN NAMES
 *   The RoversaPin members are named for the button, not for the physical pin, and
 *   the two are crossed over for Menu and Play: RoversaPin.P5 is the Menu button and
 *   reads physical pin P8, while RoversaPin.P8 is the Play button and reads physical
 *   pin P5. The tests below use the button labels, which is what Blocks users see.
 ************************************************************************************************************************************************/

/* ----------------------------------------------------------------------------------------------
 * Group A: calibration state
 *
 * These checks only read back values the extension stores, so they are safe in the
 * simulator and never move a motor. They run once on start.
 * ---------------------------------------------------------------------------------------------- */

let checksRun = 0
let checksFailed = 0

/* Compare a value the extension reports against the value it should hold. */
function check(name: string, actual: number, expected: number): void {
    checksRun++
    if (actual == expected) {
        serial.writeLine("PASS  " + name)
    } else {
        checksFailed++
        serial.writeLine("FAIL  " + name + ": expected " + expected + ", got " + actual)
    }
}

serial.writeLine("")
serial.writeLine("Roversa test suite, group A: calibration state")

/* Speed: stores a percentage, and clamps anything outside 0-100. */
roversa.setSpeed(70)
check("set speed to 70", roversa.speed(), 70)
roversa.setSpeed(150)
check("speed clamps above 100", roversa.speed(), 100)
roversa.setSpeed(-10)
check("speed clamps below 0", roversa.speed(), 0)

/* Steer trim: forward and backward are stored separately, and a trim with no
   direction sets both. Both are clamped to -50..50. */
roversa.setSteerTrim(0)
check("trim 0 sets forward", roversa.steerTrimValue(RoversaDirection.Forward), 0)
check("trim 0 sets backward", roversa.steerTrimValue(RoversaDirection.Backward), 0)

roversa.setSteerTrim(10, RoversaDirection.Forward)
check("forward trim set to 10", roversa.steerTrimValue(RoversaDirection.Forward), 10)
check("backward trim left alone", roversa.steerTrimValue(RoversaDirection.Backward), 0)

roversa.setSteerTrim(-5, RoversaDirection.Backward)
check("backward trim set to -5", roversa.steerTrimValue(RoversaDirection.Backward), -5)
check("forward trim still 10", roversa.steerTrimValue(RoversaDirection.Forward), 10)

/* A plain "set steer trim" overwrites both directions. The README warns about this,
   so it is worth pinning down. */
roversa.setSteerTrim(3)
check("plain trim overwrites forward", roversa.steerTrimValue(RoversaDirection.Forward), 3)
check("plain trim overwrites backward", roversa.steerTrimValue(RoversaDirection.Backward), 3)

/* steerTrimValue reports the forward correction when no direction is given. */
roversa.setSteerTrim(7, RoversaDirection.Forward)
check("trim defaults to forward", roversa.steerTrimValue(), 7)

roversa.setSteerTrim(100, RoversaDirection.Both)
check("trim clamps above 50", roversa.steerTrimValue(RoversaDirection.Forward), 50)
roversa.setSteerTrim(-100, RoversaDirection.Both)
check("trim clamps below -50", roversa.steerTrimValue(RoversaDirection.Backward), -50)

/* Step size: how far "drive forward" and "drive backward" travel. */
roversa.setStepSize(150)
check("step size set to 150", roversa.stepSizeValue(), 150)
roversa.setStepSize(200)
check("step size set to 200", roversa.stepSizeValue(), 200)
roversa.setStepSize(0)
check("step size clamps to 1", roversa.stepSizeValue(), 1)

/* Movement and turn times have no read-back block, so these calls check that they
   compile and accept both normal and out-of-range values. The numbers they store are
   verified on the robot in groups C and D. */
roversa.setMovementTime(1250)
roversa.setMovementTime(0)
roversa.setTurnTime(2400)
roversa.setTurnTime(0)

/* The deprecated speed-based calibration block is hidden from the palette but still
   compiles, so existing projects keep working. Exercise it once. */
roversa.setDistancePerSecond(100)

/* Put everything back to the extension's own defaults, so the manual groups below
   behave as their expected results describe. */
roversa.setSpeed(80)
roversa.setSteerTrim(0)
roversa.setStepSize(150)
roversa.setMovementTime(1500)
roversa.setTurnTime(1800)
check("defaults restored: speed", roversa.speed(), 80)
check("defaults restored: trim", roversa.steerTrimValue(), 0)
check("defaults restored: step size", roversa.stepSizeValue(), 150)

serial.writeLine("Group A: " + (checksRun - checksFailed) + "/" + checksRun + " checks passed")
if (checksFailed == 0) {
    basic.showIcon(IconNames.Yes)
} else {
    basic.showIcon(IconNames.No)
    basic.showNumber(checksFailed)
}
basic.clearScreen()

/* ----------------------------------------------------------------------------------------------
 * Group B: basic movement            micro:bit button A
 *
 * Expected result: the robot drives one step forward, one step back, turns a quarter
 * turn left, then a quarter turn right, pausing visibly between moves. It should end
 * roughly where it started, facing its original direction. A step is 150 mm, one
 * square on the Roversa mat, so the forward and backward legs should cancel out.
 * Each move must finish stopped: the wheels should be still and silent between moves.
 * ---------------------------------------------------------------------------------------------- */
input.onButtonPressed(Button.A, function () {
    serial.writeLine("Group B: basic movement")
    basic.showString("B")

    roversa.forward()       // one step, 150 mm, forward
    roversa.backward()      // one step, 150 mm, back to the start
    roversa.left()          // quarter turn left
    roversa.right()         // quarter turn right, back to the original heading

    basic.clearScreen()
    serial.writeLine("Group B: finished")
})

/* ----------------------------------------------------------------------------------------------
 * Group C: advanced movement         micro:bit button B
 *
 * Expected result, measured with a tape measure and a protractor or the mat squares:
 *   300 mm forward   within +/- 30 mm (10%) once the distance calibration is tuned
 *   300 mm backward  returns to the start, within +/- 30 mm
 *   90 degrees right then 90 degrees left, returning to the original heading
 *     within +/- 10 degrees once the turn calibration is tuned
 * The explicit stop at the end must silence the servos: nothing should creep.
 * An untuned robot will be out by more than this, which is a calibration result and
 * not a test failure. Run group D first, store the values, then re-run this group.
 * ---------------------------------------------------------------------------------------------- */
input.onButtonPressed(Button.B, function () {
    serial.writeLine("Group C: advanced movement")
    basic.showString("C")

    roversa.driveForwards(300)    // 300 mm out
    roversa.driveBackwards(300)   // 300 mm back
    roversa.turnRight(90)         // quarter turn right
    roversa.turnLeft(90)          // quarter turn left, back to the original heading
    roversa.stop()                // default half-second stop
    roversa.stop(1)               // explicit one-second stop, tests the optional argument

    basic.clearScreen()
    serial.writeLine("Group C: finished")
})

/* ----------------------------------------------------------------------------------------------
 * Group D: calibration test blocks   micro:bit buttons A + B together
 *
 * Expected result, timed with a stopwatch:
 *   drives forward for about 1 second, stops
 *   drives backward for about 1 second, stops, ending near the start
 *   drives forward 1 second with a strong right-wheel trim: visibly curves right
 *   drives forward 1 second with a strong left-wheel trim: visibly curves left
 *   spins right for about 2 seconds, stops
 * The two trimmed runs must curve in opposite directions. If both curve the same way,
 * the steer trim is not reaching the motors and this group FAILS.
 * The trim is reset to 0 at the end of the group.
 * ---------------------------------------------------------------------------------------------- */
input.onButtonPressed(Button.AB, function () {
    serial.writeLine("Group D: calibration test blocks")
    basic.showString("D")

    roversa.driveForwardForMilliseconds(1000)
    roversa.driveBackwardForMilliseconds(1000)

    // A large trim either way, so the curve is obvious by eye rather than measured.
    roversa.setSteerTrim(40, RoversaDirection.Forward)
    roversa.driveForwardForMilliseconds(1000)   // should pull right
    roversa.setSteerTrim(-40, RoversaDirection.Forward)
    roversa.driveForwardForMilliseconds(1000)   // should pull left
    roversa.setSteerTrim(0)

    roversa.turnRightForMilliseconds(2000)

    basic.clearScreen()
    serial.writeLine("Group D: finished")
})

/* ----------------------------------------------------------------------------------------------
 * Group E: buttons and events
 *
 * Two things are tested here. Both are always live, so no micro:bit button starts them.
 *
 * E1, polled reads, through "Roversa button ... is pressed".
 * Hold each Roversa button in turn. Each one lights its own LED while held and goes
 * out when released. The LED map is:
 *
 *        Menu . . . Play          Menu  = top left      Forward = above centre
 *        . . Fwd . .              Play  = top right     Backward = below centre
 *        . Lt . Rt .              Stop  = bottom left   Left / Right = beside centre
 *        . . Bwd . .
 *        Stop . . . .
 *
 * E2, events, through "Roversa button on ...".
 * Every press and release also prints a line to the serial console naming the button
 * and the event, and flashes the bottom right LED. A click, meaning a press and
 * release of the Forward button, prints a third line for the click event.
 *
 * PASS when all seven buttons light their own LED and print their own down and up
 * lines, and the Forward button also prints a click line.
 * FAIL if a button lights the wrong LED, lights nothing, prints nothing, or if an
 * LED stays lit after the button is released.
 * ---------------------------------------------------------------------------------------------- */

/* Light an LED while a button is held, and clear it as soon as it is released. */
function plotWhile(pressed: boolean, x: number, y: number): void {
    if (pressed) {
        led.plot(x, y)
    } else {
        led.unplot(x, y)
    }
}

/* Report every button down and up to serial, and flash the bottom right LED. */
function reportEvent(name: string, event: string): void {
    serial.writeLine("event: " + name + " " + event)
    led.plot(4, 4)
    basic.pause(100)
    led.unplot(4, 4)
}

/* E1: poll every button and mirror it to its own LED. */
basic.forever(function () {
    // Top row: the two menu-style buttons.
    plotWhile(roversa.isPressed(RoversaPin.P5), 0, 0)    // Menu, physical pin P8
    plotWhile(roversa.isPressed(RoversaPin.P8), 4, 0)    // Play, physical pin P5

    // A directional cross for the four driving buttons.
    plotWhile(roversa.isPressed(RoversaPin.P13), 2, 1)   // Forward
    plotWhile(roversa.isPressed(RoversaPin.P14), 2, 3)   // Backward
    plotWhile(roversa.isPressed(RoversaPin.P16), 1, 2)   // Left Turn
    plotWhile(roversa.isPressed(RoversaPin.P15), 3, 2)   // Right Turn

    // Bottom left: stop.
    plotWhile(roversa.isPressed(RoversaPin.P9), 0, 4)    // Stop
})

/* E2: registering all seven buttons for both events also checks that the event
   registration compiles for every pin in the enum. */
roversa.onEvent(RoversaPin.P5, RoversaEvent.Down, function () { reportEvent("Menu", "down") })
roversa.onEvent(RoversaPin.P5, RoversaEvent.Up, function () { reportEvent("Menu", "up") })

roversa.onEvent(RoversaPin.P8, RoversaEvent.Down, function () { reportEvent("Play", "down") })
roversa.onEvent(RoversaPin.P8, RoversaEvent.Up, function () { reportEvent("Play", "up") })

roversa.onEvent(RoversaPin.P9, RoversaEvent.Down, function () { reportEvent("Stop", "down") })
roversa.onEvent(RoversaPin.P9, RoversaEvent.Up, function () { reportEvent("Stop", "up") })

roversa.onEvent(RoversaPin.P13, RoversaEvent.Down, function () { reportEvent("Forward", "down") })
roversa.onEvent(RoversaPin.P13, RoversaEvent.Up, function () { reportEvent("Forward", "up") })

roversa.onEvent(RoversaPin.P14, RoversaEvent.Down, function () { reportEvent("Backward", "down") })
roversa.onEvent(RoversaPin.P14, RoversaEvent.Up, function () { reportEvent("Backward", "up") })

roversa.onEvent(RoversaPin.P15, RoversaEvent.Down, function () { reportEvent("Right Turn", "down") })
roversa.onEvent(RoversaPin.P15, RoversaEvent.Up, function () { reportEvent("Right Turn", "up") })

roversa.onEvent(RoversaPin.P16, RoversaEvent.Down, function () { reportEvent("Left Turn", "down") })
roversa.onEvent(RoversaPin.P16, RoversaEvent.Up, function () { reportEvent("Left Turn", "up") })

/* The third event kind. A click is a press and release of the same button, so it
   arrives after the down and up lines for that button. */
roversa.onEvent(RoversaPin.P13, RoversaEvent.Click, function () { reportEvent("Forward", "click") })

serial.writeLine("Groups B to E ready. A = basic, B = advanced, A+B = calibration.")
