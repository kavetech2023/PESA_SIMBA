import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { DollarSign, CreditCard, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatUSD } from '../utils/currency';

export function PaymentModal({ isOpen, onClose, onSubmit, candidate }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          email: 'user@example.com', // In production, get from user profile
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      await onSubmit(amount);
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

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
          Place Bet on {candidate.name}
        </h2>

        <div className="flex items-center justify-center mb-6">
          <div className="p-3 rounded-full bg-blue-100">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                min="10"
                max="1000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="p-3 border border-gray-300 rounded-lg">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isProcessing ? "Processing..." : formatUSD(amount)}
          </button>
        </form>
      </div>
    </div>
  );
}