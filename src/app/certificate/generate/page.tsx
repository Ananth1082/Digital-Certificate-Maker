"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function CertificateGenerator() {
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    event: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");
  const { toast } = useToast();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = async () => {
    if (isLoading) return;
    if (
      !formData.email ||
      !formData.name ||
      !formData.college ||
      !formData.event
    ) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        to: formData.email,
        details: {
          name: formData.name,
          college: formData.college,
          event: formData.event,
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          toast({
            title: "Email Sent",
            description: `Certificate sent to ${formData.email}`,
          });
          res.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            setImg(url);
          });
        } else {
          toast({
            title: "Email Error",
            description: `Error sending email to ${formData.email}`,
            variant: "destructive",
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Email sending error:", error);
        setIsLoading(false);
      });
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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          <Button
            className={`w-full ${
              isLoading ? "bg-gray-500 hover:bg-gray-500" : "bg-black"
            }`}
            size="lg"
            onClick={sendEmail}
          >
            Generate Certificate
          </Button>
        </div>

        {/* Preview Section */}
        <div className="relative bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center min-h-[400px]">
          {img ? (
            <Image src={img} alt="certificate" />
          ) : (
            <div className="text-gray-500">Certificate Preview</div>
          )}
        </div>
        <Toaster />
      </Card>
    </div>
  );
}
