function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const buttons = document.querySelectorAll('.menu-btns button');
    
    sections.forEach(sec => sec.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
  
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
  }
  