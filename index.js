const express = require('express');

const app = express();

const products = [
    { id: 1, title: 'Product1'},
    { id: 2, title: 'Product2'},
    { id: 3, title: 'Product3'}
]

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/products', (req, res) => res.send(products));

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if(!product) {
        res.status(404).send('No product was found.');
    } else {
        res.send(product);
    }
});

const port = process.env.PORT || 3005;
console.log(port);
app.listen(3005);