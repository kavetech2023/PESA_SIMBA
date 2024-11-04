import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { Trophy, LogIn, LogOut, Coins } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { BettingCard } from './components/BettingCard';
import { PaymentModal } from './components/PaymentModal';
import { PrizeBanner } from './components/PrizeBanner';
import { CharityBanner } from './components/CharityBanner';
import {About} from './components/About'
import { Share } from './components/Share'; // Import Share component
import kamala from "./assets/kamala.webp"
import trump from "./assets/trump.webp"

const candidates = [
  {
    name: "Donald Trump",
    party: "Republican",
    image: trump
  },
  {
    name: "Kamala Harris",
    party: "Democrat",
    image: kamala
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [votes, setVotes] = useState({});
  const [userBet, setUserBet] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        getUserBet(user.uid);
        getUserBalance(user.uid);
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

  const getUserBalance = async (userId) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      setUserBalance(userDoc.data().balance || 0);
    }
  };

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        balance: 1000,
        createdAt: serverTimestamp()
      }, { merge: true });
      toast.success('Welcome to Presidential Betting!');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserBet(null);
      setUserBalance(0);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getUserBet = async (userId) => {
    const userBetsRef = collection(db, 'bets');
    const unsubscribe = onSnapshot(
      userBetsRef,
      (snapshot) => {
        const userBets = snapshot.docs
          .filter(doc => doc.data().userId === userId)
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .sort((a, b) => b.timestamp - a.timestamp);

        if (userBets.length > 0) {
          setUserBet(userBets[0].candidate);
        }
      }
    );

    return unsubscribe;
  };

  const handleBetSubmit = async (amount, marginPrediction) => {
    if (!user || !selectedBet) {
      toast.error('Please login to place a bet');
      return;
    }

    try {
      // Save bet in Firestore
      const betRef = await addDoc(collection(db, 'bets'), {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        candidate: selectedBet.candidate.name,
        amount: amount,
        marginPrediction,
        timestamp: serverTimestamp(),
        status: 'active',
        party: selectedBet.candidate.party,
        potentialWin: selectedBet.potentialWin
      });

       // Update user's balance
       await updateDoc(doc(db, 'users', user.uid), {
        balance: userBalance - amount,
        lastBetId: betRef.id,
        lastBetTimestamp: serverTimestamp()
      });

      // Update vote count
      const voteRef = doc(db, 'votes', selectedBet.candidate.name);
      const voteDoc = await getDoc(voteRef);
      
      if (voteDoc.exists()) {
        await updateDoc(voteRef, {
          count: voteDoc.data().count + 1
        });
      } else {
        await setDoc(voteRef, { count: 1 });
      }

      setUserBet(selectedBet.candidate.name);
      setUserBalance(prev => prev - amount);
      setSelectedBet(null);
      toast.success('Bet placed successfully!');
    } catch (error) {
      toast.error('Failed to place bet');
    }
  };

  const getTotalVotes = () => Object.values(votes).reduce((a, b) => a + b, 0);

  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total ? ((votes / total) * 100).toFixed(1) : '0';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <Toaster position="top-center" />
      
      <header className="bg-white/10 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">BetPredictions</h1>
            </div>
            
            <div className="flex items-center gap-6">
              {user && (
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">${userBalance.toLocaleString()}</span>
                </div>
              )}
              
              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full transition-colors text-white font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={login}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full transition-colors text-white font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CharityBanner />
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {candidates.map((candidate) => (
            <BettingCard
              key={candidate.name}
              candidate={candidate}
              votes={votes}
              userBet={userBet}
              getPercentage={getPercentage}
              onOpenBetting={(candidate, amount, potentialWin, margin) => {
                setSelectedBet({ candidate, amount, potentialWin, margin });
                setIsPaymentModalOpen(true);
              }}
              // Customization for bigger images and green tick on hover
              imageStyle={{ width: '100%', height: 'auto' }}
            />
          ))}
          
        </div>
        <About/>
        
        <Share /> 
      </main>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedBet(null);
        }}
        onSubmit={handleBetSubmit}
        candidate={selectedBet?.candidate}
        stakeAmount={selectedBet?.amount}
        possibleWin={selectedBet?.potentialWin}
        marginPrediction={selectedBet?.margin}
        userBalance={userBalance}
      />


    </div>
  );
}

export default App;