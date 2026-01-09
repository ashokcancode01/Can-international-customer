// Tab Count Manager - Event system to update tab badges
type TabCountListener = (favoritesCount: number, cartCount: number) => void;

class TabCountManager {
  private listeners: Set<TabCountListener> = new Set();

  addListener(listener: TabCountListener) {
    this.listeners.add(listener);
  }

  removeListener(listener: TabCountListener) {
    this.listeners.delete(listener);
  }

  async notifyCountsChanged() {
    try {
      const { StorageService } = await import("./storageService");
      const [favorites, cart] = await Promise.all([
        StorageService.favorites.getFavorites(),
        StorageService.cart.getCart(),
      ]);

      const favoritesCount = favorites.length;
      const cartCount = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      this.listeners.forEach((listener) => {
        listener(favoritesCount, cartCount);
      });
    } catch (error) {
      console.error("Error notifying count changes:", error);
    }
  }
}

export const tabCountManager = new TabCountManager();
