"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "nextjs-toast-notify";
import { ShieldCheckIcon } from "lucide-react";

import Button from "./ui/Button";
import Input from "./ui/Input";
import Select from "./ui/Select";
import { Card, CardContent } from "./ui/Card";

import BackgroundDecorations from "./CreateEvent/BackgroundDecorations";
import EventIllustration from "./CreateEvent/EventIllustration";
import PolaroidCollage from "./CreateEvent/PolaroidCollage";
import FormHeader from "./CreateEvent/FormHeader";
import SecureBanner from "./CreateEvent/SecureBanner";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void | Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface StoragePlan {
  id: string;
  name: string;
  storage: string;
  price: number;
  photos: string;
  tagline: string;
  recommended?: boolean;
}

const plans: StoragePlan[] = [
  {
    id: "starter",
    name: "Starter",
    storage: "2 GB",
    price: 199,
    photos: "Up to 500 photos",
    tagline: "Perfect for casual gatherings",
  },
  {
    id: "standard",
    name: "Standard",
    storage: "10 GB",
    price: 799,
    photos: "Up to 2,500 photos",
    tagline: "Ideal for weddings & major parties",
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    storage: "50 GB",
    price: 2999,
    photos: "Unlimited photos",
    tagline: "For large events & festivals",
  },
];

interface CreateEventFormProps {
  defaultName?: string;
  defaultEmail?: string;
  isAdmin?: boolean;
}

export default function CreateEventForm({
  defaultName = "",
  defaultEmail = "",
  isAdmin = false,
}: CreateEventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<StoragePlan>(plans[1]);
  const [error, setError] = useState<string | null>(null);

  // Dynamically load Razorpay checkout script on client mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const currentForm = event.currentTarget;
    const formData = new FormData(currentForm);

    const eventName = formData.get("eventName") as string;
    const eventDate = formData.get("eventDate") as string;

    if (!eventName?.trim() || !eventDate) {
      setError("Please fill out event name and date.");
      setIsSubmitting(false);
      return;
    }

    try {
      // If user is Admin, completely bypass Razorpay order & modal
      if (isAdmin) {
        formData.append("paymentId", "admin_test_free");
        formData.append("planId", selectedPlan.id);
        formData.append("planName", selectedPlan.name);
        formData.append("planStorage", selectedPlan.storage);
        formData.append("planPrice", "0");
        formData.append("isAdminTest", "true");

        const eventResponse = await fetch("/api/event", {
          method: "POST",
          body: formData,
        });

        const res = await eventResponse.json();
        if (res.success) {
          showToast.success("Event created & QR generated (Admin Free Test)!", {
            duration: 4000,
            position: "top-right",
            transition: "bounceIn",
          });
          router.push("/dashboard");
        } else {
          throw new Error(res.error || "Failed to create event");
        }
        return;
      }

      // 1. Create order on the server-side (chosen plan price in paise)
      const orderResponse = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedPlan.price * 100 }),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to establish Razorpay order.");
      }

      const orderData = await orderResponse.json();

      // 2. Configure and open Razorpay modal checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "DropCast Event Space",
        description: `${selectedPlan.name} Storage Plan (${selectedPlan.storage})`,
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Append paymentId and plan details to the formData
            formData.append("paymentId", response.razorpay_payment_id);
            formData.append("planId", selectedPlan.id);
            formData.append("planName", selectedPlan.name);
            formData.append("planStorage", selectedPlan.storage);
            formData.append("planPrice", selectedPlan.price.toString());

            const eventResponse = await fetch("/api/event", {
              method: "POST",
              body: formData,
            });

            const res = await eventResponse.json();
            if (res.success) {
              showToast.success("Event created & QR generated successfully!", {
                duration: 4000,
                position: "top-right",
                transition: "bounceIn",
              });
              router.push("/dashboard");
            } else {
              throw new Error(res.error || "Failed to create event");
            }
          } catch (err) {
            console.error("Save event error:", err);
            const msg = err instanceof Error ? err.message : undefined;
            setError(msg || "Payment was successful, but establishing event failed. Please contact support.");
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: defaultName,
          email: defaultEmail,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please try again.");
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      const msg = err instanceof Error ? err.message : undefined;
      setError(msg || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSimulateSuccess = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    const formElement = document.getElementById("create-event-form") as HTMLFormElement;
    if (!formElement) return;

    const formData = new FormData(formElement);
    const eventName = formData.get("eventName") as string;
    const eventDate = formData.get("eventDate") as string;

    if (!eventName?.trim() || !eventDate) {
      setError("Please fill out event name and date.");
      return;
    }

    setIsSubmitting(true);

    try {
      formData.append("paymentId", "mock_pay_success_" + Math.random().toString(36).substring(2, 9));
      formData.append("planId", selectedPlan.id);
      formData.append("planName", selectedPlan.name);
      formData.append("planStorage", selectedPlan.storage);
      formData.append("planPrice", selectedPlan.price.toString());

      const response = await fetch("/api/event", {
        method: "POST",
        body: formData,
      });

      const res = await response.json();
      if (res.success) {
        showToast.success("Event created successfully (Simulated)!", {
          duration: 4000,
          position: "top-right",
          transition: "bounceIn",
        });
        router.push("/dashboard");
      } else {
        throw new Error(res.error || "Failed to create event");
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : undefined;
      setError(msg || "Failed to simulate event creation.");
      setIsSubmitting(false);
    }
  };

  const handleSimulateFailure = (e: React.MouseEvent) => {
    e.preventDefault();
    setError("Payment failed (Simulated). Checkout cancelled or card declined.");
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

              {error && (
                <div role="alert" className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300">
                  {error}
                </div>
              )}

              {isAdmin && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-left">
                  <ShieldCheckIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-amber-300 font-semibold text-sm">Admin Testing Mode Active</h4>
                    <p className="text-amber-200/80 text-xs mt-0.5">
                      As an Administrator, event creation and storage plans are completely free (₹0). Razorpay payment checkout is automatically bypassed.
                    </p>
                  </div>
                </div>
              )}

              <form id="create-event-form" onSubmit={handleSubmit} className="space-y-5 mt-2">
                
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

                {/* Storage Plan Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Select Storage Plan
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {plans.map((plan) => {
                      const isSelected = selectedPlan.id === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className={`relative rounded-xl border p-3.5 cursor-pointer flex flex-col justify-between transition-all duration-300 ${
                            isSelected
                              ? "border-brand-500 bg-brand-500/10 shadow-glow"
                              : "border-indigo-150/80 bg-white hover:border-brand-300 dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20 dark:hover:bg-white/[0.04]"
                          }`}
                        >
                          {plan.recommended && (
                            <span className="absolute top-3.5 right-4 rounded-full bg-brand-500 px-2 py-0.5 text-[8px] font-extrabold tracking-wider uppercase text-white shadow-glow">
                              Popular
                            </span>
                          )}
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                {plan.name}
                                {isSelected && (
                                  <svg className="w-4 h-4 text-brand-500 dark:text-brand-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </h4>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{plan.tagline}</p>
                            </div>
                            <div className="text-right">
                              {isAdmin ? (
                                <div>
                                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">₹0</span>
                                  <span className="ml-1 text-[10px] text-slate-500 line-through">₹{plan.price}</span>
                                </div>
                              ) : (
                                <span className="text-sm font-extrabold text-slate-900 dark:text-white">₹{plan.price}</span>
                              )}
                              <p className="text-[9px] text-slate-500">{plan.storage} / {plan.photos}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Secure Info Banner */}
                <SecureBanner />

                {/* Submit Button */}
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full mt-2"
                >
                  {isAdmin ? "Create Event Space (Free for Admin)" : `Pay ₹${selectedPlan.price} & Create Event`}
                </Button>

              </form>

              {/* Developer Test Controls */}
              <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-white/60 dark:border-white/15 dark:bg-white/[0.01] p-4 text-center backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  🔧 Developer Test Controls
                </p>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">
                  Bypass the Razorpay checkout overlay to test successful database persistence or failure UI screens.
                </p>
                <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleSimulateSuccess}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simulate Success
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateFailure}
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simulate Failure
                  </button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Right Column Polaroid Collage */}
        <PolaroidCollage />

      </div>

    </div>
  );
}
