import { CameraView, useCameraPermissions } from "expo-camera";
import { StyleSheet, View, Dimensions, Modal } from "react-native";
import { useState, useEffect } from "react";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "../../../theme/ThemeProvider";

const { width } = Dimensions.get("window");
const SCAN_BOX_SIZE = width * 0.7;

export default function ScannerScreen({ navigation }: any) {
    const { theme } = useTheme();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    useEffect(() => {
        if(permission && !permission.granted && permission.canAskAgain) {
            setShowPermissionModal(true);
        } else if (permission && permission.granted) {
            setShowPermissionModal(false);
        }
    }, [permission]);

    if (!permission) return null;

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);
        navigation.navigate("ScannedOrderDetails", { orderId: data });

        setTimeout(() => {
            setScanned(false);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            {/* Camera */}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={handleBarcodeScanned}
            />

            {/* Overlay scan box */}
            <View style={styles.overlay}>
                <View
                    style={[styles.scanBox, { borderColor: theme.colors.brandColor, marginBottom: 20 }]}
                />
            </View>

            {/* Instructions */}
            <View style={styles.instructionContainer}>
                <ThemedText style={styles.instructionText}>
                    Align the QR code within the frame
                </ThemedText>
            </View>

            {/* Permission Modal */}
            <Modal
                visible={showPermissionModal && !permission.granted}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPermissionModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <ThemedView style={styles.permissionCard}>
                        <ThemedText style={[styles.permissionTitle, {fontFamily: "Montserrat-bold", color:theme.colors.text}]}>
                            Camera Access Required
                        </ThemedText>
                        <ThemedText style={[styles.permissionSubtitle, {fontFamily: "Montserrat-Regular", color:theme.colors.textSecondary}]}>
                            Please allow camera access to scan QR codes.
                        </ThemedText>

                        <ThemedTouchableOpacity
                            style={[styles.permissionButton, { backgroundColor: theme.colors.brandColor}]}
                            onPress={async () => {
                                const result = await requestPermission();
                                if(result.granted) {
                                    setShowPermissionModal(false);
                                }
                            }}
                        >
                            <ThemedText style={styles.permissionButtonText}>
                                Allow Camera
                            </ThemedText>
                        </ThemedTouchableOpacity>
                    </ThemedView>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    permissionCard: {
        width: "80%",
        padding: 24,
        borderRadius: 16,
        backgroundColor: "#fff", 
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, 
    },
    permissionTitle: {
        fontSize: 16,
        fontFamily: "Montserrat-Bold",
        marginBottom: 12,
        color: "#000",
        textAlign: "center",
    },
    permissionSubtitle: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: 20,
    },
    permissionButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    permissionButtonText: {
        color: "#fff",
        fontFamily: "Montserrat-Bold",
        textAlign: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    scanBox: {
        width: SCAN_BOX_SIZE,
        height: SCAN_BOX_SIZE,
        borderRadius: 16,
        borderWidth: 2,
        backgroundColor: "transparent",
    },
    instructionContainer: {
        position: "absolute",
        bottom: 120,
        alignSelf: "center",
        marginBottom: 20,
    },
    instructionText: {
        color: "#fff",
        fontSize: 14,
        opacity: 0.85,
    },
});
