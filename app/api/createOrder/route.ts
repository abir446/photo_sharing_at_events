import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_ID;

    // Gracefully handle missing Razorpay credentials in development/test scenarios
    if (!keyId || !keySecret) {
      console.warn("Razorpay credentials are not defined. Returning simulated order.");
      return NextResponse.json({
        id: "order_mock_" + Math.random().toString(36).substring(2, 9),
        amount: 499900,
        currency: "INR"
      });
    }

    const { amount } = await req.json();

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to establish payment order" },
      { status: 500 }
    );
  }
}