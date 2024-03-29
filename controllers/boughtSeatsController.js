const BoughtSeat = require('../models/boughtSeats');
const paypal = require('paypal-rest-sdk');
const Payment = require('../models/payment')

const buySeats = async (req, res) => {
    try {
        const { userId, movieId, date, time, seats } = req.body;
        const boughtSeat = await BoughtSeat.create({ userId, movieId, date, time, seats });
        const newPayment = new Payment({
            userId: userId,
            amount: seats.length * 200,
            status: 'completed'
        });

        newPayment.save().then(() => {
            console.log('Payment saved successfully');
        }).catch(error => {
            console.error('Error saving payment:', error);
        });
        res.status(201).json(boughtSeat);
    } catch (error) {
        console.error('Error creating bought seat:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const getBookedSeats = async (req, res) => {
    try {
        const { movieId, date, time } = req.params;
        const bookedSeats = await BoughtSeat.find({ movieId: movieId, date: date, time: time });
        res.json(bookedSeats.map(seat => seat.seats).flat());
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = { buySeats, getBookedSeats };