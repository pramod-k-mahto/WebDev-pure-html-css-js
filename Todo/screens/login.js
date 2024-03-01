function submitLoginForm() {
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
  
    fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then(response => {
        if (response.status === 200) {
          alert('Login successful'); // Display a message to the user
          window.location.href='index.html'
          form.reset(); // Clear the form after successful login
        } else {
          alert('Invalid credentials'); // Display an error message
        }
      })
      .catch(error => console.error('Error:', error));
  }
  