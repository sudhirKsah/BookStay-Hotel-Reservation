document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar .nav-link');
    const content = document.getElementById('content');

    const loadContent = async (section) => {
        try {
            console.log(section);
            console.log(`/view/${section}.ejs`)
            const response = await fetch(`/view/${section}.ejs`);
            const text = await response.text();
            content.innerHTML = text;

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
            console.log(section);
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
                if (confirm('Do you want to delete this hotel?')) {
                    deleteHotel(hotelId);
                }
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

function openEditModal(hotelId) {
    fetch(`/api/hotel/editHotel/getHotel/${hotelId}`)
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
            
            // document.getElementById('editHotelForm').action = `/api/hotel/updateHotel/${hotel._id}`;

            const editHotelModal = new bootstrap.Modal(document.getElementById('editHotelModal'));
            editHotelModal.show();
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('editHotelForm').addEventListener('submit', (event) => {
    event.preventDefault(); 
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    fetch(`/api/hotel/updateHotel/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            console.log('Update result:', result);

            if (result.message === 'Hotel updated successfully!') {
                alert('Hotel updated successfully!');
              
                const editHotelModal = bootstrap.Modal.getInstance(document.getElementById('editHotelModal'));
                editHotelModal.hide();

                location.reload();
            } else {
                alert('Failed to update hotel.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update hotel.');
        });
});






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
        .then(() => location.reload())
        .catch(error => console.error('Error:', error));
}
