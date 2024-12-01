const mainText = document.querySelector("#main-text");
const predictButton = document.querySelector("#predict-button");
const clearButton = document.querySelector("#clear-button");
const loader = document.querySelector("#loader");
const resultLabel = document.querySelector("#result-label");

mainText.value = "";

predictButton.addEventListener("click", () => {
  const emailContent = mainText.value;

  if (emailContent) {
    loader.classList.add("active");

    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { isSpam } = data || {};

        if (isSpam) {
          resultLabel.classList.remove("bg-success");
          resultLabel.classList.add("active", "bg-danger");
        } else {
          resultLabel.classList.remove("bg-danger");
          resultLabel.classList.add("active", "bg-success");
        }
        resultLabel.textContent = isSpam ? "SPAM" : "NOT SPAM";

        loader.classList.remove("active");
      })
      .catch((error) => {
        loader.classList.remove("active");
      });
  }
});

clearButton.addEventListener("click", () => {
  mainText.value = "";
  resultLabel.classList.remove("active", "bg-danger", "bg-success");
  resultLabel.textContent = "";
});
