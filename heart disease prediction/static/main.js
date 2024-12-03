const ageInput = document.querySelector("#age");
const sexInput = document.querySelector("#sex");
const cpInput = document.querySelector("#cp");
const trestbpsInput = document.querySelector("#trestbps");
const cholInput = document.querySelector("#chol");
const fbsInput = document.querySelector("#fbs");
const restecgInput = document.querySelector("#restecg");
const thalachInput = document.querySelector("#thalach");
const exangInput = document.querySelector("#exang");
const oldpeakInput = document.querySelector("#oldpeak");
const slopeInput = document.querySelector("#slope");
const caInput = document.querySelector("#ca");
const thalInput = document.querySelector("#thal");

const predictButton = document.querySelector("#predict-button");
const clearButton = document.querySelector("#clear-button");
const loader = document.querySelector("#loader");
const resultLabel = document.querySelector("#result-label");

predictButton.addEventListener("click", () => {
  // Collect input values
  const predictionData = {
    age: ageInput.value,
    sex: sexInput.value,
    cp: cpInput.value,
    trestbps: trestbpsInput.value,
    chol: cholInput.value,
    fbs: fbsInput.value,
    restecg: restecgInput.value,
    thalach: thalachInput.value,
    exang: exangInput.value,
    oldpeak: oldpeakInput.value,
    slope: slopeInput.value,
    ca: caInput.value,
    thal: thalInput.value,
  };

  console.log(predictionData);

  // Check if all required fields are filled
  if (Object.values(predictionData).every((value) => value)) {
    loader.classList.add("active");

    // Send data to backend for prediction
    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(predictionData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const { result: prediction } = data || {};

        // Show prediction result
        if (prediction === 1) {
          resultLabel.classList.remove("bg-success");
          resultLabel.classList.add("active", "bg-danger");
          resultLabel.textContent = "High Risk of Heart Disease";
        } else {
          resultLabel.classList.remove("bg-danger");
          resultLabel.classList.add("active", "bg-success");
          resultLabel.textContent = "Low Risk of Heart Disease";
        }

        loader.classList.remove("active");
      })
      .catch((error) => {
        loader.classList.remove("active");
        resultLabel.classList.add("active", "bg-warning");
        resultLabel.textContent = "Error: Could not fetch prediction.";
      });
  } else {
    resultLabel.classList.add("active", "bg-warning");
    resultLabel.textContent = "Please fill all fields.";
  }
});

clearButton.addEventListener("click", () => {
  // Clear all form inputs and result
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  resultLabel.classList.remove(
    "active",
    "bg-danger",
    "bg-success",
    "bg-warning"
  );
  resultLabel.textContent = "";
});
