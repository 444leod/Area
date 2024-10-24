import React from "react";
import { View, ScrollView, StyleSheet, Dimensions, Alert } from "react-native";
import {
  Modal,
  Portal,
  Text,
  Button,
  useTheme,
  Surface,
  Switch,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { Area } from "@/types/";

interface AreaDetailsModalProps {
  visible: boolean;
  hideModal: () => void;
  area: Area | null;
  toggleAreaStatus: (areaId: string) => void;
  deleteArea: (areaId: string) => void;
}

const { width, height } = Dimensions.get("window");

export const AreaDetailsModal: React.FC<AreaDetailsModalProps> = ({
  visible,
  hideModal,
  area,
  deleteArea,
}) => {
  const theme = useTheme();

  if (!area) return null;

  const handleDeleteArea = () => {
    Alert.alert("Delete Area", "Are you sure you want to delete this area?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteArea(area._id);
          hideModal();
        },
      },
    ]);
  };

  const renderInformationSection = (
    title: string,
    informations: Record<string, any>,
    iconName: string,
  ) => (
    <Surface style={styles.section}>
      <View style={styles.sectionContent}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name={iconName}
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {Object.entries(informations).map(([key, value]) => (
          <View key={key} style={styles.infoRow}>
            <Text style={styles.infoKey}>{key}:</Text>
            <Text style={styles.infoValue}>{String(value)}</Text>
          </View>
        ))}
      </View>
    </Surface>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.contentContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Area Details</Text>
            </View>

            {renderInformationSection(
              "Action",
              area.action.informations,
              "lightning-bolt",
            )}
            <MaterialCommunityIcons
              name="arrow-down-bold"
              size={24}
              color={theme.colors.primary}
              style={styles.arrowIcon}
            />
            {renderInformationSection(
              "Reaction",
              area.reaction.informations,
              "arrow-right-bold",
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              icon="delete"
              onPress={handleDeleteArea}
              style={[styles.button, { backgroundColor: theme.colors.error }]}
            >
              Delete Area
            </Button>
            <Button
              mode="contained"
              icon="close"
              onPress={hideModal}
              style={styles.button}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 15,
    height: height * 0.8,
    width: width - 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    marginLeft: 8,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  infoKey: {
    fontWeight: "bold",
    flex: 1,
  },
  infoValue: {
    flex: 2,
  },
  arrowIcon: {
    alignSelf: "center",
    marginVertical: 10,
  },
  closeButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
