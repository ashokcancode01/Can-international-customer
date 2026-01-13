import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { StyleSheet, View, Dimensions, Modal, Image, Platform } from "react-native";
import { useState, useEffect, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
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
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setPickedImage(null);
      setScanned(false);
      if (Platform.OS === "android") {
        const timeout = setTimeout(() => setShowCamera(true), 100);
        return () => clearTimeout(timeout);
      }
    }, [])
  );

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
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
    setTimeout(() => setScanned(false), 1000);
  };

  const handlePickedImage = async (uri: string) => {
    try {
      setPickedImage(uri);
      setShowCamera(false);

      // Use Expo Camera API to scan QR/barcode from image
      const results = await Camera.scanFromURLAsync(uri, ["qr", "ean13", "code128"]);

      if (results.length > 0) {
        const qrData = results[0].data;
        navigation.navigate("ScannedOrderDetails", { orderId: qrData });
      } else {
        alert("No QR code found in this image");
      }
    } catch (error) {
      console.log("QR scan error:", error);
      alert("Could not scan QR code from this image");
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setShowGalleryModal(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets.length > 0) {
      handlePickedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera */}
      {showCamera && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "code128"] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      )}

      {/* Gallery icon */}
      <ThemedTouchableOpacity
        style={styles.galleryIcon}
        onPress={pickImageFromGallery}
      >
        <MaterialIcons
          name="insert-photo"
          size={25}
          color={theme.colors.brandColor}
        />
      </ThemedTouchableOpacity>

      <ThemedText style={[styles.scanLabel]}>
        Align QR code to view order details
      </ThemedText>

      {/* Overlay scan box */}
      <View style={styles.overlay}>
        <View
          style={[styles.scanBox, { borderColor: theme.colors.brandColor, marginBottom: 20 }]}
        >
          {pickedImage && (
            <Image
              source={{ uri: pickedImage }}
              style={{ width: "100%", height: "100%", borderRadius: 16, resizeMode: "cover" }}
            />
          )}
        </View>
      </View>

      {/* Camera Permission Modal */}
      <Modal
        visible={showPermissionModal && !permission.granted}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.permissionCard}>
            <ThemedText style={[styles.permissionTitle, { fontFamily: "Montserrat-bold", color: theme.colors.text }]}>
              Camera Access Required
            </ThemedText>
            <ThemedText style={[styles.permissionSubtitle, { fontFamily: "Montserrat-Regular", color: theme.colors.textSecondary }]}>
              Please allow camera access to scan QR codes.
            </ThemedText>
            <ThemedTouchableOpacity
              style={[styles.permissionButton, { backgroundColor: theme.colors.brandColor }]}
              onPress={async () => {
                const result = await requestPermission();
                if (result.granted) setShowPermissionModal(false);
              }}
            >
              <ThemedText style={styles.permissionButtonText}>Allow Camera</ThemedText>
            </ThemedTouchableOpacity>
          </ThemedView>
        </View>
      </Modal>

      {/* Gallery Permission Modal */}
      <Modal
        visible={showGalleryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGalleryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.permissionCard}>
            <ThemedText style={[styles.permissionTitle, { color: theme.colors.text }]}>
              Gallery Access Required
            </ThemedText>
            <ThemedText style={[styles.permissionSubtitle, { color: theme.colors.textSecondary }]}>
              Please allow gallery access to select images.
            </ThemedText>
            <ThemedTouchableOpacity
              style={[styles.permissionButton, { backgroundColor: theme.colors.brandColor }]}
              onPress={async () => {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status === "granted") setShowGalleryModal(false);
              }}
            >
              <ThemedText style={styles.permissionButtonText}>Allow Gallery</ThemedText>
            </ThemedTouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  galleryIcon: { position: "absolute", top: 50, right: 20, zIndex: 10, borderRadius: 24, padding: 5 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  permissionCard: { width: "80%", padding: 24, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  permissionTitle: { fontSize: 16, fontFamily: "Montserrat-Bold", marginBottom: 12, color: "#000", textAlign: "center" },
  permissionSubtitle: { fontSize: 12, textAlign: "center", marginBottom: 20 },
  permissionButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  permissionButtonText: { color: "#fff", fontFamily: "Montserrat-Bold", textAlign: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  scanBox: { width: SCAN_BOX_SIZE, height: SCAN_BOX_SIZE, borderRadius: 16, borderWidth: 2, backgroundColor: "transparent" },
  instructionContainer: { position: "absolute", bottom: 120, alignSelf: "center", marginBottom: 20 },
  scanLabel: { position: "absolute", top: 140, alignSelf: "center", fontSize: 14, textAlign: "center", color: "#fff", zIndex: 10 },
});