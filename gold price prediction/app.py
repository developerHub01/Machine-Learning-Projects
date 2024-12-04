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
    data = request.json

    spx = float(data.get('spx', 0))
    uso = float(data.get('uso', 0))
    slv = float(data.get('slv', 0))
    eur_usd = float(data.get('eur_usd', 0))
    day, month, year = data.get('date')
    
    if None in [spx, uso, slv, eur_usd, day, month]:
      return jsonify({"error": "Missing input features"}), 400

    prediction = model.predict([[spx, uso, slv, eur_usd, day, month]])
    
    result = prediction[0]
    
    return jsonify({"result": result})

  except Exception as e:
    return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
  app.run(debug=True)