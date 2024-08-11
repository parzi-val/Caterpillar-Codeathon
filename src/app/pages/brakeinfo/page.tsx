'use client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { FaCheckCircle } from 'react-icons/fa';

interface FormValue {
  field1: string;
  image?: string;
}

const BrakeInfo = () => {
    const router = useRouter();
    const questions = [
    { question: "Brake Fluid level", field1: "Brake Pad Condition" },
    { question: "Front Brake Condition", field1: "Brake Pad Thickness" },
    { question: "Rear Brake Condition", field1: "Brake Disc Condition" },
    { question: "Emergency Brake Condition", field1: "Brake Fluid Level" },
    { question: "Upload a photo of the brake system", image: true }
  ];

  const initialFormValues: FormValue[] = questions.map(() => ({ field1: '' }));
  const [formValues, setFormValues] = useState<FormValue[]>(initialFormValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = { ...updatedFormValues[index], [field]: value };
    setFormValues(updatedFormValues);
  };

  const handleImageUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        const updatedFormValues = [...formValues];
        updatedFormValues[index] = { ...updatedFormValues[index], image: base64Image };
        setFormValues(updatedFormValues);
      };
      reader.readAsDataURL(file);
    }
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
        router.push('/pages/engineinfo')
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
        <h1 className="text-xl font-bold mb-6">Brake Information Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First 4 questions with text input */}
          {questions.slice(0, 4).map((q, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`question-${index}-field1`} className="mr-4">{q.question}</label>
              <input
                id={`question-${index}-field1`}
                type="text"
                value={formValues[index].field1}
                onChange={(e) => handleChange(index, 'field1', e.target.value)}
                className="border border-gray-300 p-2 rounded-md mr-4 flex-1"
                placeholder={`Enter ${q.field1}`}
                required
              />
              {formValues[index].field1 && <FaCheckCircle className="text-green-500" />}
            </div>
          ))}

          {/* Question 5 - Upload a photo */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="photo-upload-4" className="font-semibold">{questions[4].question}</label>
            <input
              id="photo-upload-4"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload(4)}
              className="border border-gray-300 p-2 rounded-md"
              required
            />
            {formValues[4].image && (
              <div className="mt-2">
                <p>Preview:</p>
                <img src={formValues[4].image} alt="Brake system preview" className="w-32 h-32 object-cover border" />
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
    </div>
  );
};

export default BrakeInfo;
