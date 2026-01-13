import Midtrans from "midtrans-client";

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { id, productName, price, quantity } = req.body;

    if (!id || !productName || !price || !quantity) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${id}-${Date.now()}`,
        gross_amount: price * quantity,
      },
      item_details: [
        {
          id,
          name: productName,
          price,
          quantity,
        },
      ],
      customer_details: {
        first_name: "Test User",
        email: "test@email.com",
      },
    };

    const snapToken = await snap.createTransactionToken(parameter);

    return res.status(200).json({ snap_token: snapToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Midtrans error" });
  }
}
