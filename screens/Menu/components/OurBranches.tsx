import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Keyboard,
    FlatList,
    Text,
    ScrollView,
    Dimensions,
} from "react-native";
import ThemedKeyboardView from "@/components/themed/ThemedKeyboardView";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme/ThemeProvider";
import { useGetBranchListQuery } from "@/store/slices/branches";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";

type Branch = {
    code: string;
    branch: string;
    address: string;
    phone: string;
};

const TableHeader: React.FC<{ brandColor: string; headerTextColor: string }> = ({
    brandColor,
    headerTextColor,
}) => (
    <View style={[styles.tableHeader, { backgroundColor: brandColor }]}>
        <Text style={[styles.headerCell, { width: 90, color: headerTextColor }]} numberOfLines={1}>
            Code
        </Text>
        <Text style={[styles.headerCell, { width: 150, color: headerTextColor }]} numberOfLines={1}>
            Branch
        </Text>
        <Text style={[styles.headerCell, { width: 220, color: headerTextColor }]} numberOfLines={1}>
            Address
        </Text>
        <Text style={[styles.headerCell, { width: 140, color: headerTextColor }]} numberOfLines={1}>
            Phone
        </Text>
    </View>
);

const TableRow: React.FC<{ branch: Branch; index: number }> = ({ branch, index }) => {
    const { theme } = useTheme();
    const backgroundColor = index % 2 === 0 ? theme.colors.cardBackground : theme.colors.cardBackground;

    return (
        <ThemedTouchableOpacity>
            <View style={[styles.row, { backgroundColor }]}>
                <Text
                    style={[styles.cell, { width: 90, textAlign: "center", color: theme.colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {branch.code}
                </Text>
                <Text
                    style={[styles.cell, { width: 150, textAlign: "center", color: theme.colors.brandColor }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {branch.branch}
                </Text>
                <Text
                    style={[styles.cell, { width: 220, textAlign: "center", color: theme.colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {branch.address}
                </Text>
                <Text
                    style={[styles.cell, { width: 140, textAlign: "center", color: theme.colors.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {branch.phone}
                </Text>
            </View>
        </ThemedTouchableOpacity>
    );
};

const OurBranches: React.FC = () => {
    const { theme } = useTheme();
    const brandColor = theme.colors.brandColor || "#000";
    const headerTextColor = theme.dark ? "#fff" : "#fff";

    const [searchText, setSearchText] = useState("");
    const [active, setActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, refetch } = useGetBranchListQuery({
        page: currentPage,
        search: searchText,
    });

    const branchList: Branch[] = data?.data?.map((item: any) => ({
        code: item.code || "",
        branch: item.name || "",
        address: item.address || "",
        phone: item.phone || "",
    })) ?? [];

    const totalPages = data?.pagination?.totalPages ?? 1;

    const handleSearchPress = () => {
        setCurrentPage(1);
        refetch();
        Keyboard.dismiss();
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        refetch();
    }, [currentPage, refetch]);

    const screenWidth = Dimensions.get("window").width;

    return (
        <ThemedKeyboardView
            centerContent={false}
            style={{ paddingTop: 20, backgroundColor: theme.colors.background }}
            scrollEnabled={true}
        >

            {/* Search Box */}
            <View
                style={{
                    width: screenWidth - 16, 
                    alignSelf: "center",
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
                    <TouchableOpacity
                        style={[styles.searchIconContainer, { backgroundColor: brandColor }]}
                        onPress={handleSearchPress}
                    >
                        <Ionicons name="search" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>


            {/* Table */}
            <View
                style={{
                    width: screenWidth - 16,
                    alignSelf: "center",
                    backgroundColor: theme.colors.cardBackground,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    borderRadius: 16,
                    overflow: "hidden",
                }}
            >
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={{ minWidth: 600 }}>
                        <FlatList
                            data={branchList}
                            keyExtractor={(item) => item.code}
                            ListHeaderComponent={<TableHeader brandColor={brandColor} headerTextColor={headerTextColor} />}
                            renderItem={({ item, index }) => <TableRow branch={item} index={index} />}
                            scrollEnabled={false}
                        />
                    </View>
                </ScrollView>

                {/* Pagination */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingVertical: 8,
                        gap: 10,
                    }}
                >
                    <TouchableOpacity
                        onPress={handlePrev}
                        disabled={currentPage === 1}
                        style={{
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 8,
                            backgroundColor: brandColor,
                            opacity: currentPage === 1 ? 0.5 : 1,
                        }}
                    >
                        <Text style={{ color: "#fff", fontFamily: "Montserrat-Bold" }}>Previous</Text>
                    </TouchableOpacity>

                    <Text style={{ fontFamily: "Montserrat-Medium", fontSize: 14, color: theme.colors.text }}>
                        Page {currentPage} of {totalPages}
                    </Text>

                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={currentPage === totalPages}
                        style={{
                            paddingHorizontal: 14,
                            paddingVertical: 6,
                            borderRadius: 8,
                            backgroundColor: brandColor,
                            opacity: currentPage === totalPages ? 0.5 : 1,
                        }}
                    >
                        <Text style={{ color: "#fff", fontFamily: "Montserrat-Bold" }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ThemedKeyboardView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontFamily: "Montserrat-Bold",
        marginBottom: 12,
        textAlign: "center",
    },
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
    tableHeader: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e5e5e5",
    },
    cell: {
        textAlign: "left",
        paddingHorizontal: 6,
        fontFamily: "Montserrat-Regular",
        fontSize: 13,
    },
    headerCell: {
        fontWeight: "bold",
        fontFamily: "Montserrat-Bold",
        textAlign: "center",
        fontSize: 14,
    },
});

export default OurBranches;
