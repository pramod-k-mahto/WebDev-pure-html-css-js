function submitForm() {
  const form = document.getElementById('signupForm');
  const formData = new FormData(form);

  // Convert FormData to an object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch('http://localhost:3000/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject),
  })
    .then(response => response.text())
    .then(data => {
      alert(data);
      form.reset();
    })
    .catch(error => console.error('Error:', error));
}
