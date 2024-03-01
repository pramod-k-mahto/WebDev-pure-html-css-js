
// Function to add data
async function addData() {
  const list = document.getElementById("new-list").value;

  try {
    const response = await fetch("http://localhost:3000/todolist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ list }),
    });

    const responseData = await response.json();
    console.log(responseData);

    if (responseData.status === 200) {
      getData();

      const successMessage = document.getElementById('success-message');
      successMessage.style.display = 'block';

      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 3000);
    } else {
      console.error('Failed to add list');
    }
  } catch (error) {
    console.error('Error adding list:', error);
  }
}

// Function to get data
async function getData() {
  try {
    const response = await fetch('http://localhost:3000/todolist', {
      method: 'GET',
    });

    const todolistData = await response.json();
    displayTodolistData(todolistData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Function to display data
function displayTodolistData(todolistData) {
  const todolistContainer = document.getElementById('todolist');
  todolistContainer.innerHTML = '';

  todolistData.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <div class="list-div">
        <div>
          <p class="list">${item.list}</p>
        </div>

        <div>
          <a href="updatedata.html?itemId=${encodeURIComponent(item.idtodolist)}&list=${encodeURIComponent(item.list)}" class="edit-btn">Edit</a>
          <button class="delete-btn" onclick="deleteItem('${item.idtodolist}')">Delete</button>
        </div>
      </div>
    `;
    todolistContainer.appendChild(itemElement);
  });
}

// Function to delete item
async function deleteItem(itemId) {
  await fetch(`http://localhost:3000/todolist/${itemId}`, {
    method: 'DELETE',
  });
  getData(); // Reload data after deletion
}

// Fetch data on page load
getData();

// Global variable to track the current page
let currentPage = 1;

// Function to display data with pagination
function displayTodolistData(todolistData) {
  const itemsPerPage = 10;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;

  const todolistContainer = document.getElementById('todolist');
  todolistContainer.innerHTML = '';

  // Display items for the current page
  const itemsToDisplay = todolistData.slice(startIdx, endIdx);
  itemsToDisplay.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <div class="list-div">
        <div>
          <p class="list">${item.list}</p>
        </div>

        <div>
          <a href="updatedata.html?itemId=${encodeURIComponent(item.idtodolist)}&list=${encodeURIComponent(item.list)}" class="edit-btn">Edit</a>
          <button class="delete-btn" onclick="deleteItem('${item.idtodolist}')">Delete</button>
        </div>
      </div>
    `;
    todolistContainer.appendChild(itemElement);
  });

  // Add pagination buttons
  addPaginationButtons(todolistData.length, itemsPerPage);
}

// Function to add pagination buttons
function addPaginationButtons(totalItems, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationContainer = document.createElement('div');
  paginationContainer.classList.add('pagination-container');

  const prevButton = createPaginationButton('Previous', () => {
    if (currentPage > 1) {
      currentPage--;
      getData();
    }
  });
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = createPaginationButton(i, () => {
      currentPage = i;
      getData();
    });
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = createPaginationButton('Next', () => {
    if (currentPage < totalPages) {
      currentPage++;
      getData();
    }
  });
  paginationContainer.appendChild(nextButton);

  const todolistContainer = document.getElementById('todolist');
  todolistContainer.appendChild(paginationContainer);
}

// Function to create a pagination button
function createPaginationButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}
