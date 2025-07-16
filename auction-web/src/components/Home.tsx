import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, Filter, Clock, MapPin, Star, Bell, Heart, Eye, Truck, Shield, Award, X, Plus, Minus, CreditCard, Banknote, Smartphone } from 'lucide-react';

interface AuctionItem {
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

const AuctionWebsite: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [watchList, setWatchList] = useState<string[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sortBy, setSortBy] = useState('ending');

  // Enhanced sample auction items data
  const [auctionItems] = useState<AuctionItem[]>([
    {
      id: '1',
      title: 'Premium Electronics Storage Unit Clearance',
      description: 'High-value electronics bundle including 4K Smart TVs, gaming consoles, premium audio equipment, and smart home devices from storage clearance',
      currentBid: 445,
      originalPrice: 2899,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      image: '/api/placeholder/400/300',
      category: 'Electronics',
      condition: 'Mixed Condition',
      location: 'Toronto, ON',
      bidCount: 23,
      seller: 'StorageMax Pro',
      shipping: 'Free Shipping',
      featured: true,
      watchCount: 89,
      minBidIncrement: 10
    },
    {
      id: '2',
      title: 'Antique Furniture Estate Collection',
      description: 'Rare vintage wooden furniture pieces from estate storage including Victorian dining set, antique armoire, and collectible pieces',
      currentBid: 380,
      originalPrice: 1650,
      endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      image: '/api/placeholder/400/300',
      category: 'Furniture',
      condition: 'Excellent',
      location: 'Vancouver, BC',
      bidCount: 15,
      seller: 'Heritage Auctions',
      shipping: 'Available',
      watchCount: 34,
      minBidIncrement: 15
    },
    {
      id: '3',
      title: 'Professional Kitchen Appliances Bundle',
      description: 'Commercial-grade kitchen equipment including KitchenAid mixer, Vitamix blender, espresso machine, and professional cookware set',
      currentBid: 295,
      originalPrice: 1320,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      image: '/api/placeholder/400/300',
      category: 'Appliances',
      condition: 'Like New',
      location: 'Calgary, AB',
      bidCount: 12,
      seller: 'CulinaryStorage',
      shipping: 'Express Available',
      watchCount: 56,
      minBidIncrement: 5
    },
    {
      id: '4',
      title: 'Complete Home Gym Equipment Set',
      description: 'Professional fitness equipment including adjustable dumbbells, resistance bands, yoga mats, and cardio machines',
      currentBid: 225,
      originalPrice: 950,
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      image: '/api/placeholder/400/300',
      category: 'Sports',
      condition: 'Good',
      location: 'Montreal, QC',
      bidCount: 18,
      seller: 'FitStorage',
      shipping: 'Pickup Available',
      watchCount: 42,
      minBidIncrement: 10
    },
    {
      id: '5',
      title: 'Designer Fashion & Accessories Collection',
      description: 'Luxury brand clothing, handbags, shoes, and accessories from high-end storage unit including Gucci, Prada, and Louis Vuitton items',
      currentBid: 720,
      originalPrice: 4200,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      image: '/api/placeholder/400/300',
      category: 'Fashion',
      condition: 'Excellent',
      location: 'Ottawa, ON',
      bidCount: 31,
      seller: 'LuxuryVault',
      shipping: 'Express Available',
      featured: true,
      watchCount: 127,
      minBidIncrement: 25
    },
    {
      id: '6',
      title: 'Rare Books & Collectibles Archive',
      description: 'Vintage books, first editions, comic books, vinyl records, and media collectibles from estate storage clearance',
      currentBid: 165,
      originalPrice: 580,
      endTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      image: '/api/placeholder/400/300',
      category: 'Media',
      condition: 'Very Good',
      location: 'Edmonton, AB',
      bidCount: 8,
      seller: 'CollectorVault',
      shipping: 'Available',
      watchCount: 21,
      minBidIncrement: 5
    }
  ]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time remaining with enhanced formatting
  const getTimeRemaining = (endTime: Date): { display: string; urgent: boolean } => {
    const now = currentTime.getTime();
    const end = endTime.getTime();
    const difference = end - now;

    if (difference <= 0) return { display: 'Auction Ended', urgent: false };

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const urgent = difference < 24 * 60 * 60 * 1000; // Less than 24 hours

    if (days > 0) return { display: `${days}d ${hours}h ${minutes}m`, urgent };
    if (hours > 0) return { display: `${hours}h ${minutes}m ${seconds}s`, urgent };
    return { display: `${minutes}m ${seconds}s`, urgent: true };
  };

  // Enhanced filtering and sorting
  const filteredItems = auctionItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'ending':
        return a.endTime.getTime() - b.endTime.getTime();
      case 'price-low':
        return a.currentBid - b.currentBid;
      case 'price-high':
        return b.currentBid - a.currentBid;
      case 'bids':
        return b.bidCount - a.bidCount;
      default:
        return 0;
    }
  });

  const categories = ['all', 'Electronics', 'Furniture', 'Appliances', 'Sports', 'Fashion', 'Media'];

  const toggleWatchList = (itemId: string) => {
    setWatchList(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (selectedItem) {
    return (
      <ProductDetail 
        item={selectedItem} 
        onBack={() => setSelectedItem(null)}
        isInWatchList={watchList.includes(selectedItem.id)}
        onToggleWatchList={toggleWatchList}
      />
    );
  }

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
                    STORAGE<span className="text-gray-800">VAULT</span>
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

      {/* Mobile Search */}
      <div className="md:hidden bg-white border-b p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search auctions..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white border-b p-4 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <Filter className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Stats Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-4 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold">{auctionItems.length}</div>
                <div className="text-blue-100">Live Auctions</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">2,847</div>
                <div className="text-blue-100">Storage Units</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">98.5%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold">$2.4M</div>
                <div className="text-blue-100">Monthly Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Secure Payments</h3>
              <p className="text-sm text-gray-600">SSL encrypted transactions</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Same-day pickup available</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quality Assured</h3>
              <p className="text-sm text-gray-600">Verified storage contents</p>
            </div>
          </div>
        </div>

        {/* Auction Items Grid */}
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const timeRemaining = getTimeRemaining(item.endTime);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Time Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                    timeRemaining.urgent ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{timeRemaining.display}</span>
                  </div>
                  
                  {/* Discount Badge */}
                  {item.originalPrice && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {Math.round(((item.originalPrice - item.currentBid) / item.originalPrice) * 100)}% OFF
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-12 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>FEATURED</span>
                    </div>
                  )}
                  
                  {/* Watch List Button */}
                  <button
                    className={`absolute top-3 right-16 p-2 rounded-full transition-all ${
                      watchList.includes(item.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchList(item.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${watchList.includes(item.id) ? 'fill-current' : ''}`} />
                  </button>
                  
                  {/* Views */}
                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-white text-sm">
                    <Eye className="h-4 w-4" />
                    <span>{item.watchCount}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
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
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                      {item.condition}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {item.seller.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.seller}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-blue-600 font-medium">
                      <Truck className="h-4 w-4" />
                      <span>{item.shipping}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No auctions found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">StorageVault</h3>
              </div>
              <p className="text-gray-400">Premium storage auction marketplace connecting buyers with quality storage unit contents.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Live Auctions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Furniture</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Appliances</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>1-800-STORAGE</li>
                <li>support@storagevault.com</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StorageVault. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Product Detail Component
const ProductDetail: React.FC<{ 
  item: AuctionItem; 
  onBack: () => void; 
  isInWatchList: boolean;
  onToggleWatchList: (id: string) => void;
}> = ({ item, onBack, isInWatchList, onToggleWatchList }) => {
  const [bidAmount, setBidAmount] = useState(item.currentBid + item.minBidIncrement);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [quantity, setQuantity] = useState(1);

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

  const handleWatchToggle = (itemId: string) => {
    toggleWatchList(itemId);
  };

  const handleAddToCart = (itemId: string) => {
    setCartItems(prev => [...prev, itemId]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                      Min: ${item.currentBid + item.minBidIncrement}
                    </button>
                    <button
                      onClick={() => setBidAmount(item.currentBid + item.minBidIncrement * 5)}
                      className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      +${item.minBidIncrement * 5}
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

export default AuctionWebsite;