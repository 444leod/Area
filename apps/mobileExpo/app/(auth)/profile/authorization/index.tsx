import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ServiceCard = ({ name, description, icon, webUrl, customColor }) => {
  const openWebVersion = () => {
    Linking.openURL(webUrl);
  };

  return (
    <View style={styles.card}>
      <View style={[styles.webOnlyBadge, { backgroundColor: customColor }]}>
        <Ionicons name="desktop-outline" size={16} color="#fff" />
        <Text style={styles.webOnlyText}>Web Only</Text>
      </View>

      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name={icon} size={24} color={customColor} />
          <Text style={styles.cardTitle}>{name}</Text>
        </View>
      </View>

      <Text style={styles.cardDescription}>{description}</Text>

      <View style={styles.messageContainer}>
        <Ionicons name="information-circle-outline" size={20} color="#666" />
        <Text style={styles.messageText}>
          Cette fonctionnalité est disponible uniquement sur la version web de
          l'application
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.webButton, { backgroundColor: customColor }]}
        onPress={openWebVersion}
      >
        <Ionicons
          name="open-outline"
          size={20}
          color="#fff"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Ouvrir dans le navigateur</Text>
      </TouchableOpacity>
    </View>
  );
};

const ServiceConnectionsScreen = ({ authorizations = [] }) => {
  const BASE_WEB_URL = "https://127.0.0.1:8081/profile/authorization"; // Remplace par ton URL de base

  const services = [
    {
      name: "Google",
      description:
        "Connectez-vous à Google pour accéder à Gmail, Calendar, Drive et d'autres services Google dans vos automatisations",
      icon: "logo-google",
      webUrl: `${BASE_WEB_URL}/login/oauth/google`,
      customColor: "#4285F4", // Bleu Google
    },
    {
      name: "Atlassian",
      description:
        "Intégrez Jira, Confluence et d'autres outils Atlassian pour une meilleure gestion de projets",
      icon: "briefcase-outline",
      webUrl: `${BASE_WEB_URL}/login/oauth/atlassian`,
      customColor: "#0052CC", // Bleu Atlassian
    },
    {
      name: "GitHub",
      description:
        "Accédez à vos repositories, issues et pull requests GitHub pour automatiser votre workflow de développement",
      icon: "logo-github",
      webUrl: `${BASE_WEB_URL}/login/oauth/github`,
      customColor: "#2b3137", // Gris foncé GitHub
    },
    {
      name: "Spotify",
      description:
        "Connectez-vous à Spotify pour gérer vos playlists et votre musique automatiquement",
      icon: "musical-notes-outline",
      webUrl: `${BASE_WEB_URL}/login/oauth/spotify`,
      customColor: "#1DB954", // Vert Spotify
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Connexions des Services</Text>
        <Text style={styles.subtitle}>
          Connectez-vous à vos services préférés via notre version web
        </Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1a1a1a",
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
    paddingHorizontal: 20,
  },
  servicesGrid: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  webOnlyBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  webOnlyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  messageContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 18,
  },
  webButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonIcon: {
    marginRight: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ServiceConnectionsScreen;
