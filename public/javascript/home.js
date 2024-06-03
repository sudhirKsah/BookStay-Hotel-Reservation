const dataJson = "/api/hotel";
const cardCarouselContainer = document.getElementById("card-carousel-container");
const showMoreBtn = document.getElementById("show-more");

let hotelsDataArray = [];
let startingIndex = 0;
let endingIndex = 4;


fetch(dataJson)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    hotelsDataArray = data;
    displayHotelsOnCards(hotelsDataArray.slice(startingIndex, endingIndex));
  })
  .catch(error => console.log("Error occured while fetching data!!! ", error));

const fetchMoreHotels = () => {
  startingIndex += 4;
  endingIndex += 4;
  displayHotelsOnCards(hotelsDataArray.slice(startingIndex, endingIndex));
  if (hotelsDataArray.length <= endingIndex) {
    showMoreBtn.style.display = "none";
  }
}

const displayHotelsOnCards = (hotels) => {
  hotels.forEach((item, index) => {

    const carouselIndicatorsSlideHTML = item.imagesUrl.map((_, index) => {
      const activeSlide = index === 0 ? 'active' : '';
      const ariaCurrent = index === 0 ? 'aria-current="true"' : '';
      return `
                <button type="button" class="border border-white bg-white ${activeSlide}" data-bs-target="#${item._id}" data-bs-slide-to="${index}" ${ariaCurrent} aria-label="Slide ${index + 1}"></button>
            `;
    }).join('');


    // Generate carousel items as HTML strings using map()
    const carouselItemsHTML = item.imagesUrl.map((image, index) => {
      const activeClass = index === 0 ? "active" : "";
      return `
                <div class="carousel-item ${activeClass}">
                    <img src="${image}" class="d-block w-100">
                </div>
                `;
    }).join(''); // Join the HTML strings into a single string
    var cardDisplay = `
    <div class="col">
      <div class="card h-100">

        <div id="${item._id}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              ${carouselIndicatorsSlideHTML}
            </div>
            <div class="carousel-inner" id="carousel-inner">
           ${carouselItemsHTML}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#${item._id}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon border border-danger rounded-circle bg-success" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${item._id}" data-bs-slide="next">
              <span class="carousel-control-next-icon border border-danger rounded-circle bg-success" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.description.length > 50 ? item.description.substring(0, 50) + "....." : item.description}</p>
          <a href="/api/hotel/${item._id}" class="card-link">View Details</a>
        </div>
      </div>
    </div>
    `;

    cardCarouselContainer.innerHTML += cardDisplay;
  })
}


showMoreBtn.addEventListener("click", fetchMoreHotels);

// form validation
document.getElementById('signup-password').addEventListener('input', validatePassword);
document.getElementById('confirm-password').addEventListener('input', validatePassword);

function validatePassword() {
  const signupPassword = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(signupPassword)) {
    passwordError.textContent = 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.';
  } else {
    passwordError.textContent = '';
  }

  if (signupPassword !== confirmPassword) {
    confirmPasswordError.textContent = 'Confirm password does not match password';
  } else {
    confirmPasswordError.textContent = '';
  }
}

document.getElementById('signup-form').addEventListener('submit', function(event) {
  const passwordError = document.getElementById('passwordError').textContent;
  const confirmPasswordError = document.getElementById('confirmPasswordError').textContent;

  if (passwordError || confirmPasswordError) {
    event.preventDefault();
  }
});




// for showing modal with error message
document.addEventListener('DOMContentLoaded', (event) => {
  const loginModal = document.querySelector('#login');
  const signupModal = document.querySelector('#signup');
  if (signupModal.dataset.show === 'true') {
    const modal = new bootstrap.Modal(signupModal);
    modal.show();
  }
  if (loginModal.dataset.show === 'true') {
    const modal = new bootstrap.Modal(loginModal);
    modal.show();
  }
});