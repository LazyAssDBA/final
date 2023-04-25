const statesData = require('../models/statesData.json');

function verifyStateCode(stateCode) {
        const state = statesData.find( st => st.code === stateCode.toUpperCase());
        if (!state) {
                return false;
        }
        return true;
}

module.exports = verifyStateCode;