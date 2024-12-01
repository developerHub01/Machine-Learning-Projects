from flask import Flask, request, render_template, jsonify
import joblib
from sklearn.feature_extraction.text import CountVectorizer

app = Flask(__name__)

# Load your trained model
model = joblib.load('model/model.pkl')
cv = joblib.load("model/vectorizer.pkl")

@app.route('/')
def home():
  # return "hello world"
  return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
  # Parse JSON data from the POST request
  data = request.json
  email_text = data.get('emailContent', '')

  if not email_text:
      return jsonify({"error": "Email content is missing"}), 400

  # Transform the email text using the loaded CountVectorizer
  cv_email = cv.transform([email_text])

  # Predict using the trained model
  prediction = model.predict(cv_email)[0]

  print(prediction)

  prediction_label = 1 if prediction == "spam" else 0

  return jsonify({
    "isSpam": prediction_label
  })


if __name__ == '__main__':
  app.run(debug=True)