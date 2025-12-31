import React, { useMemo } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { useTheme } from "@/theme/ThemeProvider";
import { Branch } from "@/store/slices/branches";

interface BranchMapViewProps {
  branch: Branch;
}

const BranchMapView: React.FC<BranchMapViewProps> = ({ branch }) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  // Extract coordinates safely
  const coordinates = branch?.coordinates;

  // Generate map HTML
  const mapHTML = useMemo(() => {
    if (!coordinates?.lat || !coordinates?.long) return ""; 

    const lat = coordinates.lat;
    const lng = coordinates.long;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <style>
          html, body, #map { margin:0; padding:0; height:100%; width:100%; }
          .marker-pin {
            width:30px;
            height:30px;
            border-radius:50% 50% 50% 0;
            background: ${colors.brandColor};
            position:absolute;
            transform: rotate(-45deg);
            left:50%;
            top:50%;
            margin:-15px 0 0 -15px;
          }
          .marker-pin::after {
            content:'';
            width:14px;
            height:14px;
            margin:8px 0 0 8px;
            background:#fff;
            position:absolute;
            border-radius:50%;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([${lat}, ${lng}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          var customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div class="marker-pin"></div>',
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -42]
          });

          L.marker([${lat}, ${lng}], { icon: customIcon }).addTo(map)
            .bindPopup("<b>${branch.name || "Branch"}</b><br>${branch.address || ""}");
        </script>
      </body>
      </html>
    `;
  }, [coordinates?.lat, coordinates?.long, branch.name, branch.address, colors.brandColor]);

  if (!coordinates?.lat || !coordinates?.long) return null;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: mapHTML }}
        style={styles.map}
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300, 
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    flex: 1,
    width: Dimensions.get("window").width - 32,
  },
});

export default BranchMapView;
