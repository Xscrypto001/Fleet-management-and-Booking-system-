import React, { useState } from "react";
import { Download } from "lucide-react";
import { PaystackButton } from "react-paystack";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const PaymentSection = ({ booking }) => {
  const [isPaid, setIsPaid] = useState(booking?.is_paid || false);
  const [isLoading, setIsLoading] = useState(false);

  const publicKey = "pk_live_504e9f8c8aebfa975ff87ba801235867f91f39f9";
  const email = booking?.user?.email || "ikinyapeter93@gmail.com";
  const amount = booking?.trip?.price * 100;

  const handlePaymentSuccess = async () => {
    setIsLoading(true);
    try {
      await axios.post(`/api/bookings/${booking.id}/mark-paid/`);
      setIsPaid(true);
    } catch (err) {
      console.error("Failed to update booking:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTicket = () => {
    const input = document.getElementById("ticket-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("ticket.pdf");
    });
  };

  const componentProps = {
    email,
    amount,
    publicKey,
    text: `Pay with Paystack - $${booking?.trip?.price}`,
    onSuccess: handlePaymentSuccess,
    onClose: () => console.log("Payment closed"),
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      {!isPaid ? (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-3">Complete Your Booking</h3>
          <p className="text-gray-600 mb-6">
            Secure your ride by completing the payment process
          </p>
          <PaystackButton
            {...componentProps}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg flex items-center justify-center w-full md:w-auto md:mx-auto"
          />
        </div>
      ) : (
        <div className="text-center">
          <div
            id="ticket-content"
            className="bg-white shadow-xl p-6 rounded-lg text-left max-w-xl mx-auto mb-6 border"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">🎟️ Ride Ticket</h2>
            <p><strong>Passenger:</strong> {booking?.user?.name}</p>
            <p><strong>Trip:</strong> {booking?.trip?.destination}</p>
            <p><strong>Price:</strong> ${booking?.trip?.price}</p>
            <p><strong>Date:</strong> {booking?.trip?.date}</p>
            <p><strong>Status:</strong> ✅ Confirmed</p>
            <p className="mt-4 text-sm text-gray-500 text-center">Thank you for booking with us!</p>
          </div>
          <button
            onClick={downloadTicket}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg flex items-center justify-center w-full md:w-auto md:mx-auto"
          >
            <Download size={20} className="mr-2" />
            Download Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
