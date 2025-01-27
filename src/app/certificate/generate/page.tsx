"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CertificateGenerator() {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    event: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-[100vh] p-8 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-5xl grid md:grid-cols-2 gap-6 p-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Input
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Event</Label>
              <Input
                id="event"
                name="event"
                value={formData.event}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          <Button className="w-full" size="lg">
            Generate Certificate
          </Button>
        </div>

        {/* Preview Section */}
        <div className="relative bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Certificate Preview</div>
        </div>
      </Card>
    </div>
  );
}
