const express = require("express");
const app = express();
const morgan = require('morgan');

const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use( (req, res, next) => {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header(
        'Acces-Control-Allow-Header',
        'Content-Type, Origin, X-Requested-With, Accept, Authorization'
    );
    
    if(req.method == 'OPTIONS'){
        req.header('Acess-Control-Allow-Methods', 'PUT', 'POST', 'PATH', 'DELETE', 'GET');
        return res.status(200).send({});
    }
    next();
});

app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.use((req, res, next) => {
    const error = new Error('Não encontrado');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=> {
    res.status(error.status || 500);
    return res.send({
        error: {
            message: error.message
        }
    })
});

module.exports = app;