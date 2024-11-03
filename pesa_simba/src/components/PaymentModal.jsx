import React, { useState, useEffect } from 'react';
import { CreditCard, X } from 'lucide-react';
import 'intasend-inlinejs-sdk'
import toast from 'react-hot-toast';

export function PaymentModal({ isOpen, onClose, onSubmit, candidate, stakeAmount, possibleWin }) {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const intaSend = new window.IntaSend({
        publicAPIKey: "ISPubKey_live_49bb188a-4022-4d59-b35b-af970f226d6a",
        live: true
      });

      intaSend
        .on("COMPLETE", async (response) => {
          console.log("COMPLETE:", response);
          try {
            await onSubmit(stakeAmount);
            toast.success('Payment successful!');
            onClose();
          } catch (error) {
            toast.error('Failed to record bet');
          }
        })
        .on("FAILED", (response) => {
          console.log("FAILED", response);
          toast.error('Payment failed');
          setIsProcessing(false);
        })
        .on("IN-PROGRESS", () => {
          console.log("INPROGRESS ...");
          setIsProcessing(true);
        });
    }
  }, [isOpen, stakeAmount, onClose, onSubmit]);

  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Confirm Your Bet
        </h2>

        <div className="flex items-center justify-center mb-6">
          <div className="p-3 rounded-full bg-blue-100">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Candidate</p>
                <p className="font-semibold">{candidate.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Party</p>
                <p className="font-semibold">{candidate.party}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stake Amount</p>
                <p className="font-semibold">${stakeAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Possible Win</p>
                <p className="font-semibold text-green-600">${possibleWin}</p>
              </div>
            </div>
          </div>

          <button
            disabled={isProcessing}
            className={`intaSendPayButton w-full py-3 rounded-lg font-bold text-white transition-colors ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            data-amount={stakeAmount}
            data-currency="USD"
          >
            {isProcessing ? "Processing..." : `Confirm and Pay $${stakeAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
}