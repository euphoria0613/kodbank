document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const registerBtn = document.getElementById('registerBtn');
    const alert = document.getElementById('alert');
    
    // Get form values
    const uid = document.getElementById('uid').value.trim();
    const uname = document.getElementById('uname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    
    // Validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    // Phone number validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        showAlert('Please enter a valid 10-digit phone number!', 'error');
        return;
    }
    
    // Show loading state
    registerBtn.disabled = true;
    registerBtn.innerHTML = '<span class="loading"></span> Creating Account...';
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uid,
                uname,
                password,
                email,
                phone,
                role
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert(data.message, 'success');
            
            // Trigger confetti
            const confetti = new Confetti();
            confetti.trigger();
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 2000);
        } else {
            showAlert(data.message, 'error');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Register';
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed. Please try again.', 'error');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Register';
    }
});

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    if (type === 'success') {
        setTimeout(() => {
            alert.className = 'alert alert-success';
        }, 3000);
    }
}
