document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link');
    const content = document.getElementById('content');

    const loadContent = async (section) => {
        try {
            const response = await fetch(`/view/${section}.ejs`);
            const text = await response.text();
            content.innerHTML = text;

            // Execute additional scripts based on the section loaded
            if (section === 'addHotels') {
                fetchHotelData();
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
    };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            loadContent(section);
            links.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Load initial content
    loadContent('dashboard');
});

async function fetchHotelData() {
    const datajson = "/api/hotel/ownerHotel";
    try {
        const response = await fetch(datajson);
        const data = await response.json();
        console.log("data", data);
        const tableBody = document.getElementById("tableBody");

        data.hotel.forEach(hotel => {
            const rowHTML = `
                <tr>
                    <td>${hotel.name}</td>
                    <td>${hotel.country}</td>
                    <td>${hotel.state}</td>
                    <td>${hotel.city}</td>
                    <td>
                        <button class="edit-btn btn btn-warning" data-hotel-id="${hotel._id}">Edit</button>
                        <button class="add-room-btn btn btn-success" data-hotel-id="${hotel._id}">Add Room</button>
                        <button class="delete-btn btn btn-danger" data-hotel-id="${hotel._id}">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', rowHTML);
        });

        
        tableBody.addEventListener('click', function(event) {
            const hotelId = event.target.dataset.hotelId;
            if (event.target.classList.contains('edit-btn')) {
                openEditModal(hotelId);
            } else if (event.target.classList.contains('add-room-btn')) {
                openAddRoomModal(hotelId);
            } else if (event.target.classList.contains('delete-btn')) {
                deleteHotel(hotelId);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function openEditModal(hotelId) {
    fetch(`/api/hotel/updateHotel/${hotelId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(hotel => {
            document.getElementById('editHotelName').value = hotel.name;
            document.getElementById('editHotelCountry').value = hotel.country;
            document.getElementById('editHotelState').value = hotel.state;
            document.getElementById('editHotelCity').value = hotel.city;
            document.getElementById('editHotelZipCode').value = hotel.zipCode;
            document.getElementById('editHotelDescription').value = hotel.description;
            document.getElementById('editHotelFacilities').value = hotel.facilities;
            document.getElementById('editHotelId').value = hotel._id;
            
            const editHotelModal = new bootstrap.Modal(document.getElementById('editHotelModal'));
            editHotelModal.show();
        })
        .catch(error => console.error('Error:', error));
}



function openAddRoomModal(hotelId) {
    const addRoomForm = document.getElementById('addRoomForm');
    if (addRoomForm) {
        addRoomForm.action = `/api/hotel/${hotelId}/addRoom`;
        document.getElementById('roomHotelId').value = hotelId;

        const addRoomModal = new bootstrap.Modal(document.getElementById('addRoomModal'));
        addRoomModal.show();
    } else {
        console.error('Add Room Form not found');
    }
}


function deleteHotel(hotelId) {
    fetch(`/api/hotel/deleteHotel/${hotelId}`, { method: 'DELETE' })
        .then(() => location.reload())  // Reload the page after successful deletion
        .catch(error => console.error('Error:', error));
}
