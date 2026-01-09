import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, CartItem, FavoriteItem, Cart } from '../types/publicTypes';

const FAVORITES_KEY = '@favorites';
const CART_KEY = '@cart';
const CHECKOUT_DATA_KEY = '@checkout_data';
const SCAN_HISTORY_KEY = '@scan_history';

// Checkout form data interface
interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  deliveryNote: string;
  address: string;
  landmark: string;
}

// Scan history interface
interface ScanHistoryItem {
  trackingCode: string;
  orderId?: string;
  customerName?: string;
  status?: string;
  scannedAt: string;
  orderData?: any; // Full order data if available
}

// Helper function to get consistent product ID
const getProductId = (product: any): string => {
  return product._id || product.id || product.uuid || product.slug;
};

// Favorites Storage Service
export class FavoritesService {
  static async getFavorites(): Promise<FavoriteItem[]> {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  static async addToFavorites(product: Product): Promise<FavoriteItem[]> {
    try {
      const favorites = await this.getFavorites();
      const productId = getProductId(product);
      const existingIndex = favorites.findIndex(item => getProductId(item.product) === productId);
      
      if (existingIndex === -1) {
        const newFavorite: FavoriteItem = {
          product,
          addedAt: new Date().toISOString(),
        };
        favorites.unshift(newFavorite);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      }
      
      return favorites;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return [];
    }
  }

  static async removeFromFavorites(productId: string): Promise<FavoriteItem[]> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(item => getProductId(item.product) !== productId);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return updatedFavorites;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return [];
    }
  }



  static async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }
}

// Cart Storage Service
export class CartService {
  static async getCart(): Promise<Cart> {
    try {
      const cartJson = await AsyncStorage.getItem(CART_KEY);
      if (cartJson) {
        const cart = JSON.parse(cartJson);
        return cart;
      }
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error getting cart:', error);
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  static async addToCart(product: Product, quantity: number = 1, variant?: any): Promise<Cart> {
    try {
      const cart = await this.getCart();
      const productId = getProductId(product);
      const variantId = variant?._id || variant?.id || null;
      
      // Find existing item with same product and variant
      const existingIndex = cart.items.findIndex(item => {
        const itemProductId = getProductId(item.product);
        const itemVariantId = item.variant?._id || null;
        return itemProductId === productId && itemVariantId === variantId;
      });
      
      if (existingIndex !== -1) {
        // Update existing item quantity
        cart.items[existingIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          addedAt: new Date().toISOString(),
          variant: variant || undefined,
        };
        cart.items.push(newItem);
      }
      
      // Recalculate totals
      const updatedCart = this.calculateCartTotals(cart);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return await this.getCart();
    }
  }

  static async updateCartItemQuantity(productId: string, quantity: number): Promise<Cart> {
    try {
      const cart = await this.getCart();
      const itemIndex = cart.items.findIndex(item => getProductId(item.product) === productId);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          cart.items.splice(itemIndex, 1);
        } else {
          // Update quantity
          cart.items[itemIndex].quantity = quantity;
        }
      }
      
      // Recalculate totals
      const updatedCart = this.calculateCartTotals(cart);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return await this.getCart();
    }
  }

  static async removeFromCart(productId: string): Promise<Cart> {
    try {
      const cart = await this.getCart();
      cart.items = cart.items.filter(item => getProductId(item.product) !== productId);
      
      // Recalculate totals
      const updatedCart = this.calculateCartTotals(cart);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return await this.getCart();
    }
  }

  static async removeCartItemByIndex(index: number): Promise<Cart> {
    try {
      const cart = await this.getCart();
      if (index >= 0 && index < cart.items.length) {
        cart.items.splice(index, 1);
      }
      
      // Recalculate totals
      const updatedCart = this.calculateCartTotals(cart);
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
      return updatedCart;
    } catch (error) {
      console.error('Error removing cart item by index:', error);
      return await this.getCart();
    }
  }

  static async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }



  private static calculateCartTotals(cart: Cart): Cart {
    let totalItems = 0;
    let totalAmount = 0;

    cart.items.forEach(item => {
      totalItems += item.quantity;
      totalAmount += item.product.price * item.quantity;
    });

    return {
      ...cart,
      totalItems,
      totalAmount,
      updatedAt: new Date().toISOString(),
    };
  }
}

// Checkout Data Storage Service
export class CheckoutService {
  static async getCheckoutData(): Promise<Partial<CheckoutFormData>> {
    try {
      const checkoutDataJson = await AsyncStorage.getItem(CHECKOUT_DATA_KEY);
      return checkoutDataJson ? JSON.parse(checkoutDataJson) : {};
    } catch (error) {
      console.error('Error getting checkout data:', error);
      return {};
    }
  }

  static async saveCheckoutData(data: CheckoutFormData): Promise<void> {
    try {
      // Only save non-empty values and exclude deliveryNote for privacy
      const dataToSave = {
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        alternatePhone: data.alternatePhone || '',
        address: data.address || '',
        landmark: data.landmark || '',
        // deliveryNote is intentionally excluded for privacy
      };
      
      // Remove empty values to keep storage clean
      const cleanedData = Object.fromEntries(
        Object.entries(dataToSave).filter(([_, value]) => value !== '')
      );
      
      await AsyncStorage.setItem(CHECKOUT_DATA_KEY, JSON.stringify(cleanedData));
    } catch (error) {
      console.error('Error saving checkout data:', error);
    }
  }

  static async clearCheckoutData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHECKOUT_DATA_KEY);
    } catch (error) {
      console.error('Error clearing checkout data:', error);
    }
  }
}

// Scan History Storage Service
export class ScanHistoryService {
  static async getScanHistory(): Promise<ScanHistoryItem[]> {
    try {
      const historyJson = await AsyncStorage.getItem(SCAN_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('Error getting scan history:', error);
      return [];
    }
  }

  static async addToScanHistory(item: Omit<ScanHistoryItem, 'scannedAt'>): Promise<ScanHistoryItem[]> {
    try {
      const history = await this.getScanHistory();
      const existingIndex = history.findIndex(h => h.trackingCode === item.trackingCode);
      
      const scanItem: ScanHistoryItem = {
        ...item,
        scannedAt: new Date().toISOString(),
      };
      
      if (existingIndex !== -1) {
        // Update existing item with new data and timestamp
        history[existingIndex] = scanItem;
      } else {
        // Add new item at the beginning
        history.unshift(scanItem);
        
        // Keep only last 50 scans
        if (history.length > 50) {
          history.splice(50);
        }
      }
      
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(history));
      return history;
    } catch (error) {
      console.error('Error adding to scan history:', error);
      return await this.getScanHistory();
    }
  }

  static async removeScanHistoryItem(trackingCode: string): Promise<ScanHistoryItem[]> {
    try {
      const history = await this.getScanHistory();
      const updatedHistory = history.filter(item => item.trackingCode !== trackingCode);
      await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      console.error('Error removing scan history item:', error);
      return await this.getScanHistory();
    }
  }

  static async clearScanHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SCAN_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing scan history:', error);
    }
  }

  static async updateScanHistoryWithOrderData(trackingCode: string, orderData: any): Promise<void> {
    try {
      const history = await this.getScanHistory();
      const itemIndex = history.findIndex(h => h.trackingCode === trackingCode);
      
      if (itemIndex !== -1) {
        history[itemIndex] = {
          ...history[itemIndex],
          orderId: orderData.orderId,
          customerName: orderData.customerProfile?.name,
          status: orderData.deliveryStatus,
          orderData: orderData,
          scannedAt: new Date().toISOString(), // Update timestamp
        };
        
        await AsyncStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(history));
      }
    } catch (error) {
      console.error('Error updating scan history with order data:', error);
    }
  }
}

// Combined service for easier use
export class StorageService {
  static favorites = FavoritesService;
  static cart = CartService;
  static checkout = CheckoutService;
  static scanHistory = ScanHistoryService;
}
