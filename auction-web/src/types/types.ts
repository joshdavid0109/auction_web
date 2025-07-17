// types.ts - Common type definitions for the auction application

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  originalPrice?: number;
  endTime: Date;
  image: string;
  category: string;
  condition: string;
  location: string;
  bidCount: number;
  seller: string;
  shipping: string;
  featured?: boolean;
  watchCount?: number;
  minBidIncrement: number;
}

export interface ProductDetailProps {
  item: AuctionItem;
  onBack: () => void;
  isInWatchList: boolean;
  onToggleWatchList: (id: string) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface BidHistory {
  id: string;
  itemId: string;
  userId: string;
  amount: number;
  timestamp: Date;
  bidderName: string;
}

export interface WatchListItem {
  userId: string;
  itemId: string;
  addedAt: Date;
}

export type PaymentMethod = 'card' | 'cash' | 'mobile';

export type AuctionStatus = 'active' | 'ended' | 'upcoming';

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';

// You can add more shared types here as your application grows