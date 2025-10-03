from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# تحميل الموديل الجاهز
MODEL_PATH = "merged_dataset_rf_model.pkl"
model = joblib.load(MODEL_PATH)

# نفس الـ features اللي الموديل متوقعها
FEATURES = [
 'disposition_score', 'num_planets', 'orbital_period', 'orbital_period_err1',
 'orbital_period_err2', 'semi_major_axis', 'inclination',
 'planet_radius_earth', 'planet_radius_earth_err1',
 'planet_radius_earth_err2', 'equilibrium_temperature', 'insolation_flux',
 'transit_epoch', 'transit_duration', 'transit_depth', 'impact_parameter',
 'stellar_effective_temp', 'stellar_radius', 'stellar_mass',
 'stellar_metallicity', 'v_magnitude', 'k_magnitude', 'gaia_magnitude', 'ra',
 'dec', 'distance', 'max_single_event_stat', 'max_multiple_event_stat',
 'signal_to_noise', 'num_transits'
]

@app.route("/predict", methods=["POST"])
def predict():
    data = None

    # لو جالك JSON
    if request.is_json:
        content = request.get_json()
        data = pd.DataFrame([content], columns=FEATURES)

    elif "file" in request.files:
        file = request.files["file"]
        df = pd.read_csv(file)
        data = pd.DataFrame([df.iloc[0]], columns=FEATURES)
        row = df.iloc[0].to_dict()
        features_dict = {col: float(row[col]) for col in FEATURES if col in row}

    if data is None:
        return jsonify({"error": "No valid input provided"}), 400

    # Prediction
    prediction = model.predict(data)[0]

    return jsonify({
        "prediction": str(prediction),
        "features": features_dict
    })

if __name__ == "__main__":
    app.run(debug=True)
