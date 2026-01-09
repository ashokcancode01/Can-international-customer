import React, { forwardRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Controller } from "react-hook-form";
import { AntDesign, FontAwesome5, Ionicons } from "@expo/vector-icons";
import ThemedText from "@/components/themed/ThemedText";
import { ThemedIcon } from "@/components/themed/ThemedIcon";
import { useTheme } from "@/theme/ThemeProvider";
import { useDeleteFromDoSpaceMutation } from "@/store/slices/doSpace";

export interface FileData {
  name: string;
  uri?: string;
  url?: string;
  type: string;
  size?: number;
  publicId?: string;
  isExisting?: boolean;
}

interface CustomFilePickerProps {
  label?: string;
  labelStyle?: TextStyle;
  control: any;
  name: string;
  rules?: any;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  errorStyle?: TextStyle;
  existingFiles?: FileData[];
  setExistingFiles?: (files: FileData[]) => void;
  selectedFiles?: FileData[];
  setSelectedFiles?: (files: FileData[]) => void;
  allowMultiple?: boolean;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  placeholder?: string;
  images?: boolean;
  deleteFromDoSpace?: boolean;
}

const CustomFilePicker = forwardRef<View, CustomFilePickerProps>(
  (
    {
      label,
      labelStyle,
      control,
      name,
      rules,
      containerStyle,
      inputContainerStyle,
      errorStyle,
      existingFiles = [],
      setExistingFiles,
      selectedFiles = [],
      setSelectedFiles,
      allowMultiple = false,
      maxFileSize = 5,
      acceptedFileTypes,
      placeholder = "Click to attach files",
      images = false,
      deleteFromDoSpace = false,
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteFromDoSpace_] = useDeleteFromDoSpaceMutation();

    const formatFileSize = (bytes: number = 0): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const isImageFile = (file: FileData) => {
      return (
        file.type?.startsWith("image/") ||
        file.name?.match(/\.(jpeg|jpg|gif|png)$/i) ||
        file.uri?.match(/\.(jpeg|jpg|gif|png)$/i) ||
        file.url?.match(/\.(jpeg|jpg|gif|png)$/i)
      );
    };

    const getFileIcon = (file: FileData) => {
      if (isImageFile(file)) return "image";
      if (file.type?.includes("pdf") || file.name?.endsWith(".pdf"))
        return "file-pdf";
      if (file.type?.includes("word") || file.name?.match(/\.(doc|docx)$/i))
        return "file-word";
      if (file.type?.includes("excel") || file.name?.match(/\.(xls|xlsx)$/i))
        return "file-excel";
      if (file.type?.includes("video")) return "file-video";
      if (file.type?.includes("audio")) return "file-audio";
      return "file-alt";
    };

    const handleDeleteFromDoSpace = async (publicId: string) => {
      try {
        await deleteFromDoSpace_({ publicId });
      } catch (error) {
        console.error("Error deleting from DO Space:", error);
      }
    };

    const removeFile = async (
      fileToRemove: FileData,
      allFiles: FileData[],
      onChange: (value: any) => void
    ) => {
      if (
        deleteFromDoSpace &&
        fileToRemove.isExisting &&
        fileToRemove.publicId
      ) {
        Alert.alert(
          "Confirm Deletion",
          "Are you sure you want to delete this file?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              onPress: async () => {
                await handleDeleteFromDoSpace(fileToRemove.publicId!);
                const updatedFiles = allFiles.filter((f) => f !== fileToRemove);
                onChange(updatedFiles.length > 0 ? updatedFiles : null);

                if (fileToRemove.isExisting && setExistingFiles) {
                  setExistingFiles(
                    existingFiles.filter((f) => f !== fileToRemove)
                  );
                } else if (!fileToRemove.isExisting && setSelectedFiles) {
                  setSelectedFiles(
                    selectedFiles.filter((f) => f !== fileToRemove)
                  );
                }
              },
            },
          ]
        );
      } else {
        const updatedFiles = allFiles.filter(
          (f) => f.publicId !== fileToRemove.publicId
        );
        onChange(updatedFiles.length > 0 ? updatedFiles : null);

        if (fileToRemove.isExisting && setExistingFiles) {
          setExistingFiles(
            existingFiles.filter((f) => f.publicId !== fileToRemove.publicId)
          );
        } else if (!fileToRemove.isExisting && setSelectedFiles) {
          setSelectedFiles(
            selectedFiles.filter((f) => f.publicId !== fileToRemove.publicId)
          );
        }
      }
    };

    const handleFilePicker = async (
      onChange: (value: any) => void,
      currentFiles: FileData[]
    ) => {
      try {
        setIsLoading(true);
        const result = await DocumentPicker.getDocumentAsync({
          multiple: allowMultiple,
          type: images ? ["image/*"] : acceptedFileTypes || "*/*",
        });

        if (!result.canceled && result.assets) {
          const validFiles = result.assets.filter((asset) => {
            const fileSizeInMB = (asset.size || 0) / (1024 * 1024);
            return fileSizeInMB <= maxFileSize;
          });

          if (validFiles.length !== result.assets.length) {
            Alert.alert(
              "File Size Error",
              `Some files exceed the maximum size limit of ${maxFileSize}MB and were not added.`
            );
          }

          const newFiles: FileData[] = validFiles.map((item: any) => ({
            uri: item.uri,
            name: item.name,
            type: item.mimeType ?? "",
            size: item.size || 0,
            isExisting: false,
          }));

          const filteredFiles = images
            ? newFiles.filter((file) => isImageFile(file))
            : newFiles;

          const updatedFiles = allowMultiple
            ? [...currentFiles, ...filteredFiles]
            : [...filteredFiles];

          onChange(updatedFiles.length > 0 ? updatedFiles : null);

          if (setSelectedFiles) {
            const newSelectedFiles = allowMultiple
              ? [...selectedFiles, ...filteredFiles]
              : [...filteredFiles];
            setSelectedFiles(newSelectedFiles);
          }
        }
      } catch (error) {
        console.error("File picker error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const renderFile = (
      file: FileData,
      index: number,
      allFiles: FileData[],
      onChange: (value: any) => void
    ) => {
      const fileSource = file.uri || file.url || "";
      const fileName =
        file.name || fileSource.split("/").pop() || "Unknown file";
      const iconName = getFileIcon(file);

      return (
        <View key={`${file.name}-${index}`} style={styles.fileItem}>
          <View style={styles.fileHeader}>
            <ThemedIcon
              as={FontAwesome5}
              name={iconName}
              type="small"
              style={styles.fileIcon}
            />

            <View style={styles.fileInfo}>
              <ThemedText
                type="default"
                style={styles.fileName}
                numberOfLines={1}
              >
                {fileName}
              </ThemedText>
              {file.size && (
                <ThemedText type="default" style={styles.fileSize}>
                  {formatFileSize(file.size)}
                </ThemedText>
              )}
            </View>
            <TouchableOpacity
              onPress={() => removeFile(file, allFiles, onChange)}
              style={styles.removeButton}
            >
              <ThemedIcon as={AntDesign} name="close" type="small" />
            </TouchableOpacity>
          </View>

          {isImageFile(file) && fileSource && (
            <Image
              source={{ uri: fileSource }}
              style={styles.imagePreview}
              resizeMode="cover"
            />
          )}
        </View>
      );
    };

    const renderFilesSection = (
      files: FileData[],
      sectionTitle: string,
      allFiles: FileData[],
      onChange: (value: any) => void
    ) => {
      if (files.length === 0) return null;

      return (
        <View style={styles.fileSection}>
          <ThemedText type="default" style={styles.sectionTitle}>
            {sectionTitle} ({files.length})
          </ThemedText>
          <View style={styles.filesContainer}>
            {files.map((file, index) =>
              renderFile(file, index, allFiles, onChange)
            )}
          </View>
        </View>
      );
    };

    return (
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const currentFiles = React.useMemo(() => {
            const allFiles = value || [];
            return allFiles.map((file: FileData) => ({
              ...file,
              isExisting:
                file.isExisting ??
                (existingFiles.some(
                  (ef) =>
                    ef.publicId === file.publicId ||
                    ef.uri === file.uri ||
                    ef.url === file.url
                ) ||
                  Boolean(file.publicId)),
            }));
          }, [value, existingFiles]);

          const existingFilesInCurrent = currentFiles.filter(
            (file: any) => file.isExisting
          );
          const newFilesInCurrent = currentFiles.filter(
            (file: any) => !file.isExisting
          );

          useEffect(() => {
            if (!value && existingFiles.length > 0) {
              const initialFiles = existingFiles.map((file) => ({
                ...file,
                isExisting: true,
              }));
              onChange(initialFiles);
            }
          }, [existingFiles, value, onChange]);

          const getPlaceholderText = () => {
            if (currentFiles.length === 0) {
              return images ? "Click here to select images" : placeholder;
            }

            const fileText = currentFiles.length === 1 ? "file" : "files";
            return `${currentFiles.length} ${fileText} selected - Click to add more`;
          };

          return (
            <View style={[styles.container, containerStyle]}>
              {label && (
                <ThemedText type="label" style={[styles.label, labelStyle]}>
                  {label}
                </ThemedText>
              )}

              <TouchableOpacity
                onPress={() => handleFilePicker(onChange, currentFiles)}
                disabled={isLoading}
                style={[
                  styles.inputContainer,
                  {
                    borderColor: error
                      ? theme.colors.error
                      : theme.colors.border,
                    backgroundColor: theme.colors.card,
                  },
                  currentFiles.length === 0 && styles.emptyContainer,
                  inputContainerStyle,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                  />
                ) : (
                  <>
                    <ThemedIcon
                      as={AntDesign}
                      name="upload"
                      type="small"
                      style={styles.uploadIcon}
                    />
                    <ThemedText
                      type="default"
                      style={[
                        styles.placeholderText,
                        {
                          color:
                            currentFiles.length === 0
                              ? theme.colors.placeholder
                              : theme.colors.text,
                          marginLeft: 10,
                        },
                      ]}
                    >
                      {getPlaceholderText()}
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>

              {allowMultiple && (
                <ThemedText type="text" style={styles.infoText}>
                  Max size: {maxFileSize}MB per file
                  {images && " • Images only"}
                  {acceptedFileTypes &&
                    ` • Accepted: ${acceptedFileTypes.join(", ")}`}
                </ThemedText>
              )}

              {currentFiles.length > 0 && (
                <View style={styles.allFilesContainer}>
                  {renderFilesSection(
                    newFilesInCurrent,
                    "Selected Files",
                    currentFiles,
                    onChange
                  )}
                  {renderFilesSection(
                    existingFilesInCurrent,
                    "Existing Files",
                    currentFiles,
                    onChange
                  )}
                </View>
              )}

              {error && (
                <View style={styles.errorContainer}>
                  {/* <ThemedIcon
                    as={Ionicons}
                    name="alert-circle"
                    type="small"
                    style={styles.errorIcon}
                  /> */}
                  <ThemedText
                    type="errorText"
                    style={[styles.errorText, errorStyle]}
                  >
                    {error.message}
                  </ThemedText>
                </View>
              )}
            </View>
          );
        }}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 30,
  },
  emptyContainer: {
    borderStyle: "dashed",
  },
  uploadIcon: {
    marginRight: 12,
    opacity: 0.7,
  },
  placeholderText: {
    flex: 1,
  },
  infoText: {
    fontSize: 9,
    opacity: 0.6,
    marginTop: 4,
  },
  allFilesContainer: {
    marginTop: 12,
  },
  fileSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  filesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fileItem: {
    width: "48%",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    maxHeight: 100,
  },
  fileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  fileIcon: {
    marginRight: 8,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 9,
    fontWeight: "500",
    marginLeft: 5,
  },
  existingLabel: {
    fontSize: 10,
    opacity: 0.6,
    fontStyle: "italic",
  },
  fileSize: {
    fontSize: 8,
    opacity: 0.6,
    marginTop: 1,
    marginLeft: 5,
  },
  removeButton: {
    padding: 4,
  },
  imagePreview: {
    width: "100%",
    height: 60,
    borderRadius: 4,
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorIcon: {
    marginRight: 6,
    marginTop: 14,
  },
  errorText: {
    fontSize: 10,
  },
});

export default CustomFilePicker;
