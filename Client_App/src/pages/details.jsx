import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePaystackPayment } from "react-paystack"; 
import { mockRoutes as routes } from "./mockRoutes";

const BusDetails = () => {
  const { id } = useParams();
  const bus = routes.find((r) => r.id === Number(id));
  const [success, setSuccess] = useState(false);

  const config = {
    reference: new Date().getTime().toString(),
    email: "ikinyapeter93@gmail.com",
    amount: 10 * 100, // convert to kobo/cents
    publicKey: "pk_live_504e9f8c8aebfa975ff87ba801235867f91f39f9", // replace with your key
    currency: "KES",
  };

  const onSuccess = (reference) => {
    console.log("Payment success:", reference);
    setSuccess(true);

    // Build receipt text
    const receipt = `
      🚌 Bus Ticket Receipt
      -------------------------
      Route: ${bus.name}
      Departure: ${bus.time}
      Seats Remaining: ${bus.seats}
      Price: KSh ${bus.price}
      Payment Ref: ${reference.reference}
      Date: ${new Date().toLocaleString()}
    `;

    // Generate PDF Blob (as text-based PDF)
    const blob = new Blob([receipt], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Auto download
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${bus.id}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
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

      {success ? (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-800">
          ✅ Payment successful! Your receipt has been downloaded.
        </div>
      ) : (
        <button
          onClick={() => initializePayment(onSuccess, onClose)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Book Now
        </button>
      )}
    </div>
  );
};

export default BusDetails;
