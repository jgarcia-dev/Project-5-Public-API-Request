const employeesURL = 'https://randomuser.me/api/?results=12&nat=us&inc=name,location,email,dob,phone,cell,picture';
const searchContainer = document.querySelector('.search-container');
const galleryEl = document.getElementById('gallery');
let employees;


// ------------------------------------------
//  HELPER FUNCTIONs
// ------------------------------------------

function showMatches(query) {
    const employeeCards = [...document.getElementsByClassName('card')];
    employeeCards.forEach(card => {
        const employeeName = card.lastElementChild.firstElementChild.textContent.toLowerCase();
        if (employeeName.includes(query.toLowerCase()) === false) {
            card.style.display = 'none';
        } else {
            card.style.display = 'flex';
        }
    }); 
}


// ------------------------------------------
//  CREATE/ADD ELEMENT FUNCTIONS
// ------------------------------------------


function addSearchBar() {
    const searchBar = document.createElement('form');
    searchBar.setAttribute('action', '#');
    searchBar.setAttribute('method', 'get')
    const searchBarHTML = `
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    `
    searchBar.insertAdjacentHTML('afterbegin', searchBarHTML);
    searchContainer.insertAdjacentElement('afterbegin', searchBar);

    const searchField = searchBar.querySelector('#search-input');

    // EVENT lISTENER - search bar submit - initiates search based on search field
    searchBar.querySelector('#search-submit').addEventListener('click', ()=> {
        const query = searchField.value.trim();
        showMatches(query);
    });
}

function addEmployeeCards() {
    // Create and add a card for each employee
    employees.forEach((employee, index) => {
        const card = document.createElement('div');
        card.setAttribute('data-index', index);
        const employeeHTML = `
            <div class="card-img-container">
                <img class="card-img" src=${employee.picture.medium} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        `
        // add HTML to card
        card.insertAdjacentHTML('beforeend', employeeHTML);

        // set style fo card
        card.classList.add('card');

        // insert card on page
        galleryEl.insertAdjacentElement('beforeend', card);

        // EVENT LISTENER - employee card - opens modal with more info on employee
        card.addEventListener('click', (e)=> {
            currEmployeeIndex = parseInt(e.target.closest('.card').getAttribute('data-index'), 10);
            generateModal(currEmployeeIndex);
        });
    });
}


function generateModal(index) {
    let currEmployeeIndex = index;
    const employee = employees[currEmployeeIndex];

    //  Create modal with selected employee data
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modal-container');
    const modalContainerHTML = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.medium}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${employee.cell}</p>
                <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                <p class="modal-text"> Birthday: ${employee.dob.date}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    `
    modalContainer.insertAdjacentHTML('beforeend', modalContainerHTML);

    // add modal to DOM
    document.body.insertAdjacentElement('afterbegin', modalContainer);

    // EVENT LISTENER - close button - closes modal
    modalContainer.querySelector('#modal-close-btn').addEventListener('click', ()=> {
            modalContainer.remove();
    });

    // EVENT LISTENER - modal container - close modal if user clicks outside modal
    modalContainer.addEventListener('click', (e)=> {
        if (e.target.className === 'modal-container') {
            modalContainer.remove();
        }
    });

    // EVENT LISTENER - prev button - update modal with previous employee info
    modalContainer.querySelector('#modal-prev').addEventListener('click', ()=> {
        if (currEmployeeIndex === 0) {
            currEmployeeIndex = employees.length - 1;
        } else {
            currEmployeeIndex--;
        }
        updateModal();
    });

    // EVENT LISTENER - next button - update modal with next employee info
    modalContainer.querySelector('#modal-next').addEventListener('click', ()=> {
        if (currEmployeeIndex === employees.length - 1) {
            currEmployeeIndex = 0;
        } else {
            currEmployeeIndex++;
        }
        updateModal();
    });

    updateModal = ()=> {
        const employee = employees[currEmployeeIndex];
        modalContainer.querySelector('.modal-img').src = employee.picture.medium;
        modalContainer.querySelector('.modal-name').textContent = `${employee.name.first} ${employee.name.last}`;
        modalContainer.getElementsByClassName('modal-text')[0].textContent = employee.email;
        modalContainer.getElementsByClassName('modal-text')[1].textContent =  employee.location.city;
        modalContainer.getElementsByClassName('modal-text')[2].textContent = employee.cell;
        modalContainer.getElementsByClassName('modal-text')[3].textContent = `${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}`;
        modalContainer.getElementsByClassName('modal-text')[4].textContent = employee.dob.date;
    }
}


// ------------------------------------------
//  FETCH REQUEST
// ------------------------------------------

fetch(employeesURL)
    .then(response => response.json())
    .then(data => employees = data.results)
    .then(addEmployeeCards)
    .then(addSearchBar);