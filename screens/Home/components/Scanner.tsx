import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import {
  StyleSheet,
  View,
  Dimensions,
  Modal,
  Image,
  Platform,
  Animated,
} from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { ThemedView } from "@/components/themed/ThemedView";
import { ThemedTouchableOpacity } from "@/components/themed/ThemedTouchableOpacity";
import ThemedText from "@/components/themed/ThemedText";
import { useTheme } from "../../../theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const SCAN_BOX_SIZE = width * 0.65;

export default function ScannerScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(true);

  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cornerAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Scanning line animation
  useEffect(() => {
    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    scanAnimation.start();
    return () => scanAnimation.stop();
  }, []);

  // Corner pulse animation
  useEffect(() => {
    const cornerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(cornerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    cornerAnimation.start();
    return () => cornerAnimation.stop();
  }, []);

  // Icon pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

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

      const results = await Camera.scanFromURLAsync(uri, [
        "qr",
        "ean13",
        "code128",
      ]);

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

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_BOX_SIZE - 4],
  });

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

      {/* Top gradient overlay */}
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        style={styles.topGradient}
      />

      {/* Header Section */}
      <View style={styles.header}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.brandColor + "20" },
            ]}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={32}
              color={theme.colors.brandColor}
            />
          </View>
        </Animated.View>
        <ThemedText style={styles.headerTitle}>Scan QR Code</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Position the QR code within the frame to track your shipment
        </ThemedText>
      </View>

      {/* Gallery button */}
      <ThemedTouchableOpacity
        style={[
          styles.galleryButton,
          { backgroundColor: "rgba(255,255,255,0.15)" },
        ]}
        onPress={pickImageFromGallery}
      >
        <MaterialIcons name="photo-library" size={24} color="#fff" />
        <ThemedText style={styles.galleryText}>Gallery</ThemedText>
      </ThemedTouchableOpacity>

      {/* Overlay scan box */}
      <View style={styles.overlay}>
        <View style={styles.scanBoxContainer}>
          {/* Animated corners */}
          <Animated.View
            style={[
              styles.corner,
              styles.topLeft,
              { borderColor: theme.colors.brandColor },
              { transform: [{ scale: cornerAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.corner,
              styles.topRight,
              { borderColor: theme.colors.brandColor },
              { transform: [{ scale: cornerAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.corner,
              styles.bottomLeft,
              { borderColor: theme.colors.brandColor },
              { transform: [{ scale: cornerAnim }] },
            ]}
          />
          <Animated.View
            style={[
              styles.corner,
              styles.bottomRight,
              { borderColor: theme.colors.brandColor },
              { transform: [{ scale: cornerAnim }] },
            ]}
          />

          {/* Scan box */}
          <View style={styles.scanBox}>
            {pickedImage && (
              <Image source={{ uri: pickedImage }} style={styles.pickedImage} />
            )}
            {!pickedImage && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    backgroundColor: theme.colors.brandColor,
                    transform: [{ translateY: scanLineTranslateY }],
                  },
                ]}
              />
            )}
          </View>
        </View>

        {/* Instruction card */}
        <View style={styles.instructionCard}>
          <View style={styles.instructionRow}>
            <View
              style={[
                styles.instructionIcon,
                { backgroundColor: theme.colors.brandColor + "20" },
              ]}
            >
              <MaterialIcons
                name="center-focus-strong"
                size={20}
                color={theme.colors.brandColor}
              />
            </View>
            <ThemedText style={styles.instructionText}>
              Align QR code within the frame
            </ThemedText>
          </View>
          <View style={styles.instructionRow}>
            <View
              style={[
                styles.instructionIcon,
                { backgroundColor: theme.colors.brandColor + "20" },
              ]}
            >
              <MaterialIcons
                name="lightbulb-outline"
                size={20}
                color={theme.colors.brandColor}
              />
            </View>
            <ThemedText style={styles.instructionText}>
              Ensure good lighting for best results
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.bottomGradient}
      />

      {/* Camera Permission Modal */}
      <Modal
        visible={showPermissionModal && !permission.granted}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.permissionCard}>
            <View
              style={[
                styles.modalIconContainer,
                { backgroundColor: theme.colors.brandColor + "20" },
              ]}
            >
              <MaterialIcons
                name="camera-alt"
                size={48}
                color={theme.colors.brandColor}
              />
            </View>
            <ThemedText
              style={[styles.permissionTitle, { color: theme.colors.text }]}
            >
              Camera Access Required
            </ThemedText>
            <ThemedText
              style={[
                styles.permissionSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              We need access to your camera to scan QR codes and track your
              shipments
            </ThemedText>
            <ThemedTouchableOpacity
              style={[
                styles.permissionButton,
                { backgroundColor: theme.colors.brandColor },
              ]}
              onPress={async () => {
                const result = await requestPermission();
                if (result.granted) setShowPermissionModal(false);
              }}
            >
              <ThemedText style={styles.permissionButtonText}>
                Allow Camera Access
              </ThemedText>
            </ThemedTouchableOpacity>
            <ThemedTouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPermissionModal(false)}
            >
              <ThemedText
                style={[
                  styles.cancelButtonText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Maybe Later
              </ThemedText>
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
            <View
              style={[
                styles.modalIconContainer,
                { backgroundColor: theme.colors.brandColor + "20" },
              ]}
            >
              <MaterialIcons
                name="photo-library"
                size={48}
                color={theme.colors.brandColor}
              />
            </View>
            <ThemedText
              style={[styles.permissionTitle, { color: theme.colors.text }]}
            >
              Gallery Access Required
            </ThemedText>
            <ThemedText
              style={[
                styles.permissionSubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              Allow access to your photo library to scan QR codes from existing
              images
            </ThemedText>
            <ThemedTouchableOpacity
              style={[
                styles.permissionButton,
                { backgroundColor: theme.colors.brandColor },
              ]}
              onPress={async () => {
                const { status } =
                  await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status === "granted") setShowGalleryModal(false);
              }}
            >
              <ThemedText style={styles.permissionButtonText}>
                Allow Gallery Access
              </ThemedText>
            </ThemedTouchableOpacity>
            <ThemedTouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowGalleryModal(false)}
            >
              <ThemedText
                style={[
                  styles.cancelButtonText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Maybe Later
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
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
  },
  galleryButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  galleryText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Montserrat-SemiBold",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  scanBoxContainer: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    position: "relative",
  },
  scanBox: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  corner: {
    position: "absolute",
    width: 44,
    height: 44,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    height: 2,
    width: "100%",
    opacity: 0.8,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  pickedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  instructionCard: {
    marginTop: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 10,
    width: width * 0.85,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  instructionIcon: {
    width: 32,
    height: 32,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  instructionText: {
    fontSize: 12,
    fontFamily: "Montserrat-Medium",
    color: "#fff",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  permissionCard: {
    width: "85%",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  permissionTitle: {
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    marginBottom: 10,
    color: "#000",
    textAlign: "center",
  },
  permissionSubtitle: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  permissionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    marginBottom: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Montserrat-Bold",
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 12,
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
  },
});
