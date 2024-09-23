const solutionForumModel = require('../models/solutionForumModel');

const fetchAllSolutions = async () => {
    try {
        const result = await solutionForumModel.fetchAllSolutions();
        const solutions = result[0]; // Assuming result[0] contains the array of solutions

        // Check if the result is nested and flatten it if necessary
        const flatSolutions = Array.isArray(solutions[0]) ? solutions[0] : solutions;

        let finalResponse = flatSolutions.map(solution => {
            let steps = [];
            let stepCounter = 1;

            // Loop through each step (Step 1 to Step 5) and only include non-null, non-empty steps
            for (let i = 1; i <= 5; i++) {
                let step = solution[`Step ${i}`];
                if (step && step.trim() !== "" && step.toLowerCase() !== "null") {
                    steps.push({ [`Step ${stepCounter}`]: step });
                    stepCounter++;
                }
            }

            // Reconstruct each solution with the "Problem", "Solution", and new "steps" array
            return {
                "Problem": solution.Problem || "No problem specified",
                "Solution": solution.Solution || "No solution specified",
                "steps": steps
            };
        });

        // Send the reconstructed response to the controller
        console.log('final response: ', finalResponse);
        return finalResponse;
        
    } catch (error) {
        console.error('Error service fetching all solutions: ', error);
        throw error;
    }
};

module.exports = {
    fetchAllSolutions
};
