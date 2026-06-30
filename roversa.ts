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
 * Which way to nudge the robot when it drifts off a straight line
 */
//%
enum RoversaCorrection {
    //% block="to the left"
    Left,
    //% block="to the right"
    Right,
}

/**
 * Blocks for driving the Roversa robot
 */
//% weight=100 color=#d55e00 icon="\uf085" block="Roversa"
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
    let biasToApply = 50 //in the middle is the place to start

    /* Continuous-rotation servos: 90 is stopped, full speed is +/-90 from neutral.
       Cap movement at a percentage of full speed for reliable motion on cheap motors. */
    let speedPercent = 70
    let fwdHigh = 90 + (90 * speedPercent) / 100 // 153 at 70%
    let fwdLow = 90 - (90 * speedPercent) / 100  // 27 at 70%

    /* Scale the steering bias offset so it stays proportional at reduced speed */
    function scaleBias(offset: number): number {
        return (offset * speedPercent) / 100;
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

    function forwardHard(): void {
        let P1Output = fwdHigh;
        let P2Output = fwdLow;
        
        if (biasToApply < 50) {
            // Want to move fwdHigh towards 90
            P2Output -= scaleBias(50 - biasToApply);
        } else if (biasToApply > 50) {
            // Want to move fwdLow towards 90
            P1Output += scaleBias(biasToApply - 50);
        }

        pins.servoWritePin(AnalogPin.P1, P1Output);
        pins.servoWritePin(AnalogPin.P2, P2Output);
    }

    function backwardHard(): void {
        let P1Output = fwdLow;
        let P2Output = fwdHigh;
        
        if (biasToApply < 50) {
            // Want to move fwdLow towards 90
            P2Output += scaleBias(50 - biasToApply);
        } else if (biasToApply > 50) {
            // Want to move fwdHigh towards 90
            P1Output -= scaleBias(biasToApply - 50);
        }

        pins.servoWritePin(AnalogPin.P1, P1Output);
        pins.servoWritePin(AnalogPin.P2, P2Output);
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
     * Drives backwards. Call stop to stop
     */
    //% blockId=roversa_servos_backward
    //% group="Basic" weight=86
    //% block="drive backward"
    export function backward(): void {
        let P1Output = fwdLow;
        let P2Output = fwdHigh;
        
        if (biasToApply < 50) {
            // Want to move fwdHigh towards 90
            P2Output -= scaleBias(50 - biasToApply);
        } else if (biasToApply > 50) {
            // Want to move fwdLow towards 90
            P1Output += scaleBias(biasToApply - 50);
        }
        pins.servoWritePin(AnalogPin.P1, P1Output);
        pins.servoWritePin(AnalogPin.P2, P2Output);
	basic.pause(1250);
        stop();
    }

    /**
     * Drives forward. Call stop to stop
     */
    //% blockId=roversa_servos_forward
    //% group="Basic" weight=87
    //% block="drive forward"
    export function forward(): void {
        let P1Output = fwdHigh;
        let P2Output = fwdLow;
        
        if (biasToApply < 50) {
            // Want to move fwdLow towards 90
            P2Output += scaleBias(50 - biasToApply);
        } else if (biasToApply > 50) {
            // Want to move fwdHigh towards 90
            P1Output -= scaleBias(biasToApply - 50);
        }

        pins.servoWritePin(AnalogPin.P1, P1Output);
        pins.servoWritePin(AnalogPin.P2, P2Output);
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
        pins.servoWritePin(AnalogPin.P1, 0);
        pins.servoWritePin(AnalogPin.P2, 0);
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
        pins.servoWritePin(AnalogPin.P1, 180);
        pins.servoWritePin(AnalogPin.P2, 180);
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
        forwardHard();
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
        backwardHard();
        basic.pause(timeToWait);
        stop();
    }

    /**
     * Turns right through the requested degrees and then stops
     * needs NumberOfDegreesPerSec tuned to make accurate, as it uses
     * a simple turn, wait, stop method.
     * Runs the servos at slower than the right function to reduce wheel slip
     * @param deg how far to turn, eg: 90
     */
    //% blockId=roversa_turn_right
    //% group="Advanced" weight=79
    //% block="turn right %deg|degrees"
    export function turnRight(deg: number): void {
        let timeToWait = (deg * milliSecInASecond) / numberOfDegreesPerSec;// calculation done this way round to avoid zero rounding
        pins.servoWritePin(AnalogPin.P1, 130);
        pins.servoWritePin(AnalogPin.P2, 130);
        basic.pause(timeToWait);
        stop();
    }

    /**
    * Turns left through the requested degrees and then stops
    * needs NumberOfDegreesPerSec tuned to make accurate, as it uses
    * a simple turn, wait, stop method.
    * Runs the servos at slower than the right function to reduce wheel slip
    * @param deg how far to turn, eg: 90
    */
    //% blockId=roversa_turn_left
    //% group="Advanced" weight=78
    //% block="turn left %deg|degrees"
    export function turnLeft(deg: number): void {
        let timeToWait = (deg * milliSecInASecond) / numberOfDegreesPerSec;// calculation done this way round to avoid zero rounding
        pins.servoWritePin(AnalogPin.P1, 50);
        pins.servoWritePin(AnalogPin.P2, 50);
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
    //% group="Calibrate" weight=70
    //% block="set speed to %percent|\\%"
    //% percent.min=0 percent.max=100 percent.defl=70
    export function setSpeed(percent: number): void {
        if (percent > 100) {
            percent = 100;
        } else if (percent < 0) {
            percent = 0;
        }
        speedPercent = percent;
        fwdHigh = 90 + (90 * speedPercent) / 100;
        fwdLow = 90 - (90 * speedPercent) / 100;
    }

   /**
     * Nudge the robot when it drifts off a straight line.
     * Pick the way you want to correct and how strongly; we handle the wheel maths.
     * @param amount how strongly to correct, eg: 10
     */
    //% blockId=roversa_servos_bias
    //% group="Calibrate" weight=69
    //% block="correct drift %direction by %amount"
    //% amount.min=0 amount.max=50 amount.defl=10
    export function correctDrift(direction: RoversaCorrection, amount: number): void {
        if (amount > 50) {
            amount = 50;
        } else if (amount < 0) {
            amount = 0;
        }
        if (direction == RoversaCorrection.Left) {
            biasToApply = 50 - amount;
        } else {
            biasToApply = 50 + amount;
        }
    }
	
    /**
     * Allows the setting of roversa turn amount.
     * This allows tuning for the turn x degrees commands
     * @param degPerSec : How many degrees per second the robot does.
     */
    //% blockId=roversa_set_turn_speed_param
    //% group="Calibrate" weight=68
    //% block="calibrate turn amount to %degPerSec|degrees per second" 
    export function setDegreesPerSecond(degPerSec: number): void {
        numberOfDegreesPerSec = degPerSec
    }

    /**
     * Allows the setting of roversa forward / reverse distance.
     * This allows tuning for the move x distance commands
     * @param distPerSec : How many mm per second the robot does.
     */
    //% blockId=roversa_set_movement_speed_param 
    //% group="Calibrate" weight=67
    //% block="calibrate drive amount to %distPerSec|mm per second"
    export function setDistancePerSecond(distPerSec: number): void {
        distancePerSec = distPerSec
    }
}
