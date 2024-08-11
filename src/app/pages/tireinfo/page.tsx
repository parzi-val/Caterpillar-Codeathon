'use client'
import { useRouter } from 'next/router';
import Navbar from '@/app/components/Navbar';
import React, { useState } from 'react';

const tireInfo = () => {
  const router = useRouter();
  const questions = [
    { question: "What is the brand of the tire?", field1: "Tire Brand", field2: "Tire Size" },
    { question: "What is the tread depth?", field1: "Front Tread Depth", field2: "Rear Tread Depth" },
    { question: "What is the tire pressure?", field1: "Front Tire Pressure", field2: "Rear Tire Pressure" },
    { question: "What is the tire's manufacturing date?", field1: "Manufacturing Month", field2: "Manufacturing Year" }
  ];

  const initialFormValues = questions.map(() => ({ field1: '', field2: '' }));
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = { ...updatedFormValues[index], [field]: value };
    setFormValues(updatedFormValues);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      answers: formValues,
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
      <h1 className="text-xl font-bold mb-6">Tire Information Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="space-y-2">
            <p className="font-semibold">{q.question}</p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex items-center">
                <label htmlFor={`question-${index}-field1`} className="mr-2">{q.field1}:</label>
                <input
                  id={`question-${index}-field1`}
                  type="text"
                  value={formValues[index].field1}
                  onChange={(e) => handleChange(index, 'field1', e.target.value)}
                  className="border border-gray-300 p-2 rounded-md flex-1"
                  placeholder={`Enter ${q.field1}`}
                  required
                />
              </div>
              <div className="flex items-center">
                <label htmlFor={`question-${index}-field2`} className="mr-2">{q.field2}:</label>
                <input
                  id={`question-${index}-field2`}
                  type="text"
                  value={formValues[index].field2}
                  onChange={(e) => handleChange(index, 'field2', e.target.value)}
                  className="border border-gray-300 p-2 rounded-md flex-1"
                  placeholder={`Enter ${q.field2}`}
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 mt-4 rounded-md hover:bg-blue-700"
          onClick={()=> router.push('/pages/batteryinfo') }
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

export default tireInfo;
