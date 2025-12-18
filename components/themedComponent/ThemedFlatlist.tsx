import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  StyleSheet,
  FlatList,
  ViewStyle,
  ListRenderItem,
  RefreshControl,
  View,
  TextInput,
  TouchableOpacity,
  StyleProp,
  Modal,
  Animated,
} from "react-native";
import CustomEmptyMessage from "../custom/CustomEmptyMessage";
import ThemedView from "../themed/ThemedView";
import ThemedText from "../themed/ThemedText";
import ThemedIcon from "../themed/ThemedIcon";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

interface ThemedFlatListProps<T> {
  data?: T[];
  renderItem: ListRenderItem<T>;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onSearch?: (text: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
  isRefreshing?: boolean;
  isSearching?: boolean;
  isLoadingMore?: boolean;
  setIsAtTop?: (open: boolean) => void;
  style?: ViewStyle;
  showSearch?: boolean;
  emptyMessage?: string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;
  hasMore?: boolean;
  searchPlaceholder?: string;
  hasInitiallyLoaded?: boolean;
  shouldScrollToTop?: boolean;
  showEmptyState?: boolean;
  loadedItemsCount?: number;
  totalItemsCount?: number;
  numColumns?: number;
  columnWrapperStyle?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showCount?: boolean;
  shouldClearSearch?: boolean;
  onSearchCleared?: () => void;
  searchValue?: string;
  onSearchClear?: () => void;
  showFilter?: boolean;
  filterComponent?: any;
  filterModalOpen?: boolean;
  setFilterModalOpen?: any;
  isFilterActive?: boolean;
  onClearFilter?: () => void;
  activeFilters?: { [key: string]: string };
  onClearIndividualFilter?: (filterKey: string) => void;
  hasFilter?: boolean;
  SkeletonItem?: React.ComponentType<any>;
  itemCountForSkeleton?: number;
}

const MemoizedSearchInput = React.memo<{
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder: string;
  placeholderColor: string;
  textColor: string;
  borderColor: string;
  backgroundColor: string;
  fontSize: number;
  fontFamily: string;
  isDark: boolean;
}>(
  ({
    value,
    onChangeText,
    onClear,
    placeholder,
    placeholderColor,
    textColor,
    borderColor,
    backgroundColor,
    fontSize,
    fontFamily,
    isDark,
  }) => (
    <View style={styles.enhancedSearchContainer}>
      <LinearGradient
        colors={
          isDark
            ? ["#1a1a2e", "#16213e", "#0f0f23"]
            : ["#f8fafc", "#e2e8f0", "#cbd5e1"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.enhancedSearchInputContainer,
          {
            shadowColor: isDark ? "#000000" : "#64748b",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: isDark ? 0.4 : 0.15,
            shadowRadius: 32,
            elevation: 12,
            borderColor: isDark ? "#334155" : "#94a3b8",
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.enhancedSearchIconContainer}>
          <ThemedIcon
            as={Ionicons}
            name="search-outline"
            size={20}
            color={value ? textColor : placeholderColor}
          />
        </View>
        <TextInput
          style={[
            styles.enhancedSearchInput,
            {
              fontSize: fontSize,
              color: textColor,
              fontFamily,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          editable={true}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          keyboardType="default"
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={onClear}
            style={styles.enhancedClearButton}
            activeOpacity={0.6}
          >
            <View
              style={[
                styles.clearButtonInner,
                {
                  backgroundColor: isDark ? "#475569" : "#e2e8f0",
                  shadowColor: isDark ? "#000" : "#64748b",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isDark ? 0.3 : 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
            >
              <ThemedIcon
                as={Ionicons}
                name="close"
                size={18}
                color={textColor}
              />
            </View>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  )
);

const MemoizedFooterComponent = React.memo<{
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
  isLoadingMore: boolean;
  isFetching: boolean;
  hasMore: boolean;
  dataLength: number;
  isLoading: boolean;
  isSearching: boolean;
  hasInitiallyLoaded: boolean;
  SkeletonItem?: React.ComponentType<any>;
  itemCountForSkeleton?: number;
}>(
  ({
    ListFooterComponent,
    isLoadingMore,
    isFetching,
    hasMore,
    dataLength,
    isLoading,
    isSearching,
    hasInitiallyLoaded,
    SkeletonItem,
    itemCountForSkeleton = 3,
  }) => {
    if (ListFooterComponent) {
      return ListFooterComponent as React.ReactElement;
    }

    // Show skeleton when loading more data
    if ((isLoadingMore || isFetching) && dataLength > 0 && SkeletonItem) {
      return (
        <View>
          {Array.from({ length: itemCountForSkeleton }).map((_, index) => (
            <SkeletonItem key={`footer-skeleton-${index}`} />
          ))}
        </View>
      );
    }

    if (
      !hasMore &&
      dataLength > 0 &&
      !isLoading &&
      !isSearching &&
      !isLoadingMore &&
      hasInitiallyLoaded
    ) {
      return (
        <View style={styles.endMessage}>
          <ThemedText style={styles.endMessageText}>
            No more data to show
          </ThemedText>
        </View>
      );
    }

    return null;
  }
);

function ThemedFlatList<T>({
  data = [],
  renderItem,
  onLoadMore,
  onRefresh,
  onSearch,
  isLoading = false,
  isFetching = false,
  isRefreshing = false,
  isSearching = false,
  isLoadingMore = false,
  setIsAtTop,
  style,
  showSearch = true,
  emptyMessage = "No records found.",
  ListHeaderComponent,
  ListFooterComponent,
  keyExtractor = (item: any, index) =>
    item?.id?.toString() || item?._id?.toString() || index.toString(),
  hasMore = false,
  searchPlaceholder = "Search...",
  hasInitiallyLoaded = false,
  shouldScrollToTop = false,
  showEmptyState = false,
  loadedItemsCount = 0,
  totalItemsCount = 0,
  numColumns = 1,
  columnWrapperStyle,
  horizontal = false,
  contentContainerStyle,
  showCount = true,
  shouldClearSearch = false,
  onSearchCleared,
  searchValue,
  onSearchClear,
  showFilter = false,
  filterComponent,
  filterModalOpen,
  setFilterModalOpen,
  isFilterActive,
  onClearFilter,
  activeFilters = {},
  onClearIndividualFilter,
  hasFilter = false,
  SkeletonItem,
  itemCountForSkeleton = 6,
}: ThemedFlatListProps<T>) {
  const [localSearchValue, setLocalSearchValue] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const isMountedRef = useRef(true);

  const { theme, isDark } = useTheme();
  const colors = theme.colors;
  const gradientAccent = isDark ? "#444" : "#ddd";

  const translateY = React.useRef(new Animated.Value(300)).current;
  const animationConfig = React.useMemo(
    () => ({
      duration: 200,
      friction: 8,
      tension: 30,
      useNativeDriver: true,
    }),
    []
  );

  React.useEffect(() => {
    if (filterModalOpen) {
      Animated.spring(translateY, {
        toValue: 0,
        ...animationConfig,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: 300,
        ...animationConfig,
      }).start();
    }
  }, [filterModalOpen]);

  const themeValues = useMemo(
    () => ({
      colors,
      fontSize: theme.fontSizes.md1,
      fontFamily: theme.fonts.regular,
    }),
    [colors, theme.fontSizes.md1, theme.fonts.regular]
  );

  useEffect(() => {
    if (shouldClearSearch) {
      setLocalSearchValue("");
      onSearchCleared?.();
    }
  }, [shouldClearSearch, onSearchCleared]);

  useEffect(() => {
    if (searchValue !== undefined && searchValue !== localSearchValue) {
      setLocalSearchValue(searchValue);
    }
  }, [searchValue]);

  const handleScroll = useCallback(
    (event: any) => {
      if (!setIsAtTop) return;
      const offsetY = event?.nativeEvent?.contentOffset?.y ?? 0;
      setIsAtTop(offsetY <= 100);
    },
    [setIsAtTop]
  );

  useEffect(() => {
    if (shouldScrollToTop && flatListRef.current) {
      const scrollToTop = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      };

      requestAnimationFrame(() => {
        scrollToTop();
        setTimeout(scrollToTop, 10);
      });
    }
  }, [shouldScrollToTop]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSearchChange = useCallback(
    (text: string) => {
      setLocalSearchValue(text);
      onSearch?.(text);
    },
    [onSearch]
  );

  const clearSearch = useCallback(() => {
    setLocalSearchValue("");
    if (onSearchClear) {
      onSearchClear();
    } else {
      onSearch?.("");
    }
  }, [onSearch, onSearchClear]);

  const footerComponent = useMemo(
    () => (
      <MemoizedFooterComponent
        ListFooterComponent={ListFooterComponent}
        isLoadingMore={isLoadingMore}
        isFetching={isFetching}
        hasMore={hasMore}
        dataLength={data.length}
        isLoading={isLoading}
        isSearching={isSearching}
        hasInitiallyLoaded={hasInitiallyLoaded}
        SkeletonItem={SkeletonItem}
        itemCountForSkeleton={itemCountForSkeleton}
      />
    ),
    [
      ListFooterComponent,
      isLoadingMore,
      isFetching,
      hasMore,
      data.length,
      isLoading,
      isSearching,
      hasInitiallyLoaded,
      SkeletonItem,
      itemCountForSkeleton,
    ]
  );

  const handleEndReached = useCallback(() => {
    if (
      onLoadMore &&
      !isFetching &&
      !isLoading &&
      !isSearching &&
      !isLoadingMore &&
      hasMore &&
      !isRefreshing &&
      hasInitiallyLoaded &&
      data.length > 0
    ) {
      onLoadMore();
    }
  }, [
    onLoadMore,
    hasMore,
    isFetching,
    isLoading,
    isSearching,
    isLoadingMore,
    isRefreshing,
    hasInitiallyLoaded,
    data.length,
  ]);

  const refreshControl = useMemo(
    () =>
      onRefresh ? (
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[colors.brandColor || "#007AFF"]}
          tintColor={colors.brandColor || "#007AFF"}
        />
      ) : undefined,
    [onRefresh, isRefreshing, colors.brandColor || "#007AFF"]
  );

  const renderSearchHeader = useCallback(() => {
    if (!showSearch) return null;

    const currentValue =
      searchValue !== undefined ? searchValue : localSearchValue;

    return (
      // <MemoizedSearchInput
      //   value={currentValue}
      //   onChangeText={handleSearchChange}
      //   onClear={onSearchClear || clearSearch}
      //   placeholder={searchPlaceholder}
      //   placeholderColor={themeValues.colors.placeholder}
      //   textColor={themeValues.colors.text}
      //   borderColor={themeValues.colors.border}
      //   backgroundColor={themeValues.colors.cardBackground}
      //   fontSize={themeValues.fontSize}
      //   fontFamily={themeValues.fontFamily}
      //   isDark={isDark}
      // />
      <View
        style={{
          height: 44,
          backgroundColor: gradientAccent,
          borderRadius: 10,
        }}
      />
    );
  }, [
    showSearch,
    searchValue,
    localSearchValue,
    handleSearchChange,
    onSearchClear,
    clearSearch,
    searchPlaceholder,
    themeValues,
    isDark,
  ]);

  const memoizedContentContainerStyle = useMemo(
    () => [
      styles.listContentContainer,
      contentContainerStyle,
      (!data || data.length === 0) && styles.emptyListContent,
    ],
    [contentContainerStyle, data]
  );

  const currentSearchValue =
    searchValue !== undefined ? searchValue : localSearchValue;

  // Show initial skeleton when loading and no data
  const shouldShowInitialSkeleton =
    (isLoading && !hasInitiallyLoaded && data.length === 0 && !isSearching) ||
    (isSearching && data.length === 0);

  if (shouldShowInitialSkeleton && SkeletonItem) {
    return (
      <ThemedView style={[styles.container, style]}>
        {((showCount && hasInitiallyLoaded && data.length > 0) ||
          showFilter ||
          showSearch) && (
          <View style={styles.enhancedHeaderContainer}>
            {showSearch && (
              <View style={styles.searchFilterRow}>
                <MemoizedSearchInput
                  value={currentSearchValue}
                  onChangeText={handleSearchChange}
                  onClear={onSearchClear || clearSearch}
                  placeholder={searchPlaceholder}
                  placeholderColor={themeValues.colors.placeholder}
                  textColor={themeValues.colors.text}
                  borderColor={themeValues.colors.border}
                  backgroundColor={themeValues.colors.cardBackground}
                  fontSize={themeValues.fontSize}
                  fontFamily={themeValues.fontFamily}
                  isDark={isDark}
                />
              </View>
            )}
          </View>
        )}
        <View style={styles.listContentContainer}>
          {Array.from({ length: itemCountForSkeleton }).map((_, index) => (
            <SkeletonItem key={`initial-skeleton-${index}`} />
          ))}
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, style]}>
      {((showCount && hasInitiallyLoaded && data.length > 0) ||
        showFilter ||
        showSearch) && (
        <View style={styles.enhancedHeaderContainer}>
          {showCount && hasInitiallyLoaded && data.length > 0 && (
            <View style={styles.modernCountContainer}>
              <LinearGradient
                colors={
                  isDark
                    ? ["#2d3748", "#4a5568", "#2d3748"]
                    : ["#f7fafc", "#edf2f7", "#f7fafc"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.modernCountBadge,
                  {
                    shadowColor: isDark ? "#000" : "#cbd5e1",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0.3 : 0.2,
                    shadowRadius: 12,
                    elevation: 6,
                  },
                ]}
              >
                <ThemedIcon
                  as={Ionicons}
                  name="document-text-outline"
                  size={16}
                  color={colors.brandColor || "#007AFF"}
                />
                <ThemedText
                  style={[styles.modernCountText, { color: colors.text }]}
                >
                  {loadedItemsCount.toLocaleString()}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.modernCountDivider,
                    { color: colors.placeholder },
                  ]}
                >
                  /
                </ThemedText>
                <ThemedText
                  style={[styles.modernCountTotal, { color: colors.text }]}
                >
                  {totalItemsCount.toLocaleString()}
                </ThemedText>
              </LinearGradient>
            </View>
          )}

          {(showSearch || showFilter) && (
            <View style={styles.searchFilterRow}>
              {showSearch && (
                <MemoizedSearchInput
                  value={currentSearchValue}
                  onChangeText={handleSearchChange}
                  onClear={onSearchClear || clearSearch}
                  placeholder={searchPlaceholder}
                  placeholderColor={themeValues.colors.placeholder}
                  textColor={themeValues.colors.text}
                  borderColor={themeValues.colors.border}
                  backgroundColor={themeValues.colors.cardBackground}
                  fontSize={themeValues.fontSize}
                  fontFamily={themeValues.fontFamily}
                  isDark={isDark}
                />
              )}
              {hasFilter && showFilter && (
                <TouchableOpacity
                  onPress={() => setFilterModalOpen(true)}
                  style={[
                    styles.modernFilterButton,
                    {
                      shadowColor: isDark ? "#000000" : "#64748b",
                      shadowOffset: { width: 0, height: 12 },
                      shadowOpacity: isDark ? 0.4 : 0.15,
                      shadowRadius: 32,
                      elevation: 12,
                      borderColor: isDark ? "#334155" : "#94a3b8",
                      marginLeft: 10,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      isFilterActive
                        ? [
                            colors.brandColor || "#007AFF",
                            `${colors.brandColor || "#007AFF"}dd`,
                            colors.brandColor || "#007AFF",
                          ]
                        : isDark
                        ? ["#2d3748", "#4a5568", "#2d3748"]
                        : ["#f7fafc", "#edf2f7", "#f7fafc"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.modernFilterButtonInner,
                      {
                        shadowColor: isDark ? "#000" : "#cbd5e1",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDark ? 0.3 : 0.2,
                        shadowRadius: 12,
                        elevation: 6,
                      },
                    ]}
                  >
                    <ThemedIcon
                      as={MaterialCommunityIcons}
                      name="tune-variant"
                      size={18}
                      color={isFilterActive ? "white" : colors.text}
                    />
                    <ThemedText
                      style={[
                        styles.modernFilterText,
                        {
                          color: isFilterActive ? "white" : colors.text,
                          fontFamily: theme.fonts.medium,
                        },
                      ]}
                    >
                      Filters
                    </ThemedText>
                    {isFilterActive && (
                      <View style={styles.filterActiveDot}>
                        <View style={styles.filterActiveDotInner} />
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}

      {isFilterActive && (
        <View
          style={[
            styles.modernActiveFiltersContainer,
            {
              backgroundColor: isDark
                ? "rgba(59, 130, 246, 0.08)"
                : "rgba(99, 102, 241, 0.05)",
              borderColor: isDark
                ? "rgba(59, 130, 246, 0.15)"
                : "rgba(99, 102, 241, 0.1)",
              shadowColor: isDark ? "#000" : "#6366f1",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.2 : 0.1,
              shadowRadius: 16,
              elevation: 8,
            },
          ]}
        >
          <View style={styles.activeFiltersHeader}>
            <ThemedIcon
              as={MaterialCommunityIcons}
              name="filter-variant"
              size={16}
              color={colors.brandColor || "#007AFF"}
            />
            <ThemedText
              style={[styles.activeFiltersLabel, { color: colors.text }]}
            >
              Active Filters
            </ThemedText>
          </View>

          <View style={styles.activeFiltersChips}>
            {Object.entries(activeFilters).map(
              ([key, value]) =>
                value && (
                  <TouchableOpacity
                    key={key}
                    onPress={() => onClearIndividualFilter?.(key)}
                    activeOpacity={0.8}
                    style={styles.modernFilterChip}
                  >
                    <LinearGradient
                      colors={[
                        colors.brandColor || "#007AFF",
                        `${colors.brandColor || "#007AFF"}cc`,
                        `${colors.brandColor || "#007AFF"}99`,
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.modernFilterChipInner,
                        {
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 8,
                          elevation: 4,
                        },
                      ]}
                    >
                      <ThemedText style={styles.modernFilterChipText}>
                        {value}
                      </ThemedText>
                      <View style={styles.modernFilterChipClose}>
                        <ThemedIcon
                          as={Ionicons}
                          name="close"
                          size={12}
                          color="white"
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                )
            )}

            <TouchableOpacity
              style={styles.modernClearAllButton}
              onPress={onClearFilter}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isDark
                    ? ["#ef4444", "#f87171", "#dc2626"]
                    : ["#feb2b2", "#fc8181", "#ef4444"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.modernClearAllButtonInner,
                  {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  },
                ]}
              >
                <ThemedIcon
                  as={Ionicons}
                  name="trash-outline"
                  size={14}
                  color="white"
                />
                <ThemedText style={styles.modernClearAllText}>
                  Clear All
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showEmptyState &&
      hasInitiallyLoaded &&
      data.length === 0 &&
      !isLoading &&
      !isFetching &&
      !isSearching ? (
        <View style={styles.emptyStateContainer}>
          <CustomEmptyMessage
            isEmpty={currentSearchValue.length === 0}
            message={emptyMessage}
            onRefresh={onRefresh}
            imageWidth={120}
            imageHeight={120}
          />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={refreshControl}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={footerComponent}
          ListEmptyComponent={null}
          contentContainerStyle={memoizedContentContainerStyle}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
          onScroll={handleScroll}
          scrollEventThrottle={32}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          getItemLayout={undefined}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? columnWrapperStyle : undefined}
          horizontal={horizontal}
          legacyImplementation={false}
          disableVirtualization={false}
        />
      )}

      {showFilter && (
        <Modal
          transparent={true}
          visible={filterModalOpen}
          animationType="fade"
          onRequestClose={() => setFilterModalOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setFilterModalOpen(false)}
          >
            <Animated.View
              style={[
                styles.modal,
                {
                  transform: [{ translateY }],
                  backgroundColor: theme.colors.background,
                },
              ]}
            >
              {filterComponent}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Enhanced Header Container
  enhancedHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginBottom: 10,
    paddingTop: 10,
  },

  // Search and Filter Row
  searchFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // Enhanced Search Styles
  enhancedSearchContainer: {
    flex: 1,
    marginBottom: 0,
  },
  enhancedSearchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    overflow: "hidden",
  },
  enhancedSearchIconContainer: {
    marginRight: 10,
  },
  enhancedSearchInput: {
    flex: 1,
    height: "100%",
    fontWeight: "600",
  },
  enhancedClearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearButtonInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  // Modern Stats Container (now header)
  modernStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginBottom: 10,
  },

  // Modern Count Styles
  modernCountContainer: {
    flex: 1,
  },
  modernCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
  },
  modernCountText: {
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
  modernCountDivider: {
    fontSize: 13,
    marginHorizontal: 8,
    opacity: 0.7,
  },
  modernCountTotal: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.9,
  },

  // Modern Filter Button
  modernFilterButton: {
    borderWidth: 1,
    borderRadius: 10,
  },
  modernFilterButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
  },
  modernFilterText: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
  filterActiveDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  filterActiveDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "white",
  },

  // Modern Active Filters
  modernActiveFiltersContainer: {
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  activeFiltersHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activeFiltersLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },
  activeFiltersChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  modernFilterChip: {
    marginBottom: 8,
  },
  modernFilterChipInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
  },
  modernFilterChipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
  modernFilterChipClose: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modernClearAllButton: {
    marginBottom: 8,
  },
  modernClearAllButtonInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    position: "relative",
    overflow: "hidden",
  },
  modernClearAllText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 8,
  },

  // Legacy styles (keeping for compatibility)
  clearButton: {
    marginLeft: 5,
  },
  endMessage: {
    paddingTop: 20,
    alignItems: "center",
  },
  endMessageText: {
    opacity: 0.6,
    fontSize: 13,
  },
  listContentContainer: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 50,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    position: "relative",
    padding: 10,
  },
  modal: {
    position: "absolute",
    width: "100%",
    maxHeight: 500,
    padding: 20,
    top: "20%",
    borderRadius: 5,
  },
});

export default React.memo(ThemedFlatList) as <T>(
  props: ThemedFlatListProps<T>
) => React.ReactElement;
