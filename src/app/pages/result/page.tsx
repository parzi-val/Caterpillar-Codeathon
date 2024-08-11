'use client';
import { useRouter } from 'next/router';
import React from 'react';

const Result = () => {
    const router =useRouter();
    const handleDownload = async () => {
        try {
            const response = await fetch('http://192.168.61.109:8000/api/report/download', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/pdf',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'report.pdf'); // or whatever the file name is
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else {
        console.error('Failed to download the report');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
        <div className="p-8">
            <h1 className="text-xl font-bold mb-6">Download the Results</h1>
            <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
            Download Report
            </button>
            <button onClick={()=> router.push('/')}>
                Go Back to Home 
            </button>
        </div>
    </div>
  );
};

export default Result;
