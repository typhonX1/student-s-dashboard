function showSection(id) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
  
    // Highlight active menu
    document.querySelectorAll('.menu li').forEach(li => {
      li.classList.remove('active');
    });
    event.target.classList.add('active');
  }
  