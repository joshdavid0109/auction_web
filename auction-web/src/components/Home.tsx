import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search, Heart, Star, Clock, MapPin, Filter, Grid, List, ChevronDown, Bell, MessageSquare, Package, Eye, EyeOff, Mail, Lock, UserPlus, ArrowLeft, Trash2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price?: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  isAuction?: boolean;
  timeLeft?: string;
  currentBid?: number;
  bids?: number;
  minBidIncrement?: number;
  endTime?: Date;
  description?: string;
  condition?: string;
  shipping?: number;
  categoryId?: number;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface Bid {
  id: number;
  productId: number;
  userId: string;
  amount: number;
  timestamp: Date;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  email?: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shipping: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: PaymentMethod;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface BidFormData {
  amount: number;
}

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

const StorageMaxApp: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<'auction' | 'marketplace'>('auction');
  const [currentPage, setCurrentPage] = useState('home');
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categorySort, setCategorySort] = useState<'latest' | 'price_asc' | 'price_desc' | 'bids_desc'>('latest');
  const [categoryMinPrice, setCategoryMinPrice] = useState<string>('');
  const [categoryMaxPrice, setCategoryMaxPrice] = useState<string>('');
  const [checkoutForm, setCheckoutForm] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [userBids, setUserBids] = useState<Bid[]>([]);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  // Sample data with enhanced auction functionality
  const categories: Category[] = [
    { id: 1, name: 'Electronics', icon: '📱' },
    { id: 2, name: 'Fashion', icon: '👕' },
    { id: 3, name: 'Home & Garden', icon: '🏠' },
    { id: 4, name: 'Sports', icon: '⚽' },
    { id: 5, name: 'Books', icon: '📚' },
    { id: 6, name: 'Toys', icon: '🧸' },
    { id: 7, name: 'Beauty', icon: '💄' },
    { id: 8, name: 'Auto', icon: '🚗' },
  ];

  const auctionProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 14 Pro Max - Storage Unit Find',
      categoryId: 1,
      currentBid: 850,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 234,
      seller: 'TechDeals',
      location: 'New York, NY',
      isAuction: true,
      timeLeft: '2h 15m',
      bids: 23,
      minBidIncrement: 25,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      description: 'Excellent condition iPhone 14 Pro Max found in storage unit. Includes original box and accessories.',
      condition: 'Like New',
      shipping: 15
    },
    {
      id: 2,
      title: 'Vintage Leather Jacket Collection',
      categoryId: 2,
      currentBid: 125,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 89,
      seller: 'VintageFinds',
      location: 'Los Angeles, CA',
      isAuction: true,
      timeLeft: '1d 3h',
      bids: 15,
      minBidIncrement: 10,
      endTime: new Date(Date.now() + 27 * 60 * 60 * 1000), // 27 hours from now
      description: 'Collection of 3 vintage leather jackets in various sizes. Authentic vintage pieces from the 80s.',
      condition: 'Good',
      shipping: 25
    },
    {
      id: 3,
      title: 'Professional Camera Equipment Set',
      categoryId: 1,
      currentBid: 450,
      image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 156,
      seller: 'PhotoPro',
      location: 'Chicago, IL',
      isAuction: true,
      timeLeft: '4h 32m',
      bids: 31,
      minBidIncrement: 50,
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      description: 'Complete professional camera setup including DSLR, lenses, tripod, and lighting equipment.',
      condition: 'Excellent',
      shipping: 35
    }
  ];

  const marketplaceProducts: Product[] = [
    {
      id: 4,
      title: 'Wireless Headphones - Like New',
      categoryId: 1,
      price: 89,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 445,
      seller: 'AudioShop',
      location: 'Miami, FL',
      description: 'Premium wireless headphones with noise cancellation. Only used for 2 weeks.',
      condition: 'Like New',
      shipping: 8
    },
    {
      id: 5,
      title: 'Designer Handbag Collection',
      categoryId: 2,
      price: 245,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 234,
      seller: 'LuxuryFinds',
      location: 'Beverly Hills, CA',
      description: 'Authentic designer handbags from top luxury brands. All items authenticated.',
      condition: 'Excellent',
      shipping: 15
    },
    {
      id: 6,
      title: 'Gaming Setup Complete',
      categoryId: 1,
      price: 1299,
      originalPrice: 1899,
      image: 'https://images.unsplash.com/photo-1593640408182-31174a57b798?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 167,
      seller: 'GameZone',
      location: 'Austin, TX',
      description: 'Complete gaming setup including high-end PC, monitor, keyboard, mouse, and gaming chair.',
      condition: 'Like New',
      shipping: 50
    }
  ];

  const currentProducts = currentMode === 'auction' ? auctionProducts : marketplaceProducts;

  // Cart functionality
  const addToCart = (product: Product) => {
    if (!product.price) return; // Can't add auction items to cart
    
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { id: Date.now(), product, quantity: 1 }]);
    }
    setCartCount(cartCount + 1);
  };

  const removeFromCart = (itemId: number) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
      setCartCount(cartCount - item.quantity);
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
      const quantityDiff = quantity - item.quantity;
      setCartCount(cartCount + quantityDiff);
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity }
          : cartItem
      ));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
  };

  const getCartShipping = () => {
    return cart.reduce((total, item) => total + (item.product.shipping || 0), 0);
  };

  const getCartTax = () => {
    return getCartTotal() * 0.08; // 8% tax
  };

  const getCartGrandTotal = () => {
    return getCartTotal() + getCartShipping() + getCartTax();
  };

  // Bidding functionality
  const placeBid = (product: Product, amount: number) => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }

    if (amount <= (product.currentBid || 0)) {
      alert('Bid must be higher than current bid!');
      return;
    }

    if (product.minBidIncrement && amount < (product.currentBid || 0) + product.minBidIncrement) {
      alert(`Minimum bid increment is $${product.minBidIncrement}`);
      return;
    }

    // Update product with new bid
    const updatedProduct = { ...product, currentBid: amount, bids: (product.bids || 0) + 1 };
    
    // Update the products array
    if (currentMode === 'auction') {
      const updatedAuctionProducts = auctionProducts.map(p => 
        p.id === product.id ? updatedProduct : p
      );
      // In a real app, this would be an API call
      console.log('Bid placed:', { productId: product.id, amount, userId: 'user123' });
    }

    // Add to user's bid history
    const newBid: Bid = {
      id: Date.now(),
      productId: product.id,
      userId: 'user123',
      amount,
      timestamp: new Date()
    };
    setUserBids([...userBids, newBid]);

    setShowBidModal(false);
    setSelectedProduct(null);
    setBidAmount(0);
    alert('Bid placed successfully!');
  };

  // Checkout functionality
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    setTimeout(() => {
      const order: Order = {
        id: `ORD-${Date.now()}`,
        items: cart,
        total: getCartTotal(),
        shipping: getCartShipping(),
        tax: getCartTax(),
        status: 'processing',
        paymentMethod: {
          id: 'card-1',
          type: 'card',
          last4: checkoutForm.cardNumber.slice(-4),
          brand: 'Visa'
        },
        shippingAddress: {
          street: checkoutForm.street,
          city: checkoutForm.city,
          state: checkoutForm.state,
          zipCode: checkoutForm.zipCode,
          country: checkoutForm.country
        },
        createdAt: new Date()
      };

      setOrders([...orders, order]);
      setCart([]);
      setCartCount(0);
      setShowCheckout(false);
      setPaymentSuccess(true);
      
      setTimeout(() => setPaymentSuccess(false), 5000);
    }, 2000);
  };

  // Timer functionality for auctions
  useEffect(() => {
    const timer = setInterval(() => {
      // Update auction timers
      auctionProducts.forEach(product => {
        if (product.endTime && product.endTime > new Date()) {
          const timeLeft = product.endTime.getTime() - Date.now();
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          
          if (hours > 24) {
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            product.timeLeft = `${days}d ${remainingHours}h`;
          } else if (hours > 0) {
            product.timeLeft = `${hours}h ${minutes}m`;
          } else if (minutes > 0) {
            product.timeLeft = `${minutes}m`;
          } else {
            product.timeLeft = 'Ended';
          }
        }
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Simulate registration
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
    setCart([]);
    setCartCount(0);
    setUserBids([]);
    setOrders([]);
  };

  // Product Card Component
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
        {product.isAuction && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            AUCTION
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="mb-3">
          {product.isAuction ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-red-600">${product.currentBid}</span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {product.timeLeft}
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-2">{product.bids} bids</div>
              <div className="text-xs text-gray-500">Min bid: +${product.minBidIncrement}</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-orange-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          {product.location}
        </div>

        <div className="text-xs text-gray-600 mb-3">by {product.seller}</div>

        <div className="space-y-2">
          {product.isAuction ? (
            <button 
              onClick={() => {
                setSelectedProduct(product);
                setBidAmount((product.currentBid || 0) + (product.minBidIncrement || 25));
                setShowBidModal(true);
              }}
              className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors bg-red-500 hover:bg-red-600 text-white"
            >
              Place Bid
            </button>
          ) : (
            <button 
              onClick={() => addToCart(product)}
              className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors bg-orange-500 hover:bg-orange-600 text-white"
            >
              Add to Cart
            </button>
          )}
          
          <button 
            onClick={() => {
              setSelectedProduct(product);
              // Show product detail modal or navigate to detail page
            }}
            className="w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  // Cart Modal Component
  const CartModal: React.FC = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
            <button 
              onClick={() => setShowCart(false)}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-400">Start shopping to add items to your cart</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <img 
                      src={item.product.image} 
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.product.title}</h3>
                      <p className="text-sm text-gray-500">${item.product.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">${(item.product.price || 0) * item.quantity}</p>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>${getCartShipping().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>${getCartTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 text-gray-800">
                  <span>Total:</span>
                  <span>${getCartGrandTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowCart(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
                <button 
                  onClick={() => {
                    setShowCart(false);
                    setShowCheckout(true);
                  }}
                  className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Bid Modal Component
  const BidModal: React.FC = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Place Your Bid</h2>
            <button 
              onClick={() => setShowBidModal(false)}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          {selectedProduct && (
            <>
              <div className="mb-6">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="font-medium text-gray-800 mb-3">{selectedProduct.title}</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Bid:</span>
                    <span className="font-bold text-red-600">${selectedProduct.currentBid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minimum Bid:</span>
                    <span className="font-bold text-green-600">+${selectedProduct.minBidIncrement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Left:</span>
                    <span className="font-bold text-orange-600">{selectedProduct.timeLeft}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                placeBid(selectedProduct, bidAmount);
              }}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      min={(selectedProduct.currentBid || 0) + (selectedProduct.minBidIncrement || 25)}
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-medium"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum bid: ${(selectedProduct.currentBid || 0) + (selectedProduct.minBidIncrement || 25)}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowBidModal(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Place Bid
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Checkout Modal Component
  const CheckoutModal: React.FC = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>
            <button 
              onClick={() => setShowCheckout(false)}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Shipping Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={checkoutForm.firstName}
                      onChange={(e) => setCheckoutForm({...checkoutForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={checkoutForm.lastName}
                      onChange={(e) => setCheckoutForm({...checkoutForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={checkoutForm.email}
                    onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={checkoutForm.phone}
                    onChange={(e) => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={checkoutForm.street}
                    onChange={(e) => setCheckoutForm({...checkoutForm, street: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={checkoutForm.city}
                      onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={checkoutForm.state}
                      onChange={(e) => setCheckoutForm({...checkoutForm, state: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={checkoutForm.zipCode}
                      onChange={(e) => setCheckoutForm({...checkoutForm, zipCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={checkoutForm.country}
                    onChange={(e) => setCheckoutForm({...checkoutForm, country: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Payment Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={checkoutForm.cardNumber}
                    onChange={(e) => setCheckoutForm({...checkoutForm, cardNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={checkoutForm.cardholderName}
                    onChange={(e) => setCheckoutForm({...checkoutForm, cardholderName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={checkoutForm.expiryDate}
                      onChange={(e) => setCheckoutForm({...checkoutForm, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={checkoutForm.cvv}
                      onChange={(e) => setCheckoutForm({...checkoutForm, cvv: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 text-gray-800">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-800">${getCartShipping().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-800">${getCartTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-200 pt-2 text-gray-800">
                    <span>Total:</span>
                    <span>${getCartGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Complete Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // User Profile Modal Component
  const UserProfileModal: React.FC = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Account</h2>
            <button 
              onClick={() => setShowUserProfile(false)}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">My Bids</h3>
              {userBids.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No bids placed yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBids.map((bid) => {
                    const product = [...auctionProducts, ...marketplaceProducts].find(p => p.id === bid.productId);
                    return (
                      <div key={bid.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product?.image} 
                            alt={product?.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{product?.title}</h4>
                            <p className="text-sm text-gray-500">Bid: ${bid.amount}</p>
                            <p className="text-xs text-gray-400">{bid.timestamp.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-800">Order History</h3>
              {orders.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{order.id}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{order.items.length} items</p>
                      <p className="text-sm text-gray-500">Total: ${order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{order.createdAt.toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Payment Success Modal Component
  const PaymentSuccessModal: React.FC = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
        <button 
          onClick={() => setPaymentSuccess(false)}
          className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  // Login Page Component
  const LoginPage: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button 
          onClick={() => setCurrentPage('home')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <Package className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to your StorageMax account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-orange-600 hover:text-orange-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button 
              onClick={() => setCurrentPage('register')}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Registration Page Component
  const RegisterPage: React.FC = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button 
          onClick={() => setCurrentPage('home')}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <Package className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Join StorageMax</h1>
            <p className="text-gray-600">Create your account to start bidding and shopping</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={registerForm.agreeTerms}
                onChange={(e) => setRegisterForm({...registerForm, agreeTerms: e.target.checked})}
                className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                required
              />
              <div className="ml-3 text-sm">
                <span className="text-gray-600">
                  I agree to the{' '}
                  <button type="button" className="text-orange-600 hover:text-orange-700 transition-colors">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-orange-600 hover:text-orange-700 transition-colors">
                    Privacy Policy
                  </button>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <button 
              onClick={() => setCurrentPage('login')}
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Header Component
  const Header: React.FC = () => (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold flex items-center">
              <Package className="w-8 h-8 mr-2" />
              StorageMax
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-4 pr-12 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600 p-2 rounded-lg">
                <Search className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative hover:text-orange-200 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                3
              </span>
            </button>
            
            <button 
              onClick={() => setShowCart(true)}
              className="relative hover:text-orange-200 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartCount}
              </span>
            </button>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowUserProfile(true)}
                  className="flex items-center gap-2 hover:text-orange-200 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span>My Account</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="hover:text-orange-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('login')}
                className="flex items-center gap-2 hover:text-orange-200 transition-colors"
              >
                <User className="w-6 h-6" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`hover:text-orange-200 transition-colors ${currentPage === 'home' ? 'text-orange-200 font-medium' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('categories')}
              className={`hover:text-orange-200 transition-colors ${currentPage === 'categories' ? 'text-orange-200 font-medium' : ''}`}
            >
              Categories
            </button>
            <button className="hover:text-orange-200 transition-colors">Flash Sale</button>
            <button className="hover:text-orange-200 transition-colors">Deals</button>
          </div>

          <div className="flex bg-white/20 rounded-full p-1">
            <button
              onClick={() => setCurrentMode('auction')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentMode === 'auction' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/10'
              }`}
            >
              🔨 Auction Mode
            </button>
            <button
              onClick={() => setCurrentMode('marketplace')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentMode === 'marketplace' ? 'bg-white text-orange-600' : 'text-white hover:bg-white/10'
              }`}
            >
              🛒 Buy & Sell
            </button>
          </div>
        </div>
      </div>
    </header>
  );

  // Home Page Component
  const HomePage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">
              {currentMode === 'auction' ? 'Bid & Win Amazing Items' : 'Shop & Save More'}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {currentMode === 'auction' 
                ? 'Discover unique items from storage units and bid to win great deals'
                : 'Find everything you need at unbeatable prices'
              }
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                {currentMode === 'auction' ? 'Start Bidding' : 'Shop Now'}
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Browse Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategoryId(category.id);
                setCurrentPage('category');
              }}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentMode === 'auction' ? '🔥 Hot Auctions' : '⭐ Featured Products'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );

  // Categories Page Component
  const CategoriesPage: React.FC = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Categories</h1>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:shadow-md transition-all">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <select className="px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option>Sort by Popular</option>
              <option>Sort by Name</option>
              <option>Sort by Items Count</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-medium text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 500) + 100} items
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Category Browse Page (Shopee/Lazada style)
  const CategoryBrowsePage: React.FC = () => {
    const category = categories.find(c => c.id === selectedCategoryId) || null;
    // Only show auction items for bidding experience
    let items = auctionProducts.filter(p => !selectedCategoryId || p.categoryId === selectedCategoryId);

    // Text search within category using global searchQuery
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(p => p.title.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }

    // Price filter (based on currentBid)
    const min = categoryMinPrice ? parseFloat(categoryMinPrice) : undefined;
    const max = categoryMaxPrice ? parseFloat(categoryMaxPrice) : undefined;
    if (min !== undefined) items = items.filter(p => (p.currentBid || 0) >= min);
    if (max !== undefined) items = items.filter(p => (p.currentBid || 0) <= max);

    // Sorting
    items = [...items].sort((a, b) => {
      switch (categorySort) {
        case 'price_asc':
          return (a.currentBid || 0) - (b.currentBid || 0);
        case 'price_desc':
          return (b.currentBid || 0) - (a.currentBid || 0);
        case 'bids_desc':
          return (b.bids || 0) - (a.bids || 0);
        default:
          return (b.endTime?.getTime() || 0) - (a.endTime?.getTime() || 0);
      }
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{category ? category.name : 'All Auctions'}</h1>
              <p className="text-sm text-gray-500">{items.length} items found</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={categorySort}
                onChange={(e) => setCategorySort(e.target.value as any)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="latest">Sort: Latest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="bids_desc">Most Bids</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters */}
            <aside className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
                <h3 className="font-medium text-gray-800 mb-4">Filters</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Price Range</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={categoryMinPrice}
                        onChange={(e) => setCategoryMinPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={categoryMaxPrice}
                        onChange={(e) => setCategoryMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <button
                      onClick={() => {
                        setCategoryMinPrice('');
                        setCategoryMaxPrice('');
                      }}
                      className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Results */}
            <section className="md:col-span-3">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {items.length === 0 && (
                  <div className="col-span-full bg-white p-8 rounded-lg text-center text-gray-500">
                    No items match your filters.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'categories' && <CategoriesPage />}
      {currentPage === 'category' && <CategoryBrowsePage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'register' && <RegisterPage />}
      
      {/* Modals */}
      {showCart && <CartModal />}
      {showBidModal && <BidModal />}
      {showCheckout && <CheckoutModal />}
      {showUserProfile && <UserProfileModal />}
      {paymentSuccess && <PaymentSuccessModal />}
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold">StorageMax</span>
              </div>
              <p className="text-gray-300 mb-4">
                Your premier destination for storage unit auctions and quality marketplace deals.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-300">
                <div>About Us</div>
                <div>How It Works</div>
                <div>Seller Center</div>
                <div>Customer Service</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <div className="space-y-2 text-gray-300">
                <div>Electronics</div>
                <div>Fashion</div>
                <div>Home & Garden</div>
                <div>More Categories</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <div className="space-y-2 text-gray-300">
                <div>Help Center</div>
                <div>Payment Methods</div>
                <div>Shipping Info</div>
                <div>Returns</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 StorageMax. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorageMaxApp;