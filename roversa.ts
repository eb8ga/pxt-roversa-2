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
        let P1Output = 0;
        let P2Output = 180;
        
        if (biasToApply < 50) {
            // Want to move 180 towards 90
            P2Output -= 50 - biasToApply;
        } else if (biasToApply > 50) {
            // Want to move 0 towards 90
            P1Output += biasToApply - 50;
        }

        pins.servoWritePin(AnalogPin.P1, P1Output);
        pins.servoWritePin(AnalogPin.P2, P2Output);
    }

    function backwardHard(): void {
        let P1Output = 180;
        let P2Output = 0;
        
        if (biasToApply < 50) {
            // Want to move 0 towards 90
            P2Output += 50 - biasToApply;
        } else if (biasToApply > 50) {
            // Want to move 180 towards 90
            P1Output -= biasToApply - 50;
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
        let P1Output = 0;
        let P2Output = 180;
        
        if (biasToApply < 50) {
            // Want to move 180 towards 90
            P2Output -= 50 - biasToApply;
        } else if (biasToApply > 50) {
            // Want to move 0 towards 90
            P1Output += biasToApply - 50;
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
        let P1Output = 180;
        let P2Output = 0;
        
        if (biasToApply < 50) {
            // Want to move 0 towards 90
            P2Output += 50 - biasToApply;
        } else if (biasToApply > 50) {
            // Want to move 180 towards 90
            P1Output -= biasToApply - 50;
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
     * Apply a bias to the wheels. 0 to 50 for left, 50 to 100 for right.
     * @param bias eg: 50
     */
    //% blockId=roversa_servos_bias
    //% group="Calibrate" weight=69
    //% block="bias %biasDriving"
    //% bias.min=0 bias.max=100
    export function biasDriving(bias:number): void {
        if (bias > 100) {
            bias = 100;
        } else if (bias < 0) {
            bias = 0;
        }
        biasToApply = bias;
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
