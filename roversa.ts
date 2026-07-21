/**
 * The pins used by Roversa
 */
//%
enum RoversaPin {
    //% block="Menu"
    P5 = DAL.MICROBIT_ID_IO_P8,
    //% block="Play"
    P8 = DAL.MICROBIT_ID_IO_P5,
    //% block="Stop"
    P9 = DAL.MICROBIT_ID_IO_P9,
    //% block="Forward"
    P13 = DAL.MICROBIT_ID_IO_P13,
    //% block="Reverse"
    P14 = DAL.MICROBIT_ID_IO_P14,
    //% block="Right Turn"
    P15 = DAL.MICROBIT_ID_IO_P15,
    //% block="Left Turn"
    P16 = DAL.MICROBIT_ID_IO_P16,
}

/**
 * The event raised by the Roversa pins
 */
//%
enum RoversaEvent {
    //% block="click"
    Click = DAL.MICROBIT_BUTTON_EVT_CLICK,
    //% block="down"
    Down = DAL.MICROBIT_BUTTON_EVT_DOWN,
    //% block="up"
    Up = DAL.MICROBIT_BUTTON_EVT_UP,
}

/**
 * Blocks for driving the Roversa robot
 */
//% weight=100 color=#d55e00 icon="" block="Roversa"
//% groups="['Buttons', 'Basic', 'Advanced', 'Calibrate']"
namespace roversa {
    /**
     * **********************************************************************************************************************************************
     * micro:bit roversa
     ************************************************************************************************************************************************/

    /* Some parameters used for controlling the turn and length of the roversa robot */
    const milliSecInASecond = 1000
    let distancePerSec = 100
    let numberOfDegreesPerSec = 200

    /* Continuous-rotation servos: 90 is stopped, full speed is +/-90 from neutral.
       speedPercent caps movement at a percentage of full speed for reliable motion on cheap motors. */
    let speedPercent = 70

    /* Steer trim to correct drift. Range -50..50.
       Positive curves the robot to the right, negative to the left.
       It works by slowing the wheel on the inside of the curve. */
    let steerTrim = 0

    function clamp(value: number, low: number, high: number): number {
        if (value < low) return low;
        if (value > high) return high;
        return value;
    }

    /**
     * The single point where the servos are driven.
     * left / right are signed wheel speeds from -100 (full reverse) to 100 (full forward).
     * The motors are mirrored, so forward is 90+ on P1 and 90- on P2.
     * speedPercent caps the top speed of both wheels together.
     */
    function setMotors(left: number, right: number): void {
        left = clamp(left, -100, 100);
        right = clamp(right, -100, 100);
        // (left/100) * (speedPercent/100) * 90, combined to keep the integer maths tidy
        let p1 = 90 + (90 * left * speedPercent) / 10000;
        let p2 = 90 - (90 * right * speedPercent) / 10000;
        pins.servoWritePin(AnalogPin.P1, p1);
        pins.servoWritePin(AnalogPin.P2, p2);
    }

    /**
     * Drive both wheels in a straight line, applying the steer trim.
     * dir is 1 for forwards, -1 for backwards.
     * A positive steerTrim slows the right wheel, a negative one slows the left wheel.
     */
    function driveStraight(dir: number): void {
        let left = 100;
        let right = 100;
        if (steerTrim > 0) {
            right = 100 - 2 * steerTrim;   // steer right: slow the right wheel
        } else if (steerTrim < 0) {
            left = 100 + 2 * steerTrim;    // steer left: slow the left wheel
        }
        setMotors(dir * left, dir * right);
    }

    /**
     * Spin the robot on the spot.
     * dir is 1 to spin right, -1 to spin left.
     */
    function spin(dir: number): void {
        setMotors(dir * 100, -dir * 100);
    }

    /**
     *
     */
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

    /**
     * Determines if a button is pressed
     * @param button the pin that acts as a button
     */
    //% blockId=roversa_ispressed block="Roversa button %button|is pressed"
    //% group="Buttons" weight=91
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    export function isPressed(button: RoversaPin): boolean {
        const pin = <DigitalPin><number>button;
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(<DigitalPin><number>button) == 0;
    }

    /**
     * Registers code to run when a Roversa button is detected.
     */
    //% blockId=roversa_onevent block="Roversa button on %button|%event"
    //% group="Buttons" weight=90
    //% button.fieldEditor="gridpicker" button.fieldOptions.columns=3
    //% event.fieldEditor="gridpicker" event.fieldOptions.columns=3
    export function onEvent(button: RoversaPin, event: RoversaEvent, handler: Action) {
        init();
        control.onEvent(<number>button, <number>event, handler); // register handler
    }

    /**
     * Drives forward. Call stop to stop
     */
    //% blockId=roversa_servos_forward
    //% group="Basic" weight=87
    //% block="drive forward"
    export function forward(): void {
        driveStraight(1);
        basic.pause(1250);
        stop();
    }

    /**
     * Drives backwards. Call stop to stop
     */
    //% blockId=roversa_servos_backward
    //% group="Basic" weight=86
    //% block="drive backward"
    export function backward(): void {
        driveStraight(-1);
        basic.pause(1250);
        stop();
    }

    /**
    * Turns left. Call stop to stop
    */
    //% blockId=roversa_servos_left
    //% group="Basic" weight=85
    //% block="turn left"
    export function left(): void {
        spin(-1);
        basic.pause(650);
        stop();
    }

    /**
     * Turns right. Call stop to stop
     */
    //% blockId=roversa_servos_right
    //% group="Basic" weight=84
    //% block="turn right"
    export function right(): void {
        spin(1);
        basic.pause(650);
        stop();
    }

    /**
     * Drives forwards the requested distance and then stops
     * @param howFar distance to move
     */
    //% blockId=roversa_drive_forwards
    //% group="Advanced" weight=81
    //% block="drive forwards %howFar|distance"
    export function driveForwards(howFar: number): void {
        let timeToWait = (howFar * milliSecInASecond) / distancePerSec; // calculation done this way round to avoid zero rounding
        driveStraight(1);
        basic.pause(timeToWait);
        stop();
    }

    /**
     * Drives backwards the requested distance and then stops
     * @param howFar distance to move
     */
    //% blockId=roversa_drive_backwards
    //% group="Advanced" weight=80
    //% block="drive backwards %howFar|distance"
    export function driveBackwards(howFar: number): void {
        let timeToWait = (howFar * milliSecInASecond) / distancePerSec; // calculation done this way round to avoid zero rounding
        driveStraight(-1);
        basic.pause(timeToWait);
        stop();
    }

    /**
     * Turns right through the requested degrees and then stops
     * needs NumberOfDegreesPerSec tuned to make accurate, as it uses
     * a simple turn, wait, stop method.
     * @param deg how far to turn, eg: 90
     */
    //% blockId=roversa_turn_right
    //% group="Advanced" weight=79
    //% block="turn right %deg|degrees"
    export function turnRight(deg: number): void {
        let timeToWait = (deg * milliSecInASecond) / numberOfDegreesPerSec;// calculation done this way round to avoid zero rounding
        spin(1);
        basic.pause(timeToWait);
        stop();
    }

    /**
    * Turns left through the requested degrees and then stops
    * needs NumberOfDegreesPerSec tuned to make accurate, as it uses
    * a simple turn, wait, stop method.
    * @param deg how far to turn, eg: 90
    */
    //% blockId=roversa_turn_left
    //% group="Advanced" weight=78
    //% block="turn left %deg|degrees"
    export function turnLeft(deg: number): void {
        let timeToWait = (deg * milliSecInASecond) / numberOfDegreesPerSec;// calculation done this way round to avoid zero rounding
        spin(-1);
        basic.pause(timeToWait);
        stop()
    }

    /**
     * Stop for 360 servos.
     * rather than write 90, which may not stop the servo moving if it is out of trim
     * this stops sending servo pulses, which has the same effect.
     * On a normal servo this will stop the servo where it is, rather than return it to neutral position.
     * It will also not provide any holding force.
     */
    //% blockId=roversa_servos_stop
    //% group="Advanced" weight=77
    //% block="stop"
    export function stop(): void {
        pins.analogWritePin(AnalogPin.P1, 0);
        pins.analogWritePin(AnalogPin.P2, 0);
    }

    /**
     * Set how fast the robot drives, as a percentage of full speed.
     * Lower values give more reliable movement on cheaper motors.
     * @param percent eg: 70
     */
    //% blockId=roversa_set_speed
    //% group="Calibrate" weight=76
    //% block="set speed to %percent|\\%"
    //% percent.min=0 percent.max=100 percent.defl=70
    export function setSpeed(percent: number): void {
        speedPercent = clamp(percent, 0, 100);
    }

    /**
     * The current speed, as a percentage of full speed.
     */
    //% blockId=roversa_get_speed
    //% group="Calibrate" weight=75
    //% block="speed (\\%)"
    export function speed(): number {
        return speedPercent;
    }

    /**
     * Correct drift so the robot drives in a straight line.
     * Positive values curve the robot to the right, negative values to the left.
     * It works by slowing the wheel on the inside of the curve.
     * @param amount how much to steer, -50 (left) to 50 (right), eg: 0
     */
    //% blockId=roversa_set_steer_trim
    //% group="Calibrate" weight=74
    //% block="set steer trim to %amount"
    //% amount.min=-50 amount.max=50 amount.defl=0
    export function setSteerTrim(amount: number): void {
        steerTrim = clamp(amount, -50, 50);
    }

    /**
     * The current steer trim, -50 (left) to 50 (right).
     */
    //% blockId=roversa_get_steer_trim
    //% group="Calibrate" weight=73
    //% block="steer trim"
    export function steerTrimValue(): number {
        return steerTrim;
    }

    /**
     * Test block: drive straight forwards for a number of seconds, then stop.
     * Use this to calibrate distance: run it, measure how far Roversa travelled,
     * then divide by the seconds and feed that into "calibrate drive amount".
     * @param seconds how long to drive, eg: 1
     */
    //% blockId=roversa_drive_for_seconds
    //% group="Calibrate" weight=72
    //% block="test: drive forward for %seconds|seconds"
    //% seconds.min=0 seconds.defl=1
    export function driveForwardForSeconds(seconds: number): void {
        driveStraight(1);
        basic.pause(seconds * milliSecInASecond);
        stop();
    }

    /**
     * Allows the setting of roversa forward / reverse distance.
     * This allows tuning for the move x distance commands
     * @param distPerSec : How many mm per second the robot does.
     */
    //% blockId=roversa_set_movement_speed_param
    //% group="Calibrate" weight=71
    //% block="calibrate drive amount to %distPerSec|mm per second"
    export function setDistancePerSecond(distPerSec: number): void {
        distancePerSec = distPerSec
    }

    /**
     * Test block: spin right on the spot for a number of seconds, then stop.
     * Use this to calibrate turning: run it, measure how many degrees Roversa spun,
     * then divide by the seconds and feed that into "calibrate turn amount".
     * @param seconds how long to turn, eg: 1
     */
    //% blockId=roversa_turn_for_seconds
    //% group="Calibrate" weight=70
    //% block="test: turn right for %seconds|seconds"
    //% seconds.min=0 seconds.defl=1
    export function turnRightForSeconds(seconds: number): void {
        spin(1);
        basic.pause(seconds * milliSecInASecond);
        stop();
    }

    /**
     * Allows the setting of roversa turn amount.
     * This allows tuning for the turn x degrees commands
     * @param degPerSec : How many degrees per second the robot does.
     */
    //% blockId=roversa_set_turn_speed_param
    //% group="Calibrate" weight=69
    //% block="calibrate turn amount to %degPerSec|degrees per second"
    export function setDegreesPerSecond(degPerSec: number): void {
        numberOfDegreesPerSec = degPerSec
    }
}
