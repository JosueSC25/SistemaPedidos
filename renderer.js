async function registerUser(name, username, password, email) {
    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, password, email })
    });
    return response.json();
}

async function loginUser(username, password) {
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    return response.json();
}

async function createOrder(order) {
    const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    });
    return response.json();
}

async function getOrders() {
    const response = await fetch('http://localhost:3000/api/orders');
    return response.json();
}

async function deleteOrder(id) {
    const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

async function updateOrder(id, order) {
    const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    });
    return response.json();
}


document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('user');
    const signupButton = document.getElementById('registro');
    const orderButton = document.getElementById('order');
    
    const loginSection = document.getElementById('login-section');
    const signupSection = document.getElementById('signup-section');
    const orderSection = document.getElementById('order-section');
    
    loginButton.addEventListener('click', () => {
        showSection(loginSection);
    });
    
    signupButton.addEventListener('click', () => {
        showSection(signupSection);
    });
    
    orderButton.addEventListener('click', () => {
        showSection(orderSection);
    });
    
    function showSection(section) {
        loginSection.classList.remove('active');
        signupSection.classList.remove('active');
        orderSection.classList.remove('active');
        
        section.classList.add('active');
    }
});