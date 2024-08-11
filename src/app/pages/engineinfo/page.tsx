'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { FaCheckCircle } from 'react-icons/fa';

interface FormValue {
  field1: string;
  images?: string[]; // For questions that require photo uploads
}

const EngineInfo = () => {
  const router = useRouter();
  const questions = [
    { question: "Rust, Dent or Damage (Y/N)", field1: "Y/N" },
    { question: "Engine Oil Condition", field1: "Engine Oil Condition" },
    { question: "Engine Oil Color", field1: "Engine Oil Color" },
    { question: "Brake Fluid Condition", field1: "Brake Fluid Condition" },
    { question: "Brake Fluid Color", field1: "Brake Fluid Color" },
    { question: "Oil Leak in Engine", field1: "Oil leaks in Engine" },
    { question: "Upload a photo of the engine bay", image: true }, // One photo required
    { question: "Upload photos of the left and right side views of the engine", image: true, multiple: true } // Two photos required
  ];

  const initialFormValues: FormValue[] = questions.map(() => ({ field1: '', images: [] }));
  const [formValues, setFormValues] = useState<FormValue[]>(initialFormValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (index: number, field: string, value: string) => {
    const updatedFormValues = [...formValues];
    updatedFormValues[index] = { ...updatedFormValues[index], [field]: value };
    setFormValues(updatedFormValues);
  };

  const handleImageUpload = (index: number, subIndex: number | null = null) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        const updatedFormValues = [...formValues];
        if (subIndex === null) {
          updatedFormValues[index] = { ...updatedFormValues[index], images: [base64Image] };
        } else {
          const images = [...(updatedFormValues[index].images || [])];
          images[subIndex] = base64Image;
          updatedFormValues[index] = { ...updatedFormValues[index], images };
        }
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
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.pdf'; // The name of the downloaded file
        document.body.appendChild(a); // Append the link to the body
        a.click(); // Programmatically click the link to trigger the download
        a.remove(); // Remove the link from the document
        setIsSubmitted(true);
        console.log('Form submitted and PDF downloaded successfully');
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
        <h1 className="text-xl font-bold mb-6">Engine Information Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First 6 questions with text input */}
          {questions.slice(0, 6).map((q, index) => (
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

          {/* Question 7 - Upload one photo */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="photo-upload-6" className="font-semibold">{questions[6].question}</label>
            <input
              id="photo-upload-6"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload(6)}
              className="border border-gray-300 p-2 rounded-md"
              required
            />
            {formValues[6].images?.[0] && (
              <div className="mt-2">
                <p>Preview:</p>
                <img src={formValues[6].images?.[0]} alt="Engine bay preview" className="w-32 h-32 object-cover border" />
                <FaCheckCircle className="text-green-500 mt-2" />
              </div>
            )}
          </div>

          {/* Question 8 - Upload two photos */}
          <div className="flex flex-col space-y-2">
            <label className="font-semibold">{questions[7].question}</label>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="photo-upload-7a" className="font-semibold">Left Side</label>
                <input
                  id="photo-upload-7a"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload(7, 0)}
                  className="border border-gray-300 p-2 rounded-md"
                  required
                />
                {formValues[7].images?.[0] && (
                  <div className="mt-2">
                    <p>Preview:</p>
                    <img src={formValues[7].images?.[0]} alt="Left side preview" className="w-32 h-32 object-cover border" />
                    <FaCheckCircle className="text-green-500 mt-2" />
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="photo-upload-7b" className="font-semibold">Right Side</label>
                <input
                  id="photo-upload-7b"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload(7, 1)}
                  className="border border-gray-300 p-2 rounded-md"
                  required
                />
                {formValues[7].images?.[1] && (
                  <div className="mt-2">
                    <p>Preview:</p>
                    <img src={formValues[7].images?.[1]} alt="Right side preview" className="w-32 h-32 object-cover border" />
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
            Generate Result and Download it
          </button>
          {isSubmitted && (
            <p className="text-green-500 mt-4">Form submitted successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EngineInfo;
