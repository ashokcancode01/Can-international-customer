import React, { useCallback, useState } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Keyboard,
    FlatList,
    Text,
    Dimensions,
    Share,
    RefreshControl
} from "react-native";
import { Ionicons, Entypo, Feather } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { useGetBranchListQuery } from "@/store/slices/branches";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SectionCard from "@/screens/Home/components/SectionCard";
import LoadingIndicator from "@/components/LoadingIndicator";

type RootStackParamList = {
    BranchesDetails: { branchId: string };
};

type Branch = {
    _id: string;
    code: string;
    name: string;
    address: string;
    phone: string;
};

const BranchCard: React.FC<{ branch: Branch }> = ({ branch }) => {
    const { theme } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Branch: ${branch.name}\nCode: ${branch.code}\nAddress: ${branch.address}\nPhone: ${branch.phone}`,
            });
        } catch (error) {
            console.error("Error sharing branch details:", error);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
                navigation.navigate("BranchesDetails", { branchId: branch._id })
            }
        >
            <SectionCard
                style={{
                    marginHorizontal: 8,
                    marginVertical: 6,
                    marginBottom: 0,
                }}
            >
                {/* Branch Name & Share Icon */}
                <View
                    style={[
                        styles.row,
                        { justifyContent: "space-between", alignItems: "center" },
                    ]}
                >
                    <View style={styles.row}>
                        <View
                            style={[
                                styles.iconBackground,
                                { backgroundColor: theme.colors.brandColor + "20" },
                            ]}
                        >
                            <Ionicons
                                name="home-outline"
                                size={18}
                                color={theme.colors.brandColor}
                            />
                        </View>
                        <Text
                            style={[styles.cardTitle, { color: theme.colors.brandColor }]}
                        >
                            {branch.name}
                        </Text>
                    </View>

                    {/* Prevent navigation when pressing share */}
                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            handleShare();
                        }}
                    >
                        <Entypo
                            name="share"
                            size={22}
                            color={theme.colors.brandColor}
                        />
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View
                    style={{
                        height: 1,
                        backgroundColor: theme.colors.border,
                        marginVertical: 10,
                    }}
                />

                {/* Code */}
                <View style={styles.infoColumn}>
                    <View
                        style={[
                            styles.iconBackground,
                            { backgroundColor: theme.colors.brandColor + "20", width: 36, height: 36 },
                        ]}
                    >
                        <Feather name="hash" size={18} color={theme.colors.brandColor} />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text
                            style={[
                                styles.cardText,
                                { fontSize: 12, color: theme.colors.secondaryText },
                            ]}
                        >
                            Code
                        </Text>
                        <Text style={[styles.cardText, { color: theme.colors.text }]}>
                            {branch.code}
                        </Text>
                    </View>
                </View>

                {/* Address */}
                <View style={styles.infoColumn}>
                    <View
                        style={[
                            styles.iconBackground,
                            { backgroundColor: theme.colors.brandColor + "20", width: 36, height: 36 },
                        ]}
                    >
                        <Ionicons
                            name="location-outline"
                            size={18}
                            color={theme.colors.brandColor}
                        />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text
                            style={[
                                styles.cardText,
                                { fontSize: 12, color: theme.colors.secondaryText },
                            ]}
                        >
                            Address
                        </Text>
                        <Text style={[styles.cardText, { color: theme.colors.text }]}>
                            {branch.address}
                        </Text>
                    </View>
                </View>

                {/* Phone */}
                <View style={styles.infoColumn}>
                    <View
                        style={[
                            styles.iconBackground,
                            { backgroundColor: theme.colors.brandColor + "20", width: 36, height: 36 },
                        ]}
                    >
                        <Ionicons
                            name="call-outline"
                            size={18}
                            color={theme.colors.brandColor}
                        />
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text
                            style={[
                                styles.cardText,
                                { fontSize: 12, color: theme.colors.secondaryText },
                            ]}
                        >
                            Phone
                        </Text>
                        <Text style={[styles.cardText, { color: theme.colors.text }]}>
                            {branch.phone}
                        </Text>
                    </View>
                </View>
            </SectionCard>
        </TouchableOpacity>
    );
};

const OurBranches: React.FC = () => {
    const { theme } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const brandColor = theme.colors.brandColor || "#000";
    const [searchText, setSearchText] = useState("");
    const [active, setActive] = useState(false);

    const { data: branchList = [], refetch, isFetching } = useGetBranchListQuery({
        search: searchText,
    });

    //Refresh Handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    const handleSearchPress = () => {
        refetch();
        Keyboard.dismiss();
    };

    const screenWidth = Dimensions.get("window").width;

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Search Box */}
            <View
                style={{
                    width: screenWidth - 16,
                    alignSelf: "center",
                    marginTop: 20,
                    marginBottom: 8,
                }}
            >
                <View
                    style={[
                        styles.searchContainer,
                        {
                            backgroundColor: theme.colors.cardBackground,
                            borderColor: active ? brandColor : theme.colors.border,
                        },
                    ]}
                >
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.text }]}
                        placeholder="Search branch by name, code, address..."
                        placeholderTextColor={theme.colors.secondaryText}
                        value={searchText}
                        onChangeText={setSearchText}
                        onFocus={() => setActive(true)}
                        onBlur={() => setActive(false)}
                        onSubmitEditing={handleSearchPress}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity
                            style={[styles.clearButton, { backgroundColor: "#ccc" }]}
                            onPress={() => setSearchText("")}
                        >
                            <Ionicons name="close" size={18} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.searchIconContainer, { backgroundColor: brandColor }]}
                        onPress={handleSearchPress}
                    >
                        <Ionicons name="search" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Branch List */}
            {isFetching ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <LoadingIndicator size={80} color={theme.colors.brandColor} />
                </View>
            ) : branchList.length === 0 ? (
                <Text style={{ color: theme.colors.text, textAlign: "center", marginTop: 20 }}>
                    No branches found.
                </Text>
            ) : (
                <FlatList
                    data={branchList}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <BranchCard branch={item} />}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.colors.brandColor}
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        borderWidth: 1,
        overflow: "hidden",
    },
    searchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 12,
        fontSize: 14,
    },
    searchIconContainer: {
        width: 50,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginLeft: 8,
    },
    clearButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    cardTitle: {
        fontFamily: "Montserrat-Bold",
        fontSize: 16,
        marginBottom: 6,
    },
    cardText: {
        fontFamily: "Montserrat-Regular",
        fontSize: 13,
        marginBottom: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    iconBackground: {
        width: 24,
        height: 24,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    infoColumn: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
    },
});

export default OurBranches;
