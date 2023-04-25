// This gets the state data from the JSON file
const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
};

// This gets the funfacts from MongoDB
const State = require('../model/State.js');

// Tack the funfacts, if any, onto the JSON data for each state
async function mergeFunFacts() {
    for (const state in data.states) {
        const funfact = await State.findOne({ stateCode: data.states[state].code }).exec();
        if (funfact) {
            data.states[state].funfacts = funfact.funfacts;
        }
    }
}

mergeFunFacts();

const getAllStates = (req, res) => {
    let states = data.states;
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
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" })
    }
    res.json(state);
}

const getCapital = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" })
    }
    res.json(({ "state": `${state.state}`,"capital": `${state.capital_city}`}))
}

const getNickname = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" })
    }
    res.json(({ "state": `${state.state}`,"nickname": `${state.nickname}`}))
}

const getPopulation = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" })
    }
    // Need to return population with commas as thousands separator.
    res.json({ "state": state.state,"population": state.population.toLocaleString("en-US")});
}
const getAdmission = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" })
    }
    res.json(({ "state": `${state.state}`,"admitted": `${state.admission_date}`}))
}

const createNewFunFacts = async (req, res) => {
    // Display messages according to sample project when invalid state, no funfact, and not an array.
    if (!req?.params?.state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }

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
    // Display messages according to testing site when invalid state, no funfact, and not an array.
    if (!req?.params?.state) {
        return res.status(400).json({ "message": "Invalid state abbreviation parameter" });
    }

    if(!req?.body?.index){
        return res.status(400).json({ "message": "State fun fact index value required" });
    }

    const statecode = req.params.state.toUpperCase();
    try {
        const state = await State.findOne({ stateCode: statecode }).exec();
        const jsonstate = data.states.find( st => st.code == statecode);
        let index = req.body.index;
        if (!jsonstate.funfacts || index -1 == 0) {
            return res.status(400).json({"message": `No Fun Facts found for ${jsonstate.state}`});
        }
        if(index > state.funfacts.length || index < 1 || !index) {
            const state = data.states.find( st => st.code == statecode);
            return res.status(400).json({"message": `No Fun Fact found at that index for ${jsonstate.state}`});
        }
        index -= 1;
        state.funfacts.splice(index, 1);
        const result = await state.save();
        res.status(201).json(result);
        mergeFunFacts();
    } catch (err) {
        console.error(err);
    }
}

const getFunFacts = async (req, res) => {
    let code = req.params.code;
    code = code.toUpperCase();
    for(x = 0; x < data.states.length; x++) {
        let array = Object.entries(data.states).map(([key,value])=>value);
        if(code == array[x].code){
            var facts = await State.findOne({ stateCode: code }).exec();
            var result = data.states.filter(obj=> obj.code == code);
            var updatedState = result[0].state;
            if(facts != null) {
                var resultObject = { funfacts: facts.funfacts };
                var resultIndex = Math.floor(Math.random() * resultObject.funfacts.length);
                var funfact = resultObject.funfacts[resultIndex];
                var updatedReturn = { funfact };
                
                return res.json(updatedReturn);
            }  
            return res.json({"message": `No Fun Facts found for ${updatedState}`});
        }
    } 
    return res.json({"message":"Invalid state abbreviation parameter"});
}

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    createNewFunFacts,
    deleteFunFact,
    getFunFacts
}

/*
const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.' });
    res.json(employees);
}

const createNewEmployee = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ 'message': 'First and last names are required' });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateEmployee = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const deleteEmployee = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.body.id}.` });
    }
    const result = await employee.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}.` });
    }
    res.json(employee);
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}
*/