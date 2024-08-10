'use client';

import Navbar from '@/app/components/Navbar';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const voice = () => {
  const [formValues, setFormValues] = useState(Array(12).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [anomalies, setAnomalies] = useState(Array(12).fill(false));

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      const startRecognition = (index: number) => {
        recognition.start();

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          handleChange(index, transcript);
        };

        recognition.onerror = (event: any) => {
          setAnomalies((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
          console.error('Speech recognition error:', event.error);
        };
      };

      for (let i = 0; i < 12; i++) {
        const inputField = document.getElementById(`question-${i}`);
        if (inputField) {
          inputField.addEventListener('focus', () => startRecognition(i));
        }
      }
    } else {
      console.error('Speech Recognition not supported in this browser.');
      setAnomalies(Array(12).fill(true));
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = value;
    setFormValues(updatedFormValues);

    setAnomalies((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      answers: formValues,
    };

    try {
      const response = await fetch('http://192.168.56.1:8000/api/report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        console.log('Form submitted successfully');
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`question-${index}`} className="mr-4">{`Question ${index + 1}`}</label>
              <input
                id={`question-${index}`}
                type="text"
                value={formValues[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                className={`border p-2 rounded-md mr-4 flex-1 ${
                  anomalies[index] ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={`Enter answer for Question ${index + 1}`}
                required
              />
              {formValues[index] && <FaCheckCircle className="text-green-500" />}
              {anomalies[index] && (
                <span className="text-red-500 ml-2">Speech input failed</span>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 m-4 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
          {isSubmitted && (
            <p className="text-green-500 mt-4">Form submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default voice;
