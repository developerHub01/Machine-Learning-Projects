const spxInput = document.querySelector("#spx");
const usoInput = document.querySelector("#uso");
const slvInput = document.querySelector("#slv");
const eurUsdInput = document.querySelector("#eur_usd");
const dateInput = document.querySelector("#date");

const predictButton = document.querySelector("#predict-button");
const clearButton = document.querySelector("#clear-button");
const loader = document.querySelector("#loader");

const resultLabel = document.querySelector("#result-label");

predictButton.addEventListener("click", () => {
  const dateSplited = dateInput.value?.split("-")?.reverse();

  const predictionData = {
    spx: spxInput.value,
    uso: usoInput.value,
    slv: slvInput.value,
    eur_usd: eurUsdInput.value,
    date: dateSplited,
  };

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
        const { result: prediction } = data || {};
        resultLabel.classList.add("active");

        if (prediction > 0) {
          resultLabel.classList.remove("bg-danger");
          resultLabel.classList.add("bg-success");
          resultLabel.textContent = `Predicted Gold Price: $${prediction.toFixed(
            4
          )}`;
        } else {
          resultLabel.classList.remove("bg-success");
          resultLabel.classList.add("bg-danger");
          resultLabel.textContent = "Prediction Error.";
        }

        loader.classList.remove("active");
      })
      .catch((error) => {
        console.log(error);

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
