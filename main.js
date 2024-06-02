const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./user');
const Order = require('./order');

const appServer = express();
const port = 3000;

appServer.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Rutas de la API
appServer.post('/api/register', async (req, res) => {
    const { name, username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
        name,
        username,
        password: hashedPassword,
        email
    });

    try {
        const savedUser = await user.save();
        res.send({ id: savedUser._id });
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

appServer.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            res.send({ message: 'Login successful' });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

appServer.post('/api/orders', async (req, res) => {
    const { senderName, orderType, description, deliveryDate, collectionDate, quantity, cost, userId } = req.body;

    const order = new Order({
        senderName,
        orderType,
        description,
        deliveryDate,
        collectionDate,
        quantity,
        cost,
        userId
    });

    try {
        const savedOrder = await order.save();
        res.send({ id: savedOrder._id });
    } catch (err) {
        res.status(500).send('Error creating order');
    }
});

appServer.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.send(orders);
    } catch (err) {
        res.status(500).send('Error retrieving orders');
    }
});

appServer.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Order.findByIdAndDelete(id);
        res.send({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).send('Error deleting order');
    }
});

appServer.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { senderName, orderType, description, deliveryDate, collectionDate, quantity, cost } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, {
            senderName,
            orderType,
            description,
            deliveryDate,
            collectionDate,
            quantity,
            cost
        }, { new: true });

        res.send({ message: 'Order updated successfully' });
    } catch (err) {
        res.status(500).send('Error updating order');
    }
});

appServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Crear la ventana de la aplicación
function createWindow() {
    const win = new BrowserWindow({
        width: 500,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

app.on('ready', createWindow);