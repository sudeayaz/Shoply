if (document.body.classList.contains('register')) {
    document.getElementById('emailError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('nameError').style.display = 'none';

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        if (emailExists(email)) {
            document.getElementById('emailError').textContent = 'Email already registered.';
            document.getElementById('emailError').style.display = 'block';
            return;
        }
        if (!validateEmail(email)) {
            document.getElementById('emailError').style.display = 'block';
            return;
        }
        if (!validatePassword(password)) {
            document.getElementById('passwordError').style.display = 'block';
            return; 
        }
        if (validateEmail(email) && validatePassword(password)) {
            saveUserData(email, name, password);
            alert('Registration successful!');
            window.location.href = 'login.html'; 
        }
    });

    function emailExists(email) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email);
    }

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    function validatePassword(password) {
        const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return regex.test(password);
    }

    function saveUserData(email, name, password) {
        const userData = {
            uid: Date.now(),
            email,
            name,
            password: sanitizeInput(password)
        };

        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
    }

    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
}

if (document.body.classList.contains('login')) {
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (validateLogin(email, password)) {
        alert('Login successful!');
        console.log('User logged in.');
        window.location.href = 'index.html';
    } else {
        passwordError.style.display = 'block';
        passwordError.textContent = 'Invalid email or password.';
        console.log('Login failed.');
    }
});


emailError.style.display = 'none';
passwordError.style.display = 'none';

function validateLogin(email, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(user => user.email === email && user.password == password); // Find the index of the user
    console.log(users);
    if (userIndex !== -1) {
        users[userIndex].status = 'logged';
        updateLocalStorage(users);
        return true;
    }
    return false;
}

function updateLocalStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
    console.log('LocalStorage updated with login status.');
}

}