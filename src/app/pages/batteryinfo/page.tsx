'use client';

import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const BatteryInfo = () => {
  const questions = [
    "What is the brand of the battery?",
    "What is the model of the battery?",
    "What is the capacity of the battery?",
    "What is the manufacturing date of the battery?",
    "What is the serial number of the battery?",
    "What is the current voltage of the battery?",
    "Upload a photo of the battery label"
  ];

  const [formValues, setFormValues] = useState(Array(questions.length).fill(''));
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (index: number, value: string) => {
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = value;
    setFormValues(updatedFormValues);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        handleChange(6, reader.result as string); // Store the image data in form values
      };
      reader.readAsDataURL(file);
    }
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
        // Redirect or take further action if necessary
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-6">Battery Information Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.slice(0, 6).map((question, index) => (
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
            />
            {formValues[index] && <FaCheckCircle className="text-green-500" />}
          </div>
        ))}

        {/* Last question for uploading a photo */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="photo-upload" className="font-semibold">{questions[6]}</label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            capture="environment"  
            onChange={handleImageUpload}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
          {imagePreview && (
            <div className="mt-2">
              <p>Preview:</p>
              <img src={imagePreview} alt="Battery label preview" className="w-32 h-32 object-cover border" />
              <FaCheckCircle className="text-green-500 mt-2" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 mt-4 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
        {isSubmitted && (
          <p className="text-green-500 mt-4">Form submitted successfully!</p>
        )}
      </form>
    </div>
  );
};

export default BatteryInfo;
