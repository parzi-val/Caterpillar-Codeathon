'use client'

import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Manual = () => {
  const router = useRouter();

  const customQuestions = [
    "Location of Inspection",
    "Date and Time of Inspection",
    "What is your name?",
    "What is your email?",
    "What is your phone number?",
    "What is your address?",
    "What is your occupation?",
    "What is your favorite hobby?",
    "What is your birth date?",
    "What is your favorite color?",
    "What is your favorite food?",
    "What is your favorite book?",
    "What is your favorite movie?",
    "What is your dream job?"
  ];

  const [formValues, setFormValues] = useState(Array(customQuestions.length).fill(''));
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetching the location of inspection and date/time
  useEffect(() => {
    // Fetching location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
          handleChange(0, location); // Automatically populate the location in the first field
        },
        (error) => {
          console.error('Error fetching location:', error);
          handleChange(0, 'Location not available');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      handleChange(0, 'Geolocation not supported');
    }

    // Fetching the date and time of inspection from user's system
    const dateTime = new Date().toLocaleString();
    handleChange(1, dateTime); // Automatically populate the date and time in the second field
  }, []);

  const handleChange = (index: number, value: string) => {
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = value;
    setFormValues(updatedFormValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      answers: formValues
    };

    try {
      const response = await fetch('http://192.168.61.109:8000/api/report/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        console.log('Form submitted successfully');
        router.push('/pages/tireinfo');
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
          {customQuestions.map((question, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`question-${index}`} className="mr-4">{question}</label>
              <input
                id={`question-${index}`}
                type="text"
                value={formValues[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                className="border border-gray-300 p-2 rounded-md mr-4 flex-1"
                placeholder={`Enter answer for "${question}"`}
                required
                readOnly={index === 0 || index === 1} // Make the location and date/time fields read-only
              />
              {formValues[index] && <FaCheckCircle className="text-green-500" />}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 m-4 rounded-md hover:bg-blue-700"
          >
            Submit and Move to Next Page
          </button>
          {isSubmitted && (
            <p className="text-green-500 mt-4">Form submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Manual;
