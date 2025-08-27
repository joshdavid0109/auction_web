import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Eye, 
  Clock, 
  Users, 
  Minus, 
  Plus,  
  Menu,
  Award,
  Search,
  ShoppingCart,
  User,
  Bell,
  X, 
  Check, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Star, 
  Shield 
} from 'lucide-react';
import type { AuctionItem } from '../types/types'; // Assuming you have a type definition for AuctionItem

interface ProductDetailProps {
  item: AuctionItem;
  onBack: () => void;
  isInWatchList: boolean;
  onToggleWatchList: (id: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  item, 
  onBack, 
  isInWatchList, 
  onToggleWatchList 
}) => {
  const [bidAmount, setBidAmount] = useState(item.currentBid + item.minBidIncrement);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showMobileMenu, setShowMobileMenu] = useState(false);        
  const [_quantity, _setQuantity] = useState(1);
  const [cartItems, _setCartItems] = useState<string[]>([]);
  
  const [watchList, _setWatchList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('ending');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeRemaining = (endTime: Date): { display: string; urgent: boolean } => {
    const now = currentTime.getTime();
    const end = endTime.getTime();
    const difference = end - now;

    if (difference <= 0) return { display: 'Auction Ended', urgent: false };

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const urgent = difference < 24 * 60 * 60 * 1000;

    if (days > 0) return { display: `${days}d ${hours}h ${minutes}m`, urgent };
    if (hours > 0) return { display: `${hours}h ${minutes}m ${seconds}s`, urgent };
    return { display: `${minutes}m ${seconds}s`, urgent: true };
  };

  const handleBidSubmit = (itemId: string, amount: number) => {
    // Simulate bid submission
    console.log(`Bid submitted: ${amount} for item ${itemId}`);
    // Update auction item with new bid
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
            <header className="bg-white shadow-lg sticky top-0 z-50">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                      <Menu className="h-6 w-6" />
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          T <span className="text-gray-800">STORAGE</span>
                        </h1>
                        <p className="text-xs text-gray-500 hidden md:block">Premium Auction Marketplace</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-2xl mx-8 hidden md:block">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search premium storage auctions..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
                      <Bell className="h-6 w-6 text-gray-600" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
                      <Heart className="h-6 w-6 text-gray-600" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                        {watchList.length}
                      </span>
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
                      <ShoppingCart className="h-6 w-6 text-gray-600" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <User className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Navigation */}
              <nav className="bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-8 overflow-x-auto">
                      <button className="py-4 px-4 text-blue-400 border-b-2 border-blue-400 whitespace-nowrap font-medium">
                        🔥 LIVE AUCTIONS
                      </button>
                      <button className="py-4 px-4 text-gray-300 hover:text-white whitespace-nowrap transition-colors">
                        ⏰ ENDING SOON
                      </button>
                      <button className="py-4 px-4 text-gray-300 hover:text-white whitespace-nowrap transition-colors">
                        ⭐ FEATURED
                      </button>
                      <button className="py-4 px-4 text-gray-300 hover:text-white whitespace-nowrap transition-colors">
                        🆕 NEW LISTINGS
                      </button>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-4">
                      <select 
                        className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="ending">Sort by: Ending Soon</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="bids">Most Bids</option>
                      </select>
                    </div>
                  </div>
                </div>
              </nav>
            </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Auctions</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggleWatchList(item.id)}
              className={`p-3 rounded-xl transition-all ${
                isInWatchList 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${isInWatchList ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 rounded-xl bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200 transition-colors">
              <Eye className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-96 object-cover"
                />
                
                {/* Time Badge */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${
                  getTimeRemaining(item.endTime).urgent ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                }`}>
                  <Clock className="h-4 w-4" />
                  <span>{getTimeRemaining(item.endTime).display}</span>
                </div>
                
                {/* Discount Badge */}
                {item.originalPrice && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {Math.round(((item.originalPrice - item.currentBid) / item.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              
              {/* Image Gallery */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {[item.image, item.image, item.image, item.image].map((img, index) => (
                    <button
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
                    >
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Auction Details */}
          <div className="space-y-6">
            {/* Auction Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-green-600">${item.currentBid}</span>
                      {item.originalPrice && (
                        <span className="text-gray-500 line-through text-lg">${item.originalPrice}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{item.bidCount} bids</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">Next bid</div>
                    <div className="text-lg font-bold text-blue-600">${item.currentBid + item.minBidIncrement}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bidding Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Place Your Bid</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{item.bidCount} bidders</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setBidAmount(Math.max(item.currentBid + item.minBidIncrement, bidAmount - item.minBidIncrement))}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                        min={item.currentBid + item.minBidIncrement}
                        step={item.minBidIncrement}
                      />
                    </div>
                    <button
                      onClick={() => setBidAmount(bidAmount + item.minBidIncrement)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setBidAmount(item.currentBid + item.minBidIncrement)}
                      className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Min: PHP {item.currentBid + item.minBidIncrement}
                    </button>
                    <button
                      onClick={() => setBidAmount(item.currentBid + item.minBidIncrement * 5)}
                      className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      +PHP {item.minBidIncrement * 5}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <span>Place Bid</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Payment Options</h2>
                    <button 
                      onClick={() => setShowPaymentModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Bid Amount</span>
                        <span className="text-2xl font-bold text-green-600">${bidAmount}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${bidAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (13%):</span>
                          <span>${(bidAmount * 0.13).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{item.shipping === 'Free Shipping' ? 'Free' : '$25.00'}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>${(bidAmount * 1.13 + (item.shipping === 'Free Shipping' ? 0 : 25)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="card"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                          <CreditCard className="h-5 w-5" />
                          <span>Credit/Debit Card</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="cash"
                          name="payment"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                          <Banknote className="h-5 w-5" />
                          <span>Cash on Delivery</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="mobile"
                          name="payment"
                          value="mobile"
                          checked={paymentMethod === 'mobile'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <label htmlFor="mobile" className="flex items-center space-x-2 cursor-pointer">
                          <Smartphone className="h-5 w-5" />
                          <span>Mobile Payment</span>
                        </label>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        handleBidSubmit(item.id, bidAmount);
                        setShowPaymentModal(false);
                      }}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Check className="h-5 w-5" />
                      <span>Confirm Bid</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Item Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-medium">{item.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{item.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">{item.shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-medium">{item.seller}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Watchers:</span>
                  <span className="font-medium">{item.watchCount}</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {item.seller.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.seller}</div>
                  <div className="text-sm text-gray-600">Professional Seller</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>4.8 (2,847 reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Tabs */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button className="py-4 text-blue-600 border-b-2 border-blue-600 font-medium">
                Description
              </button>
              <button className="py-4 text-gray-600 hover:text-gray-900 font-medium">
                Bid History
              </button>
              <button className="py-4 text-gray-600 hover:text-gray-900 font-medium">
                Shipping Info
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none">
              <h4 className="text-lg font-semibold mb-4">Detailed Description</h4>
              <p className="text-gray-700 mb-4">{item.description}</p>
              <p className="text-gray-700 mb-4">
                This premium storage unit clearance includes a comprehensive collection of high-quality items 
                carefully curated from estate and storage facilities. Each item has been inspected and categorized 
                according to condition standards.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All items are sold as-is, where-is condition</li>
                <li>Professional packing and shipping available</li>
                <li>Local pickup encouraged for large items</li>
                <li>Returns accepted within 7 days for damaged items only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;