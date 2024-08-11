import joblib
import pandas as pd
from datetime import datetime
import re

# Load Random Forest model
rf = joblib.load(r'C:\Users\laksh\OneDrive\Desktop\Caterpillar\base\backend\random_forest_model.pkl')
xgb= joblib.load(r'C:\Users\laksh\OneDrive\Desktop\Caterpillar\base\backend\xgboost_model.pkl')


def extract_thresholds(threshold_str):
    low = high = None
    if 'Low' in threshold_str:
        low = float(re.search(r'Low\s*([0-9,.]+)', threshold_str).group(1).replace(',', ''))
    if 'High' in threshold_str:
        high = float(re.search(r'High\s*([0-9,.]+)', threshold_str).group(1).replace(',', ''))
    return low, high

def predict(input_data):
    # get as dataframe format from 
    input_data = pd.DataFrame({
        'Id': [48],
        'Time': ['2022-06-03T08:09:29Z'],
        'Location': ['Mumbai, India'],
        'Machine': ['Excavator_1'],
        'Component': ['Engine'],
        'Parameter': ['Temperature'],
        'Value': [104],
        'Temp C': [35]
    })
    input_data = pd.DataFrame(input_data)

    # Load the threshold data (assuming it's already been extracted as in the previous steps)
    threshold = pd.read_csv('threshold.csv')
    threshold[['Low', 'High']] = threshold['Treshold'].apply(lambda x: pd.Series(extract_thresholds(x)))

    # Merge the input data with the threshold data based on the Parameter
    merged_input = pd.merge(input_data, threshold[['Parameter', 'Low', 'High']], on='Parameter', how='left')

    # Preprocess the time to categorize time of day
    def categorize_time_of_day(timestamp):
        hour = pd.to_datetime(timestamp).hour
        if 6 <= hour <= 18:
            return "Daytime"
        else:
            return "Nighttime"

    merged_input['Time of Day'] = merged_input['Time'].apply(categorize_time_of_day)

    # Feature to check if the value exceeds thresholds
    merged_input['Exceeds Low Threshold'] = merged_input.apply(lambda row: row['Value'] < row['Low'] if pd.notna(row['Low']) else 0, axis=1)
    merged_input['Exceeds High Threshold'] = merged_input.apply(lambda row: row['Value'] > row['High'] if pd.notna(row['High']) else 0, axis=1)

    # Feature to check if temperature is high and during daytime
    merged_input['High Temp & Daytime'] = merged_input.apply(lambda row: 1 if row['Temp C'] > 35 and row['Time of Day'] == "Daytime" else 0, axis=1)

    # Convert boolean columns to integers (0 or 1)
    merged_input['Exceeds Low Threshold'] = merged_input['Exceeds Low Threshold'].astype(int)
    merged_input['Exceeds High Threshold'] = merged_input['Exceeds High Threshold'].astype(int)
    merged_input['High Temp & Daytime'] = merged_input['High Temp & Daytime'].astype(int)

    # Prepare the features for prediction
    X_new = merged_input[['Value', 'Temp C', 'Exceeds Low Threshold', 'Exceeds High Threshold', 'High Temp & Daytime']]

    # Use the trained model to predict the risk (assuming 'rf' or 'xgb' is the trained model)
    predicted_risk_rf = rf.predict(X_new)
    predicted_risk_xgb = xgb.predict(X_new)

    # Map the prediction to a human-readable format
    risk_mapping = {0: 'Safe', 1: 'Risky', 2: 'High Risk'}
    output_rf = risk_mapping[predicted_risk_rf[0]]
    output_xgb = risk_mapping[predicted_risk_xgb[0]]

    print(f"Random Forest Model Prediction: {output_rf}")
    print(f"XGBoost Model Prediction: {output_xgb}")

    return {"rf":output_rf,"xg":output_xgb}