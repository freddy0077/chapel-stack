'use client';
import { useState } from 'react';
import { Button, Card, Title } from '@tremor/react';

interface TestFormData {
  name: string;
  email: string;
  description: string;
}

export default function TestFormComponent() {
  const [formData, setFormData] = useState<TestFormData>({
    name: '',
    email: '',
    description: ''
  });
  
  const [submittedData, setSubmittedData] = useState<TestFormData | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };
  
  return (
    <div className="max-w-lg mx-auto p-6">
      <Title>Test Form</Title>
      
      <Card className="mt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            
            <Button type="submit" color="indigo">
              Submit
            </Button>
          </div>
        </form>
      </Card>
      
      {submittedData && (
        <Card className="mt-6">
          <Title className="text-lg">Submitted Data:</Title>
          <pre className="mt-3 bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </Card>
      )}
      
      <Card className="mt-6">
        <Title className="text-lg">Current Form Data:</Title>
        <pre className="mt-3 bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
