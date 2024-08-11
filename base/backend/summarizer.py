import google.generativeai as genai

data = {
  "HEADER": {
    "Truck Serial Number": "SN123456",
    "Truck Model": "Model X",
    "Date and Time": "2024-08-11T15:30:00",
    "Location": "Austin, TX",
    "Service Meter Hours": "1200",
    "Client Name": "Jane Smith",
    "CAT Id": "CAT98765"
  },
    "TIRES": {
      "Left Front Tire": {
        "Pressure": "32 PSI",
        "Condition": "Good"
      },
      "Right Front Tire": {
        "Pressure": "30 PSI",
        "Condition": "Fair"
      },
      "Left Rear Tire": {
        "Pressure": "31 PSI",
        "Condition": "Good"
      },
      "Right Rear Tire": {
        "Pressure": "29 PSI",
        "Condition": "Poor"
      }
    },
    "BATTERY": {
      "Make": "Duracell",
      "Replacement Date": "2024-07-15",
      "Voltage": "12.6 V",
      "Water Level": "Full",
      "Condition": {
        "Damage": "None"
      },
      "Leak / Rust": "No"
    },
    "EXTERIOR": {
      "Rust, Dent and Damage": {
        "Present": "No"
      },
      "Oil Leak in Suspension": "Minor"
    },
    "BRAKES": {
      "Brake Fluid Level": "50%",
      "Front Brake Condition": "Good",
      "Rear Brake Condition": "Fair",
      "Emergency Brake": "Functional"
    },
    "ENGINE": {
      "Rust Dent or Damage": {
        "Present": "No"
      },
      "Engine Oil Condition": "Clean",
      "Engine Oil Color": "Black",
      "Brake Fluid Condition": "Good",
      "Brake Fluid Color": "Black",
      "Oil Leak in Engine": "None"
    },
    "Voice of Customer": {
      "Feedback": "The truck is performing well, but there is a minor issue with the rear tires."
    }
  }

apikey = ""

genai.configure(api_key=apikey)

for k in data:
    model = genai.GenerativeModel('gemini-1.5-flash')
    print(data[k])
    response = model.generate_content(
        f"""Summarize the given json in 200 words and return the summary. 
        {data[k]}""")
    print(response.text)

