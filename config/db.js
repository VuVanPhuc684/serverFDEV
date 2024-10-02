const mongoose = require('mongoose');
const { uri } = require('./mongoose_server');

mongoose.set('strictQuery', true);

const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = { connect };
