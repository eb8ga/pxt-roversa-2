// go right 90 degrees
input.onButtonPressed(Button.A, () => {
    roversa.turnRight(90);
})
// go forward 10
input.onButtonPressed(Button.B, () => {
    roversa.driveForwards(10);
})
// stop
input.onButtonPressed(Button.AB, () => {
    roversa.stop
})

