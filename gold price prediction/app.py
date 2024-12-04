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
    spx = float(data.get('spx', 0))
    uso = float(data.get('uso', 0))
    slv = float(data.get('slv', 0))
    eur_usd = float(data.get('eur_usd', 0))
    day, month, year = data.get('date')  # In case you need to process the date
    
    # Ensure all necessary data is present
    if None in [spx, uso, slv, eur_usd, day, month]:
      return jsonify({"error": "Missing input features"}), 400

    # Convert the date string to day, month, year if needed
    # For now, you may ignore this if the model does not require it

    # Make the prediction
    prediction = model.predict([[spx, uso, slv, eur_usd, day, month]])  # Adjust model input format as needed
    
    result = prediction[0]  # Assuming prediction is a single value
    
    return jsonify({"result": result})

  except Exception as e:
    return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
  app.run(debug=True)