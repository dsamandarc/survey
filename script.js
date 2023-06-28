// Response IDs for each category
const performanceids = ["q14", "q21", "q31", "q42", "q53", "q63"];
const convenienceids = ["q12", "q22", "q34", "q44", "q54", "q61"];
const priceids = ["q11", "q23", "q32", "q41", "q52", "q64"];
const designids = ["q13", "q24", "q33", "q43", "q51", "q62"];

// Global variable to store dropdowns
var dropdowns = [];

// Store all questions in a variable
const questions = document.querySelectorAll(".question");

// Store the index of the current question
let currentQuestionIndex = 1;

function updateDropdowns(questionIndex) {
  if (questionIndex === 1) {
    dropdowns = ["q11", "q12", "q13", "q14"];
  } else if (questionIndex === 2) {
    dropdowns = ["q21", "q22", "q23", "q24"];
  } else if (questionIndex === 3) {
    dropdowns = ["q31", "q32", "q33", "q34"];
  } else if (questionIndex === 4) {
    dropdowns = ["q41", "q42", "q43", "q44"];
  } else if (questionIndex === 5) {
    dropdowns = ["q51", "q52", "q53", "q54"];
  } else if (questionIndex === 6) {
    dropdowns = ["q61", "q62", "q63", "q64"];
  }
  var selectedValues = {};

  // Get selected values in all dropdowns
  for (var i = 0; i < dropdowns.length; i++) {
    var dropdown = document.getElementById(dropdowns[i]);
    if (dropdown && dropdown.value !== "") {
      selectedValues[dropdowns[i]] = dropdown.value;
    }
  }

  // Update dropdowns with available options
  for (var j = 0; j < dropdowns.length; j++) {
    var dropdownToUpdate = document.getElementById(dropdowns[j]);
    if (dropdownToUpdate) {
      // clear all options
      dropdownToUpdate.innerHTML = "";

      // add empty option
      var emptyOption = document.createElement("option");
      emptyOption.value = "";
      dropdownToUpdate.appendChild(emptyOption);

      // Add the available options, including those selected in the previous dropdowns
      for (var k = 1; k <= 4; k++) {
        if (selectedValues[dropdowns[j]] === k.toString()) {
          // Add the option selected in the previous dropdowns
          var option = document.createElement("option");
          option.value = k.toString();
          option.textContent = k.toString();
          option.selected = true;
          dropdownToUpdate.appendChild(option);
        } else if (!Object.values(selectedValues).includes(k.toString())) {
          // Add available options, removing those selected in other dropdowns
          var option = document.createElement("option");
          option.value = k.toString();
          option.textContent = k.toString();
          dropdownToUpdate.appendChild(option);
        }
      }
    }
  }
  // Call the check Submit Button function
  checkSubmitButton(dropdowns);
}

function nextQuestion() {
  var currentQuestionElement = document.getElementById("question" + currentQuestionIndex);
  var nextQuestionElement = document.getElementById("question" + (currentQuestionIndex + 1));

  if (currentQuestionElement && nextQuestionElement) {
    currentQuestionElement.style.display = "none";
    nextQuestionElement.style.display = "block";

    var submitButton = document.getElementById("submitButton");
    submitButton.disabled = true;
    currentQuestionIndex++;
  }
}

function showNextQuestion() {
  var currentQuestion = document.getElementById("question" + currentQuestionIndex);
  currentQuestion.style.display = "none";

  if (currentQuestionIndex < questions.length) {
    // Check if it's the last question
    nextQuestion();
  } else if (currentQuestionIndex === questions.length) {
    showResult();
  }
}

function checkSubmitButton(dropdowns) {
  var submitButton = document.getElementById("submitButton");
  var allSelectionsMade = true;

  // Check if all selections were made
  for (var i = 0; i < dropdowns.length; i++) {
    var dropdown = document.getElementById(dropdowns[i]);
    if (!dropdown || dropdown.value === "") {
      allSelectionsMade = false;
      break;
    }
  }

  // Enable or disable the "Submit" button
  submitButton.disabled = !allSelectionsMade;
}

function showResult() {
  // Hide the form
  const surveyForm = document.getElementById("surveyForm");
  surveyForm.style.display = "none";

  // Hide the instructions
  const instructions = document.getElementById("instructions");
  instructions.style.display = "none";

  // Display ranking
  const rankingList = document.getElementById("rankingList");
  rankingList.style.display = "block";

  // Display the chart
  const chartResult = document.getElementById("chartResult");
  chartResult.style.display = "block";

  // Retrieves form data
  const form = document.getElementById("surveyForm");
  const formData = new FormData(form);

  // Function to calculate the total score
  function calculateScore(formData, ids) {
    let result = 0;
    for (let i = 0; i < ids.length; i++) {
      result += parseInt(formData.get(ids[i]));
    }
    return result;
  }

  // Calculate scores using form data
  const performanceScore = calculateScore(formData, performanceids);
  const convenienceScore = calculateScore(formData, convenienceids);
  const priceScore = calculateScore(formData, priceids);
  const designScore = calculateScore(formData, designids);

  // Chart configuration
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Performance", "Convenience", "Price", "Design"],
      datasets: [
        {
          label: "Category",
          data: [performanceScore, convenienceScore, priceScore, designScore],
          backgroundColor: ["#FF9933", "#FF99CC", "#00CC66", "#6699CC"],
          hoverOffset: 4,
          radius: "90%",
        },
      ],
    },
    options: {
      plugins: {
        title: {
          text: "Consumer Preference",
          display: true,
          color: "#fff",
          font: {
            size: 18,
          },
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            color: "#fff",
            font: {
              size: 18,
              lineHeight: 2,
            },
          },
        },
      },
    },
  });

  // Array with scores
  let scores = [
    { label: "Performance", score: performanceScore / 1.2 },
    { label: "Convenience", score: convenienceScore / 1.2 },
    { label: "Price", score: priceScore / 1.2 },
    { label: "Design", score: designScore / 1.2 },
  ];

  // Sort scores in descending order
  scores = scores.sort((a, b) => b.score - a.score);

  // Show the ranking
  rankingList.innerHTML = "";

  scores.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.label}: ${entry.score.toFixed(0)}%`;
    listItem.classList.add("tag");
    rankingList.appendChild(listItem);
  });
}
