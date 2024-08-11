'use client';
import { useRouter } from 'next/router';
import Navbar from '@/app/components/Navbar';
import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const BatteryInfo = () => {
  const router= useRouter();
  const questions = [
    "Battery Maker",
    "Battery Replacement Date",
    "Battery Voltage",
    "Battery Water level",
    "Condition of Battery",
    "Any Leak/ Rust in battery (Y/N)",
    "Upload a photo of the battery from the top view", 
    "Upload photos of the battery from both sides" 
  ];

  const [formValues, setFormValues] = useState(Array(questions.length).fill(''));
  const [imagePreviews, setImagePreviews] = useState<Array<string | null>>(Array(questions.length + 1).fill(null));
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleImageUpload = (index: number, subIndex: number | null = null) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        const updatedPreviews = [...imagePreviews];
        if (subIndex === null) {
          updatedPreviews[index] = base64Image;
          handleChange(index, base64Image); // Store the Base64-encoded image data in form values
        } else {
          updatedPreviews[index + subIndex] = base64Image;
          handleChange(index + subIndex, base64Image); // Store the Base64-encoded image data in form values
        }
        setImagePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

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
        router.push('/pages/exteriorinfo')
        // Redirect or take further action if necessary
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
      <h1 className="text-xl font-bold mb-6">Battery Information Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First 6 questions are text inputs */}
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

        {/* Question 7 - Upload a photo of the battery from the top view */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="photo-upload-6" className="font-semibold">{questions[6]}</label>
          <input
            id="photo-upload-6"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload(6)}
            className="border border-gray-300 p-2 rounded-md"
            required
          />
          {imagePreviews[6] && (
            <div className="mt-2">
              <p>Preview:</p>
              <img src={imagePreviews[6]} alt="Top view of the battery" className="w-32 h-32 object-cover border" />
              <FaCheckCircle className="text-green-500 mt-2" />
            </div>
          )}
        </div>

        {/* Question 8 - Upload photos of the battery from both sides */}
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">{questions[7]}</label>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="photo-upload-7a" className="font-semibold">Side 1</label>
              <input
                id="photo-upload-7a"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload(7, 0)}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
              {imagePreviews[7] && (
                <div className="mt-2">
                  <p>Preview:</p>
                  <img src={imagePreviews[7]} alt="Side 1 of the battery" className="w-32 h-32 object-cover border" />
                  <FaCheckCircle className="text-green-500 mt-2" />
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="photo-upload-7b" className="font-semibold">Side 2</label>
              <input
                id="photo-upload-7b"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload(7, 1)}
                className="border border-gray-300 p-2 rounded-md"
                required
              />
              {imagePreviews[8] && (
                <div className="mt-2">
                  <p>Preview:</p>
                  <img src={imagePreviews[8]} alt="Side 2 of the battery" className="w-32 h-32 object-cover border" />
                  <FaCheckCircle className="text-green-500 mt-2" />
                </div>
              )}
            </div>
          </div>
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
    </div>
  );
};

export default BatteryInfo;
