

import React from "react";
import { useParams } from "react-router-dom";
import { usePaystackPayment } from "react-paystack"; // npm install react-paystack
import { mockRoutes as routes } from "./mockRoutes";

const BusDetails = () => {
  const { id } = useParams();
  const bus = routes.find((r) => r.id === Number(id));

  const config = {
    reference: new Date().getTime().toString(),
    email: "ikinyapeter93@gmail.com",
    amount: 10 * 100, // Paystack uses kobo (multiply by 100)
    publicKey: "pk_live_504e9f8c8aebfa975ff87ba801235867f91f39f9",
    currency: "KES",
  };

  const onSuccess = (reference) => {
    console.log("Payment success:", reference);

    // ✅ Print receipt instead of generating file
    const receiptWindow = window.open("", "_blank");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Bus Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #2563eb; }
            .receipt { border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
            .row { margin-bottom: 8px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <h2>Bus Ticket Receipt</h2>
            <div class="row"><span class="label">Bus:</span> ${bus.name}</div>
            <div class="row"><span class="label">Departure:</span> ${bus.time}</div>
            <div class="row"><span class="label">Seats Remaining:</span> ${bus.seats}</div>
            <div class="row"><span class="label">Price:</span> KSh ${bus.price}</div>
            <div class="row"><span class="label">Payment Ref:</span> ${reference.reference}</div>
            <div class="row"><span class="label">Date:</span> ${new Date().toLocaleString()}</div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  const onClose = () => {
    console.log("Payment closed");
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">{bus.name}</h2>
      <p className="text-slate-600 mb-4">
        Departure: {bus.time} | Seats: {bus.seats} | Price: KSh {bus.price}
      </p>
      <button
        onClick={() => initializePayment(onSuccess, onClose)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Book Now
      </button>
    </div>
  );
};

export default BusDetails;
