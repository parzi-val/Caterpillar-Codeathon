'use client'

import Navbar from '@/app/components/Navbar';
import {useRouter} from 'next/navigation'
import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const manual = () => {
    const router = useRouter();
  // Define your custom questions here
  const customQuestions = [
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
              />
              {formValues[index] && <FaCheckCircle className="text-green-500" />}
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 m-4 rounded-md hover:bg-blue-700"
            onClick={()=> router.push('/pages/tireinfo')}
          >
            Submit and Move to Next page
          </button>
          {isSubmitted && (
            <p className="text-green-500 mt-4">Form submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default manual;