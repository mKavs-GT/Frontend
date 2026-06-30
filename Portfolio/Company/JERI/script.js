// Personality Quiz Data
const quizData = {
  questions: [
    {
      question: "What's your living situation?",
      options: [
        { text: "Apartment or small space", value: "apartment" },
        { text: "House with a small yard", value: "smallHouse" },
        { text: "House with a large yard", value: "largeHouse" },
        { text: "Farm or rural property", value: "rural" }
      ]
    },
    {
      question: "How active is your lifestyle?",
      options: [
        { text: "Not very active", value: "low" },
        { text: "Moderately active", value: "medium" },
        { text: "Very active", value: "high" },
        { text: "Extremely active", value: "extreme" }
      ]
    },
    {
      question: "How much time can you spend daily with a pet?",
      options: [
        { text: "Less than 1 hour", value: "low" },
        { text: "1-2 hours", value: "medium" },
        { text: "2-4 hours", value: "high" },
        { text: "4+ hours", value: "extreme" }
      ]
    },
    {
      question: "Do you have children or other pets?",
      options: [
        { text: "No children or pets", value: "none" },
        { text: "Children under 12", value: "kids" },
        { text: "Other pets", value: "pets" },
        { text: "Both children and pets", value: "both" }
      ]
    },
    {
      question: "What's your experience with pets?",
      options: [
        { text: "First-time pet owner", value: "beginner" },
        { text: "Some experience", value: "intermediate" },
        { text: "Very experienced", value: "advanced" },
        { text: "Professional experience", value: "expert" }
      ]
    }
  ],
  results: {
    dog: {
      title: "A Dog Would Be Perfect For You!",
      description: "Based on your answers, a dog would be a great match for your lifestyle. Dogs offer companionship, love to be active with their owners, and can adapt to various living situations with proper care.",
      pets: ["Pico & Poppy", "Lucy", "Mary"]
    },
    cat: {
      title: "A Cat Would Be Your Ideal Companion!",
      description: "Your lifestyle and preferences suggest that a cat would be the perfect pet for you. Cats are more independent than dogs but still offer plenty of affection and companionship.",
      pets: ["Cleo", "Max", "Moo"]
    },
    smallAnimal: {
      title: "Consider a Small Animal!",
      description: "Based on your responses, a small animal like a rabbit, guinea pig, or hamster might be the best fit. These pets require less space and can be great companions with proper care.",
      pets: ["Bean", "Cashew", "Peanut"]
    },
    lowMaintenance: {
      title: "A Low-Maintenance Pet Would Be Best",
      description: "Your current situation suggests that a lower-maintenance pet would be the best fit. Consider adult cats, senior pets, or small animals that require less daily attention.",
      pets: ["Cleo", "Mary", "Bean"]
    }
  }
};

// DOM Elements
const quizIntro = document.getElementById('quiz-intro');
const quizQuestions = document.getElementById('quiz-questions');
const quizResults = document.getElementById('quiz-results');
const startQuizBtn = document.getElementById('start-quiz');
const prevQuestionBtn = document.getElementById('prev-question');
const nextQuestionBtn = document.getElementById('next-question');
const retakeQuizBtn = document.getElementById('retake-quiz');
const questionContainer = document.getElementById('question-container');
const progressBar = document.getElementById('quiz-progress-bar');
const progressText = document.getElementById('progress-text');
const resultContent = document.getElementById('result-content');

// Quiz State
let currentQuestion = 0;
let answers = [];

// Initialize Quiz
function initQuiz() {
  startQuizBtn.addEventListener('click', startQuiz);
  prevQuestionBtn.addEventListener('click', showPreviousQuestion);
  nextQuestionBtn.addEventListener('click', showNextQuestion);
  retakeQuizBtn.addEventListener('click', retakeQuiz);
}

// Start Quiz
function startQuiz() {
  quizIntro.classList.add('d-none');
  quizQuestions.classList.remove('d-none');
  showQuestion();
}

// Show Question
function showQuestion() {
  // Update progress
  progressBar.style.width = `${(currentQuestion + 1) / quizData.questions.length * 100}%`;
  progressText.textContent = `Question ${currentQuestion + 1} of ${quizData.questions.length}`;
  
  // Update navigation buttons
  prevQuestionBtn.disabled = currentQuestion === 0;
  nextQuestionBtn.textContent = currentQuestion === quizData.questions.length - 1 ? 'See Results' : 'Next';
  
  // Display current question
  const question = quizData.questions[currentQuestion];
  questionContainer.innerHTML = `
    <h4 class="mb-4">${question.question}</h4>
    <div class="quiz-options">
      ${question.options.map((option, index) => `
        <button type="button" class="quiz-option ${answers[currentQuestion] === index ? 'selected' : ''}" 
                data-index="${index}" onclick="selectOption(this)">
          ${option.text}
        </button>
      `).join('')}
    </div>
  `;
}

// Select Option
function selectOption(option) {
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(opt => opt.classList.remove('selected'));
  option.classList.add('selected');
  answers[currentQuestion] = parseInt(option.getAttribute('data-index'));
}

// Show Previous Question
function showPreviousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

// Show Next Question
function showNextQuestion() {
  if (answers[currentQuestion] === undefined) {
    alert('Please select an option before continuing.');
    return;
  }
  
  if (currentQuestion < quizData.questions.length - 1) {
    currentQuestion++;
    showQuestion();
  } else {
    showResults();
  }
}

// Show Results
function showResults() {
  quizQuestions.classList.add('d-none');
  quizResults.classList.remove('d-none');
  
  // Determine result based on answers
  const livingSituation = quizData.questions[0].options[answers[0]].value;
  const activityLevel = quizData.questions[1].options[answers[1]].value;
  const timeAvailable = quizData.questions[2].options[answers[2]].value;
  const household = quizData.questions[3].options[answers[3]].value;
  const experience = quizData.questions[4].options[answers[4]].value;
  
  let resultKey;
  
  if ((livingSituation === 'apartment' || livingSituation === 'smallHouse') && 
      (timeAvailable === 'low' || timeAvailable === 'medium')) {
    if (household === 'kids' || household === 'both') {
      resultKey = 'cat';
    } else {
      resultKey = Math.random() > 0.5 ? 'cat' : 'smallAnimal';
    }
  } else if (activityLevel === 'high' || activityLevel === 'extreme') {
    resultKey = 'dog';
  } else if (experience === 'beginner') {
    resultKey = 'lowMaintenance';
  } else {
    // Default to dog for most situations
    resultKey = 'dog';
  }
  
  const result = quizData.results[resultKey];
  
  // Display result
  resultContent.innerHTML = `
    <div class="result-header mb-4">
      <h4 class="text-purple">${result.title}</h4>
      <p>${result.description}</p>
    </div>
    <div class="result-pets">
      <h5 class="mb-3">Pets That Might Be a Good Match:</h5>
      <div class="row">
        ${result.pets.map(pet => `
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body text-center">
                <h6>${pet}</h6>
                <a href="adopt.html" class="btn btn-sm btn-purple mt-2">Meet ${pet.split(' ')[0]}</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Retake Quiz
function retakeQuiz() {
  currentQuestion = 0;
  answers = [];
  quizResults.classList.add('d-none');
  quizIntro.classList.remove('d-none');
}

// Pet Filter Functionality
function filterPets(type) {
  const pets = document.querySelectorAll('.pet-card');
  pets.forEach(pet => {
    if (type === 'all' || pet.getAttribute('data-type') === type) {
      pet.style.display = 'block';
    } else {
      pet.style.display = 'none';
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initQuiz();
  
  // Pet filter event listeners
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      const filter = event.target.getAttribute('data-filter');
      document.getElementById('filterDropdown').textContent = `Filter by: ${event.target.textContent}`;
      filterPets(filter);
    });
  });
  
  // Pet modal functionality
  const petModal = document.getElementById('petModal');
  if (petModal) {
    petModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const petName = button.getAttribute('data-pet');
      document.getElementById('modalPetName').textContent = petName;
      
      // In a real implementation, you would fetch pet details from a database
      document.getElementById('petAge').textContent = '2 years';
      document.getElementById('petBreed').textContent = 'Mixed Breed';
      document.getElementById('petPersonality').textContent = 'Friendly, playful, loves attention';
      document.getElementById('petNeeds').textContent = 'None';
    });
  }
  
  // Animated counter for stats
  function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  
  // Start animations when stats section comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue("rescuedCount", 0, 1243, 2000);
        animateValue("adoptedCount", 0, 982, 2000);
        animateValue("volunteerCount", 0, 87, 2000);
        animateValue("fosterCount", 0, 42, 2000);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});
  
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
  
  // Contact form validation
  const contactReason = document.getElementById('contactReason');
  const petSelection = document.getElementById('petSelection');
  
  if (contactReason && petSelection) {
    contactReason.addEventListener('change', function() {
      if (this.value === 'adoption') {
        petSelection.style.display = 'block';
      } else {
        petSelection.style.display = 'none';
      }
    });
    
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          event.preventDefault();
          // In a real implementation, you would submit the form data to a server here
          const successModal = new bootstrap.Modal(document.getElementById('successModal'));
          successModal.show();
          form.reset();
          form.classList.remove('was-validated');
        }
        form.classList.add('was-validated');
      }, false);
    }
  }
});

// Make selectOption available globally for HTML onclick
window.selectOption = selectOption;