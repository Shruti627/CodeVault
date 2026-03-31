import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import API from "../api/api";

const BuyProject = ({ projectId, price, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      toast.loading("Initializing secure bridge...", { id: "pay-gate" });

      const { data } = await API.post(`/payments/create-order/${projectId}`);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "CodeVault",
        description: `License Acquisition: ${projectId.slice(-6).toUpperCase()}`,
        order_id: data.orderId,
        
        handler: async function (response) {
          try {
            toast.loading("Verifying digital signature...", { id: "pay-gate" });
            
            await API.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success("Transaction Cleared. License Granted.", { id: "pay-gate" });
            
            // Turn off loading and notify parent component
            setIsProcessing(false); 
            if (onSuccess) onSuccess(); 
            
          } catch (err) {
            setIsProcessing(false);
            toast.error("Signature Mismatch. Authorization Denied.", { id: "pay-gate" });
          }
        },
        modal: { 
          ondismiss: () => {
            setIsProcessing(false);
            toast.dismiss("pay-gate");
          } 
        },
        theme: { color: "#dc2626" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Bridge connection failed", { id: "pay-gate" });
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative group w-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-violet-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition" />
      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }}
        whileTap={{ scale: 0.98 }}
        disabled={isProcessing}
        onClick={handlePayment}
        className="relative w-full px-6 py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Encrypting...
          </div>
        ) : (
          "Initialize Purchase →"
        )}
      </motion.button>
    </div>
  );
};

export default BuyProject;