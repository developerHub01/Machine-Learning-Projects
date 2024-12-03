from flask import Flask, request, render_template, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load your trained model
model = joblib.load('model/model.pkl')

@app.route('/')
def home():
  return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
  try:
    # Get the JSON data sent by the frontend
    data = request.json
    
    # Extract and convert each field to the appropriate numeric type
    age = int(data.get('age', 0))
    sex = int(data.get('sex', 0))
    cp = int(data.get('cp', 0))
    trestbps = int(data.get('trestbps', 0))
    chol = int(data.get('chol', 0))
    fbs = int(data.get('fbs', 0))
    restecg = int(data.get('restecg', 0))
    thalach = int(data.get('thalach', 0))
    exang = int(data.get('exang', 0))
    oldpeak = float(data.get('oldpeak', 0.0))  # oldpeak is likely to be a float
    slope = int(data.get('slope', 0))
    ca = int(data.get('ca', 0))
    thal = int(data.get('thal', 0))

    # Ensure all necessary data is present
    if None in [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]:
      return jsonify({"error": "Missing input features"}), 400

    prediction = model.predict([[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]])

    # Assuming the model returns a prediction (0 or 1, for example)
    result = 1 if prediction == 1 else 0
    
    return jsonify({"result": result})

  except Exception as e:
    return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
  app.run(debug=True)