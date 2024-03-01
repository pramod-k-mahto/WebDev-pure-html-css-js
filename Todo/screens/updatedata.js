document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('itemId');
    const userName = urlParams.get('list');
    console.log(itemId)
    myupdate(itemId, userName);
});

async function myupdate(userId, decodedText) {
    const id = document.getElementById("main-div");

    id.innerHTML = `
        <form id="updateForm" action="http://localhost:3000/todolist/update/${userId}" method="POST">
            <input type="text" name="name" class="input-field" placeholder="Enter New List" value="${decodedText}" required>
            <button type="submit" class="update-btn">Update</button>
        </form>
    `;

    // Add event listener for the "Go Back" link
    document.getElementById("goback").addEventListener("click", function () {
        window.history.back();
    });

    // Add event listener for the form submission
    document.getElementById("updateForm").addEventListener("submit", function (e) {
        e.preventDefault();
        update(userId);
    });
}

async function update(userId) {
    const list = document.querySelector('.input-field').value;

    try {
        const response = await fetch(`http://localhost:3000/todolist/update/${userId}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list }),
        });

        if (response.ok) {
            const successMessage = document.getElementById('success-message');
            successMessage.style.display = 'block';

            setTimeout(() => {
                successMessage.style.display = 'none';
                goBack();
            }, 1000); // 1 second

            async function goBack() {
                await window.history.back();
            }

        } else {
            console.error('Failed to update user data');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
    }
}
