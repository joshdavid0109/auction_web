import React, { useState, useEffect } from 'react';
import {  Search, ShoppingCart, User, Menu, Filter, Clock, MapPin, Star, Bell, Heart, Eye, Truck, Shield, Award } from 'lucide-react';
import ProductDetail from './ProductDetail';
import type { AuctionItem } from '../types/types';

const AuctionWebsite: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<AuctionItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cartItems] = useState<string[]>([]);
  const [watchList, setWatchList] = useState<string[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);        
  const [sortBy, setSortBy] = useState('ending');    
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'ending-soon', 'new'
  const [conditionFilter, setConditionFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Enhanced sample auction items data
  const [auctionItems] = useState<AuctionItem[]>([
    {
      id: '1',
      title: 'Premium Electronics Storage Unit Clearance',
      description: 'High-value electronics bundle including 4K Smart TVs, gaming consoles, premium audio equipment, and smart home devices from storage clearance',
      currentBid: 445,
      originalPrice: 2899,
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      category: 'Electronics',
      condition: 'Mixed Condition',
      location: 'Baguio City, PH',
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
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      category: 'Furniture',
      condition: 'Excellent',
      location: 'Quezon City, PH',
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
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      category: 'Appliances',
      condition: 'Like New',
      location: 'Cebu City, PH',
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
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      category: 'Sports',
      condition: 'Good',
      location: 'Ilocos Norte, PH',
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
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      category: 'Fashion',
      condition: 'Excellent',
      location: 'Baguio City, PH',
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
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      category: 'Media',
      condition: 'Very Good',
      location: 'Manila, PH',
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
    const matchesPrice = item.currentBid >= priceRange.min && item.currentBid <= priceRange.max;
    const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter;
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
    
    // Time filter logic
    let matchesTime = true;
    if (timeFilter === 'ending-soon') {
      const timeLeft = item.endTime.getTime() - currentTime.getTime();
      matchesTime = timeLeft <= 24 * 60 * 60 * 1000; // Less than 24 hours
    } else if (timeFilter === 'new') {
      const timeLeft = item.endTime.getTime() - currentTime.getTime();
      matchesTime = timeLeft > 3 * 24 * 60 * 60 * 1000; // More than 3 days
    }
    
    return matchesSearch && matchesCategory && matchesPrice && matchesCondition && matchesLocation && matchesTime;
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
      case 'discount':
        const discountA = a.originalPrice ? ((a.originalPrice - a.currentBid) / a.originalPrice) * 100 : 0;
        const discountB = b.originalPrice ? ((b.originalPrice - b.currentBid) / b.originalPrice) * 100 : 0;
        return discountB - discountA;
      default:
        return 0;
    }
  });

  const uniqueConditions = [...new Set(auctionItems.map(item => item.condition))];
  const uniqueLocations = [...new Set(auctionItems.map(item => item.location))];

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
                <div className="w-10 h-10 bg-gradient-to-r from-[#ECEFF1] to-[#17C3B2] rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#17C3B2] bg-clip-text text-transparent">
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
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Main Filter Row */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-600 flex-shrink-0" />
            
            {/* Category Filter */}
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#1F2D3D] to-[#17C3B2] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
            
            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="text-sm font-medium">Advanced Filters</span>
              <svg 
                className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 5000})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      PHP {priceRange.min} - PHP {priceRange.max}
                    </div>
                  </div>
                </div>

                {/* Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Remaining</label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Auctions</option>
                    <option value="ending-soon">Ending Soon (24h)</option>
                    <option value="new">New Listings (3+ days)</option>
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Conditions</option>
                    {uniqueConditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setPriceRange({ min: 0, max: 5000 });
                    setTimeFilter('all');
                    setConditionFilter('all');
                    setLocationFilter('all');
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear All Filters
                </button>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredItems.length} of {auctionItems.length} auctions
                </div>
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="ending">Ending Soon</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="bids">Most Bids</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredItems.length} results
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Stats Banner */}
        <div className="bg-gradient-to-r from-[#1F2D3D] via-[#17C3B2] to-[#1F2D3D] text-white rounded-3xl p-8 mb-8 relative overflow-hidden">
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
                <div className="text-4xl font-bold">PHP 2.4M</div>
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

        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const timeRemaining = getTimeRemaining(item.endTime);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedItem(item)}
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                {/* Top Badges Row */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                  {/* Left side - Badges */}
                  <div className="flex flex-col gap-2">
                  
                    
                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
                        <Star className="h-3 w-3 fill-current" />
                        <span>FEATURED</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Right side - Timer and Watchlist */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Time Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 backdrop-blur-sm shadow-sm ${
                      timeRemaining.urgent ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                    }`}>
                      <Clock className="h-3 w-3" />
                      <span>{timeRemaining.display}</span>
                    </div>
                    
                    {/* Watch List Button */}
                    <button
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-sm hover:scale-105 ${
                        watchList.includes(item.id) 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchList(item.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 transition-all duration-200 ${watchList.includes(item.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-sm">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{item.watchCount} watching</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5">
                  {/* Title and Description */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  
                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-baseline space-x-2 mb-1">
                      <span className="text-2xl font-bold text-green-600">PHP {item.currentBid}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{item.bidCount} bids</span>
                      <span className="font-medium text-blue-600">Next: PHP {item.currentBid + item.minBidIncrement}</span>
                    </div>
                  </div>
                  
                  {/* Condition and Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                      {item.condition}
                    </span>
                    <span className="bg-blue-100 px-3 py-1 rounded-full text-xs font-medium text-blue-700">
                      {item.category}
                    </span>
                  </div>
                  
                  {/* Seller Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {item.seller.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.seller}</div>
                        <div className="text-xs text-gray-500">{item.shipping}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-green-600 font-medium">
                      <Truck className="h-4 w-4" />
                      <span>Ship</span>
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
          <div className="grid grid-cols-5 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">T Storage</h3>
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
                <li>support@tstorage.com</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 T-Storage. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuctionWebsite;