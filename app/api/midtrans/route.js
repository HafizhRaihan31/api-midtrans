export const runtime = "nodejs";

import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

// Init Midtrans Snap (Sandbox)
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, productName, price, quantity } = body;

    if (!id || !productName || !price || !quantity) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const grossAmount = parseInt(price) * parseInt(quantity);

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${id}-${Date.now()}`,
        gross_amount: grossAmount,
      },
      item_details: [
        {
          id,
          name: productName,
          price: parseInt(price),
          quantity: parseInt(quantity),
        },
      ],
      customer_details: {
        first_name: "Test User",
        email: "test@email.com",
      },
    };

    const snapToken = await snap.createTransactionToken(parameter);

    return NextResponse.json({ snap_token: snapToken });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
