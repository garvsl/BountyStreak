import * as React from "react";
import {
  View,
  Text,
  Linking,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { COLORS, COMMON_STYLES, SHADOWS } from "@/constants/theme";
import { useUser } from "@/hooks/useUser";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Profile() {
  const { user, setUser } = useUser();

  const openExternalURL = (url: string) => {
    if (Platform.OS === "web") {
      Linking.openURL(url);
    } else {
      WebBrowser.openBrowserAsync(url);
    }
  };

  const MenuItem = ({ icon, label, onPress, color = COLORS.primary }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.backgroundLight,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: color,
        ...SHADOWS.sm,
      }}
    >
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={color}
        style={{ marginRight: 12 }}
      />
      <Text
        style={{
          fontFamily: "Kica-PERSONALUSE-Light",
          fontSize: 16,
          color: color,
          flex: 1,
        }}
      >
        {label}
      </Text>
      <MaterialCommunityIcons name="chevron-right" size={24} color={color} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[COMMON_STYLES.container, { padding: 24 }]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <MaterialCommunityIcons
          name="book-open-page-variant"
          size={28}
          color={COLORS.primary}
          style={{ marginRight: 8 }}
        />
        <Text
          style={{
            fontFamily: "Kica-PERSONALUSE-Light",
            fontSize: 28,
            color: COLORS.primary,
            borderBottomWidth: 2,
            borderBottomColor: COLORS.primary,
          }}
        >
          CAPTAIN'S LOG
        </Text>
      </View>

      {/* Profile Section */}
      <View
        style={{
          backgroundColor: COLORS.backgroundLight,
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: COLORS.primary,
          ...SHADOWS.md,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: COLORS.backgroundDark,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: COLORS.primary,
              marginRight: 16,
            }}
          >
            <MaterialCommunityIcons
              name="pirate"
              size={32}
              color={COLORS.primary}
            />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Kica-PERSONALUSE-Light",
                fontSize: 24,
                color: COLORS.primary,
                marginBottom: 4,
              }}
            >
              {user.username}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="cash"
                size={16}
                color={COLORS.primary}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  fontFamily: "Kica-PERSONALUSE-Light",
                  fontSize: 16,
                  color: COLORS.primary,
                }}
              >
                {user.doubloons} Doubloons
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontFamily: "Kica-PERSONALUSE-Light",
            fontSize: 18,
            color: COLORS.primary,
            marginBottom: 12,
          }}
        >
          GENERAL
        </Text>
        <MenuItem
          icon="star"
          label="Rate Your Voyage"
          onPress={() =>
            openExternalURL("https://github.com/expo-starter/expo-template")
          }
        />
        <MenuItem
          icon="message"
          label="Send Message in a Bottle"
          onPress={() => openExternalURL("https://expostarter.com")}
        />
        <MenuItem
          icon="shield"
          label="Ship's Rules"
          onPress={() => openExternalURL("https://expostarter.com")}
        />
        <MenuItem
          icon="book-open-variant"
          label="Captain's Orders"
          onPress={() => openExternalURL("https://expostarter.com")}
        />
      </View>

      {/* Danger Zone */}
      <View>
        <Text
          style={{
            fontFamily: "Kica-PERSONALUSE-Light",
            fontSize: 18,
            color: COLORS.error,
            marginBottom: 12,
          }}
        >
          DANGER ZONE
        </Text>
        <MenuItem
          icon="anchor"
          label="Abandon Ship"
          onPress={() => setUser(null)}
          color={COLORS.error}
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
