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
//% groups="['Buttons', 'Basic', 'Advanced', 'Calibrate', 'Test']"
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
         //150 mm is the default step in our mats
        let timeToWait = (150 * milliSecInASecond) / distancePerSec; // calculation done this way round to avoid zero rounding
        basic.pause(timeToWait);
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
        //150 mm is the default step in our mats
        let timeToWait = (150 * milliSecInASecond) / distancePerSec; // calculation done this way round to avoid zero rounding
        basic.pause(timeToWait);
        stop();
        basic.pause(500);
    }

    /**
    * Turns left. Call stop to stop
    */
    //% blockId=roversa_servos_left
    //% group="Basic" weight=85
    //% block="turn left"
    export function left(): void {
        spin(-1);
        let timeToWait = (90 * milliSecInASecond) / numberOfDegreesPerSec;// calculation done this way round to avoid zero rounding
        basic.pause(timeToWait);
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
        // 90 degrees is the default turn 
        let timeToWait = (90 * milliSecInASecond) / numberOfDegreesPerSec;// calculation done this way round to avoid zero rounding
        basic.pause(timeToWait);
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
    //% block="stop || for %pause_seconds s"
    //% pause_seconds.min=0 pause_seconds.max=10 pause_seconds.defl=0.5
    export function stop(pause_seconds:number=0.5): void {
        pins.analogWritePin(AnalogPin.P1, 0);
        pins.analogWritePin(AnalogPin.P2, 0);
        basic.pause(pause_seconds*1000)
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
     * @param milliseconds how long to drive, eg: 1000
     */
    //% blockId=roversa_drive_for_seconds
    //% group="Test" weight=80
    //% block="test: drive forward for %milliseconds|milliseconds"
    //% milliseconds.min=0 milliseconds.defl=1000
    export function driveForwardForSeconds(milliseconds: number): void {
        driveStraight(1);
        basic.pause(milliseconds);
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
     * Allows the setting of roversa forward / reverse distance.
     * This allows tuning the time it takes to move a certain distance.
     * @param milliseconds : How many milliseconds it takes to move one square (150mm) on the mat.
     */
    //% blockId=roversa_set_movement_time_param
    //% group="Calibrate" weight=71
    //% block="calibrate drive amount to %milliseconds|milliseconds"
    export function setMovementTime(milliseconds: number): void {
        distancePerSec = 150 * milliSecInASecond / milliseconds
    }

    /**
     * Test block: spin right on the spot for a number of milliseconds, then stop.
     * Use this to calibrate turning: run it, modify the milliseconds until it turns 360 degrees,
     * (or you see a full turn), write down the milliseconds, then feed into "calibrate full turn duration".
     * @param milliseconds how long to turn, eg: 1000
     */
    //% blockId=roversa_turn_for_seconds
    //% group="Test" weight=90
    //% block="test: turn right for %milliseconds|milliseconds"
    //% milliseconds.min=0 milliseconds.defl=1000
    export function turnRightForSeconds(milliseconds: number): void {
        spin(1);
        basic.pause(milliseconds);
        stop();
    }

    /**
     * Allows the setting the time it takes to turn 360 degrees.
     * This allows tuning for the turn x degrees commands
     * @param milliseconds : How many milliseconds it takes to turn 360 degrees.
     */
    //% blockId=roversa_set_turn_time_param
    //% group="Calibrate" weight=69
    //% block="calibrate %milliseconds|ms needed for a full turn"
    export function setTurnTime(milliseconds: number): void {
        numberOfDegreesPerSec = 360 * milliSecInASecond / milliseconds
    }
}
