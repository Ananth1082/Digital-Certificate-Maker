"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface CertificateData {
  name: string;
  college: string;
  event: string;
}

export default function CertificateGenerator() {
  const [formData, setFormData] = useState<CertificateData>({
    name: "",
    college: "",
    event: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerateCertificate = () => {
    // Handle certificate generation logic here
    console.log("Generating certificate with:", formData);
  };

  return (
    <div className="w-full min-h-[100vh]  mx-auto p-4 grid place-content-center ">
      <Card className="p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name:</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College:</Label>
              <Input
                id="college"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                placeholder="Enter college"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Event:</Label>
              <Input
                id="event"
                name="event"
                value={formData.event}
                onChange={handleInputChange}
                placeholder="Enter event"
              />
            </div>

            <Button onClick={handleGenerateCertificate} className="w-full">
              Generate Certificate
            </Button>
          </div>

          {/* Certificate Preview Section */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg min-h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Certificate Preview</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
