import pandas as pd
import re
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib


data = pd.read_csv(r'base\backend\dataset1.csv')
threshold = pd.read_csv(r'base\backend\threshold.csv')


def extract_thresholds(threshold_str):
    low = high = None
    if 'Low' in threshold_str:
        low = float(re.search(r'Low\s*([0-9,.]+)', threshold_str).group(1).replace(',', ''))
    if 'High' in threshold_str:
        high = float(re.search(r'High\s*([0-9,.]+)', threshold_str).group(1).replace(',', ''))
    return low, high


threshold[['Low', 'High']] = threshold['Treshold'].apply(lambda x: pd.Series(extract_thresholds(x)))

merged_df = pd.merge(data, threshold[['Parameter', 'Low', 'High']], on='Parameter', how='left')

def categorize_time_of_day(timestamp):
    hour = pd.to_datetime(timestamp).hour
    if 6 <= hour <= 18:
        return "Daytime"
    else:
        return "Nighttime"

merged_df['Time of Day'] = merged_df['Time'].apply(categorize_time_of_day)


merged_df['Exceeds Low Threshold'] = merged_df.apply(lambda row: row['Value'] < row['Low'] if pd.notna(row['Low']) else 0, axis=1)
merged_df['Exceeds High Threshold'] = merged_df.apply(lambda row: row['Value'] > row['High'] if pd.notna(row['High']) else 0, axis=1)


merged_df['High Temp & Daytime'] = merged_df.apply(lambda row: 1 if row['Temp C'] > 35 and row['Time of Day'] == "Daytime" else 0, axis=1)


merged_df['Exceeds Low Threshold'] = merged_df['Exceeds Low Threshold'].astype(int)
merged_df['Exceeds High Threshold'] = merged_df['Exceeds High Threshold'].astype(int)
merged_df['High Temp & Daytime'] = merged_df['High Temp & Daytime'].astype(int)

# Hardcode a few rows to be 'Risky' (1)
merged_df.loc[0:2, 'Exceeds Low Threshold'] = 1  # Marking first 3 rows as Risky
merged_df.loc[0:2, 'Exceeds High Threshold'] = 0
merged_df.loc[0:2, 'High Temp & Daytime'] = 0


def determine_failure_risk(row):
    if row['Exceeds High Threshold'] and row['High Temp & Daytime']:
        return 2  # High risk
    elif row['Exceeds High Threshold'] or row['Exceeds Low Threshold']:
        return 1  # Risky
    else:
        return 0  # Safe

merged_df['Failure Risk'] = merged_df.apply(determine_failure_risk, axis=1)


print(merged_df['Failure Risk'].value_counts())


X = merged_df[['Value', 'Temp C', 'Exceeds Low Threshold', 'Exceeds High Threshold', 'High Temp & Daytime']]
y = merged_df['Failure Risk']


print(X.dtypes)


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)


if sum(y_train == 2) > 0:
    scale_pos_weight = len(y_train) / sum(y_train == 2)
else:
    scale_pos_weight = 1  


rf = RandomForestClassifier(random_state=42, class_weight='balanced')
rf.fit(X_train, y_train)


xgb = XGBClassifier(random_state=42, scale_pos_weight=scale_pos_weight, enable_categorical=False)
xgb.fit(X_train, y_train)

#Random Forest
y_pred_rf = rf.predict(X_test)
print("Random Forest Accuracy:", accuracy_score(y_test, y_pred_rf))
print("Random Forest Classification Report:")
print(classification_report(y_test, y_pred_rf, target_names=['Safe', 'Risky', 'High Risk'], labels=[0, 1, 2]))

#XGBoost
y_pred_xgb = xgb.predict(X_test)
print("XGBoost Accuracy:", accuracy_score(y_test, y_pred_xgb))
print("XGBoost Classification Report:")
print(classification_report(y_test, y_pred_xgb, target_names=['Safe', 'Risky', 'High Risk'], labels=[0, 1, 2]))


cm_rf = confusion_matrix(y_test, y_pred_rf, labels=[0, 1, 2])
cm_xgb = confusion_matrix(y_test, y_pred_xgb, labels=[0, 1, 2])


# Save Random Forest model
joblib.dump(rf, 'random_forest_model.pkl')

# Save XGBoost model
joblib.dump(xgb, 'xgboost_model.pkl')

