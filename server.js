const express = require('express');
const app = express();
const port = 3001;
const logger = require('morgan');

const database = require('./config/db');
const apiContact = require('./router/Contactapi');
const apiCart = require('./router/Cartapi');
const apiFavourite = require('./router/Favouriteapi');
const apiInvoice = require('./router/Invoiceapi');
const apiInvoiceDetail = require('./router/InvoiceDetailapi')
const apiPayment = require('./router/Paymentapi');
const apiProduct = require('./router/Productapi');
const apiReview = require('./router/Reviewapi')

app.use(express.json());
app.use(logger('dev'));

app.use('/contact',apiContact)
app.use('/cart',apiCart)
app.use('/favourite',apiFavourite)
app.use('/invoice',apiInvoice)
app.use('/invoicedetail',apiInvoiceDetail)
app.use('/payment',apiPayment)
app.use('/product',apiProduct)
app.use('/review',apiReview)

// Gọi phương thức connect từ module ./config/db
database.connect();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('WEB');
});

module.exports = app;
