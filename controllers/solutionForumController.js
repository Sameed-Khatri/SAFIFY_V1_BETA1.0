const searchForumService = require('../services/solutionForumService');

const fetchAllSolutions = async (req, res) => {
    try {
        const result = await searchForumService.fetchAllSolutions();

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ status: 'Internal server error', error: error.message });
    }
};

module.exports = {
    fetchAllSolutions
};