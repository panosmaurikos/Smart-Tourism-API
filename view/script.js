document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addForm = document.getElementById('addForm');
    const filterForm = document.getElementById('filterForm');
    const resetFilterBtn = document.getElementById('resetFilter');
    const countriesBody = document.getElementById('countriesBody');
    const editModal = document.getElementById('editModal');
    const closeModal = document.querySelector('.close');
    const saveEditBtn = document.getElementById('saveEdit');
    let currentEditId = null;

    // load data
    loadCountries();

    // Add a new country
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/countries', { // POST request to /api/countries
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Country: data.Country,
                    "Quality of Life": data.Quality_of_Life || null,
                    Adventure: data.Adventure || null,
                    Heritage: data.Heritage || null,
                    "Cost of Living Index": data.Cost_of_Living_Index || null,
                    "Restaurant Price Index": data.Restaurant_Price_Index || null
                })
            });
            const result = await response.json();
            alert(`Country added: ${result.Country}`); // Show success message
            loadCountries();
            addForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding country');
        }
    });

    // Filter countries 
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const criterion = document.getElementById('criterion').value;
        const type = document.getElementById('type').value; // Required type
        const limit = document.getElementById('limit').value; // Optional limit
        
        let url = `/api/countries/filter?criterion=${encodeURIComponent(criterion)}&type=${type}`; 
        if (limit) url += `&limit=${limit}`;
        
        loadCountries(url);
    });

    // Reset filter
    resetFilterBtn.addEventListener('click', () => {
        filterForm.reset();
        loadCountries();
    });

    // Load countries from the server using fetch 
    async function loadCountries(url = '/api/countries') { //
        try {
            const response = await fetch(url);
            const countries = await response.json();
            renderCountries(countries);
        } catch (error) {
            console.error('Error loading countries:', error);
            alert('Error loading countries');
        }
    }

    // Display countries in the table
    function renderCountries(countries) {
        countriesBody.innerHTML = '';
        
        if (countries.length === 0) {
            countriesBody.innerHTML = '<tr><td colspan="7">No countries found</td></tr>';
            return;
        }

        countries.forEach(country => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${country.Country}</td>
                <td>${country['Quality of Life'] ?? '-'}</td>
                <td>${country.Adventure ?? '-'}</td>
                <td>${country.Heritage ?? '-'}</td>
                <td>${country['Cost of Living Index'] ?? '-'}</td>
                <td>${country['Restaurant Price Index'] ?? '-'}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${country._id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${country._id}">Delete</button>
                </td>
            `;
            countriesBody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                currentEditId = e.target.dataset.id;
                try {
                    console.log('Fetching country with ID:', currentEditId); // Debug log
                    const country = await fetchCountry(currentEditId);
                    console.log('Received country data:', country); // Debug log
                    openEditModal(country);
                } catch (error) {
                    console.error('Error in edit button:', error);
                    alert('Error loading country data. Please check console for details.');
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deleteCountry(e.target.dataset.id));
        });
    }

    async function fetchCountry(id) {
        try {
            const response = await fetch(`/api/countries/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching country:', error);
            throw error; 
        }
    }

    // Open edit poop up page 
    function openEditModal(country) {
        document.getElementById('editCountry').value = country.Country;
        document.getElementById('editQuality').value = country['Quality of Life'] || '';
        document.getElementById('editAdventure').value = country.Adventure || '';
        document.getElementById('editHeritage').value = country.Heritage || '';
        document.getElementById('editCost').value = country['Cost of Living Index'] || '';
        document.getElementById('editRestaurant').value = country['Restaurant Price Index'] || '';
        editModal.style.display = 'block';
    }

    // Close 
    closeModal.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    // Save changes
    saveEditBtn.addEventListener('click', async () => {
        const data = {
            Country: document.getElementById('editCountry').value,
            "Quality of Life": document.getElementById('editQuality').value || null,
            Adventure: document.getElementById('editAdventure').value || null,
            Heritage: document.getElementById('editHeritage').value || null,
            "Cost of Living Index": document.getElementById('editCost').value || null,
            "Restaurant Price Index": document.getElementById('editRestaurant').value || null
        };
    
        try {
            const response = await fetch(`/api/countries/${currentEditId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update country');
            }
            
            const result = await response.json();
            console.log('Update successful:', result);
            editModal.style.display = 'none';
            loadCountries();
        } catch (error) {
            console.error('Error updating country:', error);
            alert(`Error updating country: ${error.message}`);
        }
    });

    // Delete country
    async function deleteCountry(id) {
        if (confirm('Are you sure you want to delete this country?')) {
            try {
                await fetch(`/api/countries/${id}`, { method: 'DELETE' });
                loadCountries();
            } catch (error) {
                console.error('Error deleting country:', error);
                alert('Error deleting country');
            }
        }
    }
});