"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";

import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { Card, CardContent } from "./ui/Card";

import BackgroundDecorations from "./CreateEvent/BackgroundDecorations";
import EventIllustration from "./CreateEvent/EventIllustration";
import PolaroidCollage from "./CreateEvent/PolaroidCollage";
import FormHeader from "./CreateEvent/FormHeader";
import SecureBanner from "./CreateEvent/SecureBanner";

export default function CreateEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/event", {
        method: "POST",
        body: formData,
      });
      const res = await response.json();
      if (res.success) {
        showToast.success("Event created successfully!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });
        router.push("/dashboard");
      } else {
        showToast.error(res.error || "Failed to create event", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      showToast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
        transition: "bounceIn",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-ink-900 text-slate-200 px-4 py-8 sm:px-6 sm:py-12 md:py-16 relative overflow-hidden">
      
      {/* Background Decor Component */}
      <BackgroundDecorations />

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center z-10">
        
        {/* Left Column Graphic & Heading */}
        <EventIllustration />

        {/* Middle Column Form Card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <Card className="w-full max-w-lg z-10">
            <CardContent className="p-5 sm:p-8">
              
              {/* Form Title & Subtitle */}
              <FormHeader />

              <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                
                {/* Event Name Field */}
                <Input
                  label="Event Name"
                  id="eventName"
                  name="eventName"
                  type="text"
                  required
                  placeholder="e.g., Abir & Neha's Wedding Reception"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                    </svg>
                  }
                />

                {/* Event Date Field */}
                <Input
                  label="Event Date"
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  required
                  className="cursor-text"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  }
                />

                {/* Event Type (Optional) Dropdown Select */}
                <Select
                  label="Event Type (Optional)"
                  id="eventType"
                  name="eventType"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.44 1.44 0 0 0 2.037 0l4.318-4.318a1.44 1.44 0 0 0 0-2.037l-9.58-9.581A2.25 2.25 0 0 0 9.568 3Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                    </svg>
                  }
                >
                  <option value="" className="text-slate-400">Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="concert">Concert</option>
                  <option value="corporate">Corporate</option>
                  <option value="other">Other</option>
                </Select>

                {/* Secure Info Banner */}
                <SecureBanner />

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full mt-2"
                >
                  Create Event & Generate QR
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column Polaroid Collage */}
        <PolaroidCollage />

      </div>

    </div>
  );
}
