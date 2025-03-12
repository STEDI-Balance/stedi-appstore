/**
 * BleCounter component that tracks steps based on BLE characteristic data.
 * 
 * @param {Object} props - The properties object.
 * @param {Object} props.stepDone - A ref object that keeps track of whether a step has been completed.
 * @param {Function} props.tallyLatestSteps - A function to tally the latest steps.
 * @param {number} props.bleCharacteristic - The BLE characteristic value representing the distance.
 * 
 * @returns {Object} An object containing the checkNewStep function.
 */
const BleCounter = ({stepDone, tallyLatestSteps, bleCharacteristic}) =>{

    const floorHeight = 38;
    const distance = bleCharacteristic;

    const addStep = async() =>{
        console.log("ADDING STEP!");
        tallyLatestSteps();
    }

    /**
     * Checks if a new step has been completed based on the current measured distance and floor height.
     * If a step is completed and the distance is less than the floor height minus one, it adds a step and resets the stepDone flag.
     * If the distance is greater than or equal to the floor height minus one, it sets the stepDone flag to true.
     */
    const checkNewStep = () => {
        console.log("stepDone: " + stepDone.current);

            if (stepDone.current && distance < floorHeight-1) {
                addStep()
                stepDone.current = false;
            } else if (distance >= floorHeight-1) {
                stepDone.current = true;
            }
    }

    return { checkNewStep };
};

export default BleCounter;
