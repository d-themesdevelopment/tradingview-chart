function addPerfMark(markName) {
    "use strict";

    // Function to create a timestamp with the provided markName
    function timeStamp(markName) {
        if (console.timeStamp) {
            console.timeStamp(markName);
        }
    }

    // Function to create a performance mark with the provided markName
    function performanceMark(markName) {
        if (window.performance && performance.mark) {
            performance.mark(markName);
        }
    }

    // Call the timeStamp and performanceMark functions with the given markName
    timeStamp(markName);
    performanceMark(markName);
}

// Export the addPerfMark function
export default addPerfMark;
