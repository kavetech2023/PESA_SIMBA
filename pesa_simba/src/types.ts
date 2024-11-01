export interface Candidate {
    name: string;
    party: string;
    image: string;
  }
  
  export interface Bet {
    candidate: string;
    amount: number;
    timestamp: Date;
    userId: string;
  }