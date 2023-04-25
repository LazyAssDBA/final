const statesData = {
    states: require('../model/statesData.json'),
    setStates: function (statesData) { this.states = statesData }
};
const State = require('../model/State.js');  // funfacts from MongoDB
const verifyStateCode = require('../middleware/verifyStateCode');

// Added a validation check for the state param
const checkStateCode = async (req, res, next) => {
    const stateCode = req.params.state;
    const isStateValid = verifyStateCode(stateCode);
    return isStateValid ? next() : res.json({ message: "Invalid state abbreviation parameter" });
};

// Tack the funfacts, if any, onto the JSON state data
async function mergeFunFacts() {
    for (const state in statesData.states) {
        const funfact = await State.findOne({ stateCode: statesData.states[state].code }).exec();
        if (funfact) {
            statesData.states[state].funfacts = funfact.funfacts;
        }
    }
}

mergeFunFacts();

const getAllStates = (req, res) => {
    let states = statesData.states;
    if (req.query.contig === 'true') {
        const result = states.filter(st => st.code !== 'AK' && st.code !== 'HI');
        res.json(result);
        return;
    } else if (req.query.contig === 'false') {
        const result = states.filter(state => state.code === 'AK' || state.code === 'HI');
        res.json(result);
        return
    }
    res.json(states);
}

const getState = (req, res) => {
    const state = statesData.states.find(st => st.code === req.params.state.toUpperCase());
    res.json(state);
}

const getCapital = (req, res) => {
    const stateCode = req.params.state;
    const state = statesData.states.find(st => st.code === req.params.state.toUpperCase());
    res.json(({ "state": `${state.state}`,"capital": `${state.capital_city}`}))
}

const getNickname = (req, res) => {
    const state = statesData.states.find(st => st.code === req.params.state.toUpperCase());
    res.json(({ "state": `${state.state}`,"nickname": `${state.nickname}`}))
}

const getPopulation = (req, res) => {
    const state = statesData.states.find(st => st.code === req.params.state.toUpperCase());
    // Need to return population with commas as thousands separator.
    res.json({ "state": state.state,"population": state.population.toLocaleString("en-US")});
}
const getAdmission = (req, res) => {
    const state = statesData.states.find(st => st.code === req.params.state.toUpperCase());
    res.json(({ "state": `${state.state}`,"admitted": `${state.admission_date}`}))
}

const createNewFunFacts = async (req, res) => {
    // Display messages according to sample project when no funfact or not an array.
    if(!req?.body?.funfacts){
        return res.status(400).json({ "message": "State fun facts value required" });
    }
    if(!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ "message": "State fun facts value must be an array" });
    }

    const statecode = req.params.state.toUpperCase();
    try {
        if(!await State.findOneAndUpdate({stateCode: statecode},{$push: {"funfacts": req.body.funfacts}})){   
            await State.create({ 
                stateCode: statecode,
                funfacts: req.body.funfacts
            });
        }
        const result = await State.findOne({stateCode: statecode}).exec();
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
    mergeFunFacts();
}

const deleteFunFact = async (req, res) => {
    let index = req.body.index;
    let validIndex = false;
    try {
        index = parseInt(index);
        validIndex = index > 0;
    } catch (err) {
        validIndex = false;
    }
    if (!validIndex)
    return res.status(400).json({ "message": "State fun fact index value required" });

    const statecode = req.params.state.toUpperCase();
    const state = await State.findOne({ stateCode: statecode }).exec();
    const funfactsArray = state?.funfacts ? state.funfacts : [];
    const jsonstate = statesData.states.find( st => st.code === statecode);

    if (!funfactsArray.length)
        return res.status(400).json({"message": `No Fun Facts found for ${jsonstate.state}`});

    if (index > funfactsArray.length)
        return res.status(400).json({"message": `No Fun Fact found at that index for ${jsonstate.state}`});
    index -= 1;
    funfactsArray.splice(index, 1);

    const result = await state.save();
    res.status(201).json(result);
    mergeFunFacts();
}

const getFunFact = async (req, res) => {
    const statecode = req.params.state.toUpperCase();
    const state = await State.findOne({ stateCode: statecode }).exec();
    const funfactsArray = state?.funfacts ? state.funfacts : [];
    const jsonstate = statesData.states.find( st => st.code === statecode);
    const randomIndex = Math.floor(Math.random() * funfactsArray.length);

    if (funfactsArray.length) {
        return res.status(201).json({ funfact: funfactsArray[randomIndex] })
    } else {
        return res.status(400).json({ message: `No Fun Facts found for ${jsonstate.state}` });
    }
}

module.exports = {
    getAllStates,
    checkStateCode,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    createNewFunFacts,
    deleteFunFact,
    getFunFact
}