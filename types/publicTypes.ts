import { CustomerAddress } from "@/store/slices/profile";

export type PublicStackParamList = {
  PublicTabs: undefined;
  ProductDetail: { productId: string };
  ProductCategoryWiseScreen: undefined;
  ProductFilter: {
    searchQuery?: string;
    categoryName?: string;
    title?: string;
  };
  CampaignDetail: {
    campaignSlug?: string;
    campaignTitle?: string;
  };
  BlogsScreen: undefined;
  LogisticOrder: undefined;
  BlogDetail: { blogSlug: string; blogTitle: string };
  BranchesScreen: undefined;
  BranchDetail: {
    accountId: string;
    entityId: string;
    accountName: string;
    entityName: string;
  };
  ChangePasswordForm: { userId?: string; item?: string };
  EditProfileForm: {
    userId?: string;
    item?: string;
    customerItem?: string;
  };
  Appearance: undefined;
  Checkout: {
    mode: "cart" | "buyNow";
    buyNowData?: {
      product: Product;
      variant?: ProductVariant;
      quantity: number;
      totalAmount: number;
    };
  };
  OrderDetail: {
    trackingCode: string;
  };
  LogisticOrderDetail: {
    _id: string;
  };
  VendorOrderDetail: {
    _id: string;
  };
  "Order Form": {
    orderId?: string;
    item?: string;
  };
  Vouchers: undefined;
  VouchersDetail: { _id: string };
  DigitalStamps: undefined;
  DigitalStampsDetail: { _id: string };
  CanId: undefined;
  CanAddressForm: {
    canId?: string;
    item?: any;
  };
  Announcements: undefined;
  AnnouncementDetails: { _id: string };
  MyReviews: undefined;
  Marketplace: undefined;
  Favorites: undefined;
  SearchResults: { query?: string };
  VendorStore: {
    vendorSlug: string;
    vendorName: string;
  };
  CustomerAddressForm: { addressData?: CustomerAddress };
  QRScanner: undefined;
  VendorOrder: undefined;
  "All Reviews": { productId: string };
  OurTrustedProviders: undefined;
  AboutUs: undefined;
  FAQs: undefined;
};

export type PublicTabParamList = {
  Home: undefined;
  Pricing: undefined;
  TrackOrder: undefined;
  Menu: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetail: { productId?: string };
  ProductFilter: {
    searchQuery?: string;
    categoryName?: string;
    title?: string;
  };
  CampaignDetail: {
    campaignSlug?: string;
  };
  BlogsScreen: undefined;
  BlogDetail: { blogSlug: string; blogTitle: string };
  BranchesScreen: undefined;
  BranchDetail: {
    accountId: string;
    entityId: string;
    accountName: string;
    entityName: string;
  };
};

export type FavoritesStackParamList = {
  FavoritesMain: undefined;
  ProductDetail: { productId?: string };
};

export type CartStackParamList = {
  CartMain: undefined;
  ProductDetail: { productId?: string };
};

export type AccountStackParamList = {
  AccountMain: undefined;
  BlogsScreen: undefined;
  BlogDetail: { blogSlug: string; blogTitle: string };
  BranchesScreen: undefined;
  BranchDetail: {
    accountId: string;
    entityId: string;
    accountName: string;
    entityName: string;
  };
};

// API Response Types
export interface ApiCampaign {
  _id: string;
  campaignName: string;
  description: string;
  bannerImage: {
    url: string;
    alt?: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  slug: string;
}

export interface ApiProduct {
  _id: string;
  productName: string;
  slug: string;
  productDescription: string;
  productImages: Array<{
    url: string;
    alt?: string;
  }>;
  sellingPrice: number;
  crossedPrice?: number;
  quantity: number;
  productSku: string;
  hasVariant: boolean;
  vendor: {
    name: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

// UI Types (transformed from API types)
export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  slug?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  categoryId: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  specifications?: { [key: string]: string };
  vendor?: {
    name: string;
    id: string;
    slug: string;
  };
  sku?: string;
  quantity?: number;
  slug?: string;
}

export interface ProductFilter {
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  category?: string;
  sortBy?: "price_low" | "price_high" | "rating" | "newest" | "popular";
  inStock?: boolean;
}

// Cart and Favorites Types
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
  variant?: ProductVariant;
}

export interface FavoriteItem {
  product: Product;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt: string;
}

export interface CampaignProductsResponse {
  data: ApiProduct[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Marketplace Tracking Types
export interface TrackingItem {
  quantity: number;
  price: number;
  _id: string;
  product: {
    _id: string;
    productName: string;
    productImages: Array<{
      name: string;
      type: string;
      size: string;
      url?: string;
    }>;
    variants: any[];
  };
  variant: any;
}

export interface TrackingVendor {
  _id: string;
  name: string;
  phone: string;
  address: string;
}

export interface TrackingCustomer {
  _id: string;
  name: string;
  phone: string;
  address: string;
}

export interface TrackingOrder {
  _id: string;
  orderId: string;
  deliveryStatus: string;
  paymentStatus: string;
  status: string;
  receiver: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  receiverAddress: {
    _id: string;
    address: string;
  };
  sender: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
  branch: {
    _id: string;
    name: string;
  };
  destinationBranch: {
    _id: string;
    name: string;
  };
  deliveryCharge: number;
  codCharge: number;
  weight: number;
  deliverySecurity: string;
  isOnHold: boolean;
  collectionStatus: boolean;
  vendorReturn: boolean;
  createdAt: string;
  updatedAt: string;
}

// Blog Types
export interface BlogCategory {
  _id: string;
  name: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
}

export interface Blog {
  _id: string;
  image: string;
  title: string;
  content: string;
  author: string;
  category: BlogCategory;
  tags: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  createdBy: BlogAuthor;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface BlogListResponse {
  data: Blog[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages?: number;
}

// Branch Types
export interface BranchAccount {
  _id: string;
  name: string;
  displayName: string;
  email: string;
  isActive: boolean;
  code: string;
}

export interface BranchCountry {
  name: string;
  cca2: string;
  cca3: string;
}

export interface BranchEntity {
  _id: string;
  name: string;
  displayName: string;
  code: string;
  country: BranchCountry;
  isActive: boolean;
}

export interface ServiceProvider {
  entityCount: number;
  account: BranchAccount;
  entities: BranchEntity[];
}

export interface ServiceProvidersResponse {
  data: ServiceProvider[];
  page: number;
  limit: number;
  totalItems: number;
  totalEntities: number;
  totalAccounts: number;
}

export interface Branch {
  _id: string;
  account: string;
  address: string;
  areasCovered: string;
  code: string;
  entity: string;
  name: string;
  phone: string;
  additionalPhone: string;
  status: string;
}

export interface BranchListResponse {
  data: Branch[];
  totalItems: number;
}

// Product Detail Types
export interface ProductImage {
  name: string;
  type: string;
  size: string;
  publicId: string;
  url: string;
  _id: string;
}

export interface ProductCategory {
  _id: string;
  categoryName: string;
}

export interface ProductVendor {
  _id: string;
  name: string;
  slug: string;
}

export interface PackageType {
  _id: string;
  code: string;
  c1: string;
  c2: string;
  name: string;
}

export interface CategoryDetails {
  _id: string;
  categoryName: string;
  slug: string;
  packageType: string;
}

export interface ProductVariant {
  _id: string;
  crossedPrice: number;
  sellingPrice: number;
  quantity: number;
  weight: number;
  productSku: string;
  option: string;
  moq: number;
  sellingUnit: string;
  allowSaleBelowMOQ: boolean;
  image: ProductImage;
  images: ProductImage[];
}

export interface ProductDetail {
  _id: string;
  addedUser: string;
  productName: string;
  slug: string;
  productDescription: string;
  productImages: ProductImage[];
  hasVariant: boolean;
  sellingPrice: number | null;
  crossedPrice: number | null;
  quantity: number | null;
  weight: number;
  moq: number;
  sellingUnit: string;
  productSku: string;
  isActive: boolean;
  isAdminDisabled: boolean;
  categories: ProductCategory[];
  websites: string[];
  variantOptions: any[];
  sizeOptions: string[];
  variants: ProductVariant[];
  vendor: ProductVendor;
  allowSaleBelowMOQ: boolean;
  showToMarketPlace: boolean;
  productVideos: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  isAgeRestricted?: boolean;
  uuid: string;
  firstCategory: string;
  categoryDetails: CategoryDetails;
  packageType: PackageType;
}

export interface RelatedProduct {
  _id: string;
  uuid: string;
  addedUser: string;
  productName: string;
  slug: string;
  productDescription: string;
  productImages: ProductImage[];
  hasVariant: boolean;
  sellingPrice: number;
  crossedPrice: number | null;
  quantity: number;
  weight: number;
  moq: number;
  sellingUnit: string;
  productSku: string;
  isActive: boolean;
  isAdminDisabled: boolean;
  categories: string[];
  websites: string[];
  variantOptions: any[];
  sizeOptions: any[];
  variants: any[];
  vendor: string;
  allowSaleBelowMOQ: boolean;
  showToMarketPlace: boolean;
  isAgeRestricted: boolean;
  productVideos: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  outOfStock: boolean;
  id: string;
}
