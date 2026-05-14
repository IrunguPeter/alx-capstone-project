import React, { useEffect, useRef, useState } from 'react';

const Checkout = ({ 
  amount: initialAmount = "", 
  currency = "KES", 
  className = "", 
  label = "Donate", 
  isLive = true,
  allowCustomAmount = false
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const intasendInstance = useRef(null);
  const PUBLIC_KEY = isLive 
    ? "ISPubKey_live_613195b6-50cf-4be2-aca7-797d69e0e635" 
    : "ISPubKey_test_26815bc7-94a7-40b1-8044-a292ba6cd3f5";

  useEffect(() => {
    const initIntaSend = () => {
      if (window.IntaSend && !intasendInstance.current) {
        try {
          const instance = new window.IntaSend({
            publicAPIKey: PUBLIC_KEY,
            live: isLive
          });

          instance.on("COMPLETE", (response) => {
            console.log("IntaSend COMPLETE:", response);
            alert("Thank you for your donation!");
          });
          instance.on("FAILED", (response) => {
            console.warn("IntaSend FAILED:", response);
            alert("Donation failed. Please try again.");
          });
          instance.on("IN-PROGRESS", () => {
            console.log("IntaSend IN-PROGRESS...");
          });

          intasendInstance.current = instance;
        } catch (err) {
          console.error("Failed to initialize IntaSend:", err);
        }
      }
    };

    if (window.IntaSend) {
      initIntaSend();
    } else {
      const interval = setInterval(() => {
        if (window.IntaSend) {
          initIntaSend();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLive, PUBLIC_KEY]);

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    const paymentData = {
      amount: amount,
      currency: currency,
      email: "donor@example.com",
      first_name: "Donor",
      last_name: "User",
      country: "KE"
    };

    if (intasendInstance.current) {
      intasendInstance.current.run(paymentData);
    } else if (window.IntaSend) {
        try {
            const instance = new window.IntaSend({
                publicAPIKey: PUBLIC_KEY,
                live: isLive
            });
            instance.run(paymentData);
        } catch (err) {
            console.error("Direct run failed:", err);
            alert("Initializing donation gateway... please try again.");
        }
    }
  };

  const defaultClasses = "bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-rose-100 transition-all active:scale-95 glow-btn whitespace-nowrap";

  if (allowCustomAmount) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative group w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-600 font-black text-xs">{currency}</span>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-10 pr-3 py-4 bg-white/50 border-2 border-rose-100 rounded-2xl focus:border-rose-600 outline-none font-bold text-slate-900 transition-all text-sm"
            placeholder="500 KES"
          />
        </div>
        <button 
          onClick={handlePayment}
          className={defaultClasses}
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handlePayment}
      className={className || defaultClasses}
    >
      {label}
    </button>
  );
};

export default Checkout;
