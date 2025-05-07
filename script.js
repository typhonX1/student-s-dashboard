const cards = document.querySelectorAll('.card');
let current = 1;

function updateCarousel() {
  cards.forEach((card, index) => {
    card.classList.remove('active', 'left', 'right');
    card.querySelector('.card-content').classList.add('hidden');

    if (index === current) {
      card.classList.add('active');
    } else if (index === (current + 1) % cards.length) {
      card.classList.add('right');
    } else if (index === (current - 1 + cards.length) % cards.length) {
      card.classList.add('left');
    }
  });
}

// Add event listeners
cards.forEach((card, idx) => {
  card.querySelector('.nextBtn').addEventListener('click', () => {
    current = (current + 1) % cards.length;
    updateCarousel();
  });

  card.querySelector('.prevBtn').addEventListener('click', () => {
    current = (current - 1 + cards.length) % cards.length;
    updateCarousel();
  });

  card.addEventListener('click', () => {
    if (card.classList.contains('active')) {
      const content = card.querySelector('.card-content');
      content.classList.toggle('hidden');
    }
  });
});

// Slow down video playback
const bgVideo = document.getElementById('background-video');
bgVideo.playbackRate = 0.5;

updateCarousel();
