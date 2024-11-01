import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { auth, db } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Trophy, LogIn, LogOut } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { BettingCard } from './components/BettingCard';
import { PaymentModal } from './components/PaymentModal';

const stripePromise = loadStripe('your_stripe_publishable_key');

const candidates = [
  {
    name: "Donald Trump",
    party: "Republican",
    image: "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    name: "Joe Biden",
    party: "Democrat",
    image: "https://images.unsplash.com/photo-1612831197310-ff5cf7a547b6?auto=format&fit=crop&q=80&w=300&h=300"
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [votes, setVotes] = useState({});
  const [userBet, setUserBet] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        getUserBet(user.uid);
      }
    });

    const votesUnsubscribe = onSnapshot(collection(db, 'votes'), (snapshot) => {
      const votesData = {};
      snapshot.forEach((doc) => {
        votesData[doc.id] = doc.data().count;
      });
      setVotes(votesData);
    });

    return () => {
      unsubscribe();
      votesUnsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Welcome to Presidential Betting!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserBet(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getUserBet = async (userId) => {
    const userDoc = await getDoc(doc(db, 'userBets', userId));
    if (userDoc.exists()) {
      setUserBet(userDoc.data().candidate);
    }
  };

  const handleBetSubmit = async (amount) => {
    if (!user || !selectedCandidate) {
      toast.error('Please login to place a bet');
      return;
    }

    try {
      // Create payment record
      await setDoc(doc(db, 'payments', `${user.uid}-${Date.now()}`), {
        userId: user.uid,
        candidate: selectedCandidate.name,
        amount,
        status: 'pending',
        timestamp: new Date()
      });

      // Update user's bet
      await setDoc(doc(db, 'userBets', user.uid), {
        candidate: selectedCandidate.name,
        amount,
        timestamp: new Date()
      });

      // Update vote count
      const voteRef = doc(db, 'votes', selectedCandidate.name);
      const voteDoc = await getDoc(voteRef);
      
      if (voteDoc.exists()) {
        await updateDoc(voteRef, {
          count: voteDoc.data().count + 1
        });
      } else {
        await setDoc(voteRef, { count: 1 });
      }

      setUserBet(selectedCandidate.name);
      toast.success(`Successfully placed $${amount} bet on ${selectedCandidate.name}!`);
    } catch (error) {
      toast.error('Failed to place bet');
    }
  };

  const getTotalVotes = () => Object.values(votes).reduce((a, b) => a + b, 0);

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total ? ((votes / total) * 100).toFixed(1) : '0';
  };

  const handleOpenBetting = (candidate) => {
    if (!user) {
      toast.error('Please login to place a bet');
      return;
    }
    if (userBet) {
      toast.error('You have already placed a bet!');
      return;
    }
    setSelectedCandidate(candidate);
    setIsPaymentModalOpen(true);
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 text-white">
        <Toaster position="top-center" />
        
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold">Presidential Betting 2024</h1>
          </div>
          
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login with Google
            </button>
          )}
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {candidates.map((candidate) => (
              <BettingCard
                key={candidate.name}
                candidate={candidate}
                votes={votes}
                userBet={userBet}
                getPercentage={getPercentage}
                onOpenBetting={handleOpenBetting}
              />
            ))}
          </div>
        </main>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubmit={handleBetSubmit}
          candidate={selectedCandidate}
        />
      </div>
    </Elements>
  );
}

export default App;