const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) { this.states = data }
};

const getAllStates = (req, res) => {
    let states = data.states;
    if (req.query.contig === 'true') {
        states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
    } else if (req.query.contig === 'false') {
        states = states.filter(state => state.code === 'AK' || state.code === 'HI');
    }
    res.json(states);
}

const getState = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": `State Code ${req.params.state} not found`})
    }
    res.json(state);
}

const getCapital = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": `State Code ${req.params.state} not found`})
    }
    res.json(({ "state": `${state.state}`,"capital": `${state.capital_city}`}))
}

const getNickname = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": `State Code ${req.params.state} not found`})
    }
    res.json(({ "state": `${state.state}`,"nickname": `${state.nickname}`}))
}

const getPopulation = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": `State Code ${req.params.state} not found`})
    }
    res.json(({ "state": `${state.state}`,"population": `${state.population}`}))
}
const getAdmission = (req, res) => {
    const state = data.states.find(st => st.code === req.params.state.toUpperCase());
    if (!state) {
        return res.status(400).json({ "message": `State Code ${req.params.state} not found`})
    }
    res.json(({ "state": `${state.state}`,"admitted": `${state.admission_date}`}))
}

const createNewFunfact = async (req, res) => {
    if (!req?.body?.state) {
        return res.status(400).json({ "message": `State Code ${req.params.state} not found` });
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

module.exports = {
    getAllStates,
    getState,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
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