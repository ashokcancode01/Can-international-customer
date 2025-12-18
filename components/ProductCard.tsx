import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../utils/publicUtils";
import { useTheme } from "../theme/ThemeProvider";
import ThemedText from "./themed/ThemedText";

const { width } = Dimensions.get("window");
// Better spacing for two cards per row with proper gap
const CARD_PADDING = 16;
const CARD_GAP = 0;
const PRODUCT_WIDTH = (width - CARD_PADDING * 2 - CARD_GAP) / 2;

interface ProductCardProps {
  item: any;
  index?: number;
  tabName?: string;
  favorites: Set<string>;
  cartItems: Record<string, number>;
  onToggleFavorite: (product: any) => void;
  onAddToCart: (product: any) => void;
  onPress?: (product: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  index,
  tabName = "",
  favorites,
  cartItems,
  onToggleFavorite,
  onAddToCart,
  onPress,
}) => {
  const { theme } = useTheme();

  // Helper function to get consistent product ID
  const getProductId = () => item._id || item.id || item.uuid || item.slug;
  // Extract product image URL
  const getProductImage = () => {
    if (item.productImages && item.productImages.length > 0) {
      return item.productImages[0].url;
    }
    if (item.image) return item.image;
    if (item.thumbnail) return item.thumbnail;
    return "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg";
  };

  // Get best variant (lowest price in stock from available variants)
  const getBestVariant = () => {
    if (
      !item.variants ||
      !Array.isArray(item.variants) ||
      item.variants.length === 0
    ) {
      return null;
    }

    // Filter variants that have stock
    const inStockVariants = item.variants.filter(
      (variant: any) => variant.quantity && variant.quantity > 0
    );

    if (inStockVariants.length === 0) {
      // If no variants have stock, return the first variant for display
      return item.variants[0];
    }

    // Sort by selling price and return the cheapest in-stock variant
    return inStockVariants.sort(
      (a: any, b: any) => (a.sellingPrice || 0) - (b.sellingPrice || 0)
    )[0];
  };

  // Check stock status - main product first, then variants
  const getStockStatus = () => {
    const mainHasStock = item.quantity && item.quantity > 0;

    if (
      !item.variants ||
      !Array.isArray(item.variants) ||
      item.variants.length === 0
    ) {
      // No variants, only main product stock matters
      return {
        inStock: mainHasStock,
        totalStock: item.quantity || 0,
        mainProductStock: item.quantity,
        hasVariants: false,
        isMainProductAvailable: mainHasStock,
        isVariantsAvailable: false,
      };
    }

    // Has variants - check both main and variant stock
    const variantStock = item.variants.reduce(
      (sum: number, variant: any) => sum + (variant.quantity || 0),
      0
    );

    const inStockVariants = item.variants.filter(
      (v: any) => v.quantity && v.quantity > 0
    ).length;

    const variantsHaveStock = variantStock > 0 && inStockVariants > 0;

    return {
      inStock: mainHasStock || variantsHaveStock, // Either main OR variants available
      totalStock: variantStock,
      variantCount: item.variants.length,
      inStockVariants: inStockVariants,
      mainProductStock: item.quantity,
      hasVariants: true,
      allVariantsOutOfStock: inStockVariants === 0,
      isMainProductAvailable: mainHasStock,
      isVariantsAvailable: variantsHaveStock,
    };
  };

  // Calculate discount percentage from best variant
  const getDiscountPercentage = (variant: any = null) => {
    const selectedVariant = variant || getBestVariant();
    if (!selectedVariant) return null;

    const selling = selectedVariant.sellingPrice || item.sellingPrice || 0;
    const crossed = selectedVariant.crossedPrice || item.crossedPrice || 0;

    if (crossed > selling && selling > 0) {
      return Math.round(((crossed - selling) / crossed) * 100);
    }
    return null;
  };

  const bestVariant = getBestVariant();
  const stockStatus = getStockStatus();
  const discountPercent = getDiscountPercentage(bestVariant);

  const dynamicStyles = getStyles(theme);

  return (
    <TouchableOpacity
      style={dynamicStyles.productCard}
      onPress={() => onPress && onPress(item)}
    >
      <View style={dynamicStyles.imageContainer}>
        <Image
          source={{ uri: getProductImage() }}
          style={dynamicStyles.productImage}
          resizeMode="cover"
        />

        <View
          style={[
            dynamicStyles.stockStatusBadge,
            {
              backgroundColor: stockStatus.inStock
                ? theme.colors.success
                : theme.colors.error,
            },
          ]}
        >
          <Text style={dynamicStyles.stockStatusText}>
            {item.quantity && item.quantity > 0
              ? "Available"
              : stockStatus.hasVariants && stockStatus.inStock
              ? "Variants Available"
              : "Out of Stock"}
          </Text>
        </View>

        {discountPercent && (
          <View style={dynamicStyles.discountBadge}>
            <Text style={dynamicStyles.discountText}>
              {discountPercent}% OFF
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={dynamicStyles.favoriteButton}
          onPress={() => onToggleFavorite(item)}
        >
          <Ionicons
            name={favorites.has(getProductId()) ? "heart" : "heart-outline"}
            size={14}
            color={
              favorites.has(getProductId())
                ? theme.colors.error
                : theme.colors.textSecondary
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={dynamicStyles.cartButton}
          onPress={() => onAddToCart(item)}
        >
          {cartItems[getProductId()] ? (
            <View style={dynamicStyles.cartQuantityBadge}>
              <ThemedText
                style={[
                  dynamicStyles.cartQuantityText,
                  { fontFamily: theme.fonts.semibold },
                ]}
              >
                {cartItems[getProductId()]}
              </ThemedText>
            </View>
          ) : (
            <Ionicons
              name="bag-add-outline"
              size={14}
              color={theme.colors.brandColor}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={dynamicStyles.productInfo}>
        <ThemedText style={dynamicStyles.productName} numberOfLines={1}>
          {item.productName || item.name || item.title || "Product Name"}
        </ThemedText>

        <View style={dynamicStyles.priceContainer}>
          {bestVariant ? (
            <View>
              <View style={dynamicStyles.priceRow}>
                {!!item?.priceRange?.length &&
                item.priceRange[0] !== item.priceRange[1] ? (
                  <ThemedText
                    style={[
                      dynamicStyles.currentPrice,
                      { fontFamily: theme.fonts.semibold },
                    ]}
                  >
                    Rs. {`${item?.priceRange[0]} - ${item?.priceRange[1]}`}
                  </ThemedText>
                ) : (
                  <ThemedText
                    style={[
                      dynamicStyles.currentPrice,
                      { fontFamily: theme.fonts.semibold },
                    ]}
                  >
                    {formatPrice(bestVariant.sellingPrice || 0)}
                  </ThemedText>
                )}

                {bestVariant.crossedPrice && !item?.priceRange?.length ? (
                  <ThemedText
                    style={[dynamicStyles.originalPrice, { marginLeft: 5 }]}
                  >
                    {formatPrice(bestVariant.crossedPrice)}
                  </ThemedText>
                ) : null}

                {/* {bestVariant?.sellingUnit && (
                  <ThemedText style={dynamicStyles.unitText}>
                    / {bestVariant.sellingUnit.toLowerCase()}
                  </ThemedText>
                )} */}
              </View>
            </View>
          ) : (
            <ThemedText
              style={[
                dynamicStyles.currentPrice,
                { fontFamily: theme.fonts.semibold },
              ]}
            >
              {formatPrice(item.sellingPrice || item.price || 0)}
            </ThemedText>
          )}
        </View>

        {item?.overallRating && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <FontAwesome name="star" size={12} color="#FFD700" />

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ThemedText style={{ fontSize: 11 }}>
                {Number(item?.overallRating).toFixed(1)}
              </ThemedText>

              {!item?.priceRange?.length && (
                <ThemedText
                  style={{
                    color: !item?.quantity
                      ? "#FF4757"
                      : theme.colors.textSecondary,
                    fontSize: 11,
                  }}
                >
                  {" "}
                  | {!item?.quantity ? "Out of stock" : `${item.quantity} left`}
                </ThemedText>
              )}
            </View>
          </View>
        )}

        {/* {stockStatus.hasVariants && stockStatus.inStock ? (
          <View style={dynamicStyles.stockSummaryContainer}>
            <Ionicons
              name="cube-outline"
              size={12}
              color={theme.colors.success}
            />

            {stockStatus.totalStock <= 50 ? (
              <Text style={dynamicStyles.stockSummaryText}>
                Only {stockStatus.totalStock} total left!
              </Text>
            ) : (
              <Text style={dynamicStyles.stockSummaryText}>
                {stockStatus.totalStock} total available
              </Text>
            )}
          </View>
        ) : null}

        {(!item.variants || item.variants.length === 0) && item.quantity ? (
          <View style={dynamicStyles.simpleStockContainer}>
            <Text style={dynamicStyles.simpleStockText}>
              {item.quantity <= 10
                ? `Only ${item.quantity} left!`
                : `${item.quantity} available`}
            </Text>
          </View>
        ) : null}

        {(!item.variants || item.variants.length === 0) &&
          item.sizeOptions &&
          item.sizeOptions.length > 0 && (
            <View style={dynamicStyles.sizeContainer}>
              <Text style={dynamicStyles.sizeLabel}>Sizes: </Text>
              <Text style={dynamicStyles.sizeText} numberOfLines={1}>
                {item.sizeOptions.slice(0, 3).join(", ")}
                {item.sizeOptions.length > 3 &&
                  ` +${item.sizeOptions.length - 3} more`}
              </Text>
            </View>
          )} */}

        {/* <View style={dynamicStyles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFA726" />
          <Text style={dynamicStyles.ratingText}>4.2</Text>
          <Text style={dynamicStyles.reviewText}>(250+ reviews)</Text>
        </View>

        <View style={dynamicStyles.deliveryBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#27AE60" />
          <Text style={dynamicStyles.deliveryText}>Free Delivery</Text>
        </View> */}

        {tabName === "Recent" && item.createdAt && (
          <Text style={dynamicStyles.dateAdded}>
            Added: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        )}
        {tabName === "Under ₹1000" &&
          bestVariant &&
          bestVariant.sellingPrice <= 1000 && (
            <View style={dynamicStyles.savingsContainer}>
              <Ionicons
                name="trending-down"
                size={12}
                color={theme.colors.success}
              />
              <Text style={dynamicStyles.savingsText}>Great Value!</Text>
            </View>
          )}
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    productCard: {
      width: PRODUCT_WIDTH,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      // elevation: 4,
      // shadowColor: theme.colors.shadow || "#000",
      // shadowOffset: { width: 0, height: 3 },
      // shadowOpacity: 0.12,
      // shadowRadius: 8,
      overflow: "hidden",
      alignSelf: "flex-start",
      minHeight: 200,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.border + "20",
    },
    imageContainer: {
      position: "relative",
      backgroundColor: "#f8f9fa",
      borderRadius: 16,
      overflow: "hidden",
    },
    productImage: {
      width: "100%",
      height: 170,
      resizeMode: "cover",
    },
    stockStatusBadge: {
      position: "absolute",
      bottom: 10,
      left: 10,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    stockStatusText: {
      color: "#FFFFFF",
      fontSize: 9,
      fontWeight: "600",
    },
    discountBadge: {
      position: "absolute",
      top: 10,
      left: 10,
      backgroundColor: "#FF4757",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    discountText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "bold",
    },
    favoriteButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 13,
      width: 26,
      height: 26,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    cartButton: {
      position: "absolute",
      top: 45,
      right: 10,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderRadius: 13,
      width: 26,
      height: 26,
      alignItems: "center",
      justifyContent: "center",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    cartQuantityBadge: {
      backgroundColor: "#E74C3C",
      borderRadius: "50%",
      // paddingHorizontal: 8,
      // paddingVertical: 3,
      // minWidth: 24,
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      height: "80%",
      width: "80%",
    },
    cartQuantityText: {
      color: "#FFFFFF",
      fontSize: 10,
    },
    productInfo: {
      padding: 10,
      paddingTop: 10,
      gap: 4,
    },
    productName: {
      fontSize: 12,
      // marginBottom: 6,
      color: theme.colors.text,
      fontFamily: theme.fonts.semibold,
    },
    priceContainer: {
      flexDirection: "row",
      alignItems: "center",
      // marginBottom: 10,
      flexWrap: "wrap",
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    currentPrice: {
      fontSize: 12,
      // fontWeight: "bold",
      color: "#E74C3C",
      // marginRight: 4,
    },
    originalPrice: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      textDecorationLine: "line-through",
      marginRight: 4,
    },
    unitText: {
      fontSize: 8,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      marginLeft: 3,
    },
    stockSummaryContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      backgroundColor: theme.colors.success + "20",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    stockSummaryText: {
      fontSize: 8,
      color: theme.colors.success,
      marginLeft: 4,
      fontWeight: "600",
    },
    variantListContainer: {
      marginBottom: 6,
    },
    variantLabel: {
      fontSize: 9,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    variantItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 3,
      paddingHorizontal: 2,
    },
    variantOptionText: {
      fontSize: 10,
      color: theme.colors.text,
      fontWeight: "500",
      flex: 1,
    },
    variantQuantityBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      minWidth: 50,
      alignItems: "center",
    },
    variantQuantityText: {
      fontSize: 8,
      fontWeight: "600",
    },
    moreVariantsText: {
      fontSize: 9,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
      textAlign: "center",
      marginTop: 2,
    },
    simpleStockContainer: {
      backgroundColor: theme.colors.success + "20",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginBottom: 4,
      alignSelf: "flex-start",
    },
    simpleStockText: {
      fontSize: 10,
      color: theme.colors.success,
      fontWeight: "500",
    },
    sizeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      flexWrap: "wrap",
    },
    sizeLabel: {
      fontSize: 9,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    sizeText: {
      fontSize: 9,
      color: theme.colors.textSecondary,
      flex: 1,
    },
    dateAdded: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      fontStyle: "italic",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    ratingText: {
      fontSize: 10,
      color: "#424242",
      marginLeft: 4,
      fontWeight: "500",
    },
    reviewText: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    deliveryBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#E8F8F5",
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 6,
      alignSelf: "flex-start",
      marginBottom: 6,
    },
    deliveryText: {
      fontSize: 10,
      color: "#27AE60",
      marginLeft: 3,
      fontWeight: "500",
    },
    savingsContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    savingsText: {
      fontSize: 10,
      color: theme.colors.success,
      marginLeft: 4,
      fontWeight: "500",
    },
  });

export default ProductCard;
