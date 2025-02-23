import * as React from "react";
import { Linking, Platform, Text } from "react-native";
import List, { ListHeader } from "@/components/ui/list";
import ListItem from "@/components/ui/list-item";
import { Muted } from "@/components/ui/typography";
import { ScrollView } from "react-native-gesture-handler";
import { Archive, Bell, BookOpen, Send, Shield, Star } from "@/lib/icons";
import * as WebBrowser from "expo-web-browser";

import { ThemeSettingItem } from "@/components/settings/ThemeItem";
import { NotificationItem } from "@/components/settings/NotificationItem";
import { useUser } from "@/hooks/useUser";
import { ArrowBigLeftIcon } from "lucide-react-native";

export default function Profile() {
  const openExternalURL = (url: string) => {
    if (Platform.OS === "web") {
      Linking.openURL(url);
    } else {
      WebBrowser.openBrowserAsync(url);
    }
  };

  const { user, setUser } = useUser();

  return (
    <ScrollView className="flex-1 bg-[#070b0f] w-full px-6  pt-4 gap-y-6">
      <List>
        {/* <ListHeader>
          <Muted>App</Muted>
        </ListHeader> */}
        {/* <ThemeSettingItem />
        {Platform.OS !== "web" && <NotificationItem />} */}
        <Text className="text-white">{JSON.stringify(user)}</Text>
        <ListHeader className="pt-8">
          <Muted>GENERAL</Muted>
        </ListHeader>
        <ListItem
          itemLeft={(props) => <Star {...props} />} // props adds size and color attributes
          label="Give us a start"
          onPress={() =>
            openExternalURL("https://github.com/expo-starter/expo-template")
          }
        />
        <ListItem
          itemLeft={(props) => <Send {...props} />} // props adds size and color attributes
          label="Send Feedback"
          onPress={() => openExternalURL("https://expostarter.com")}
        />
        <ListItem
          itemLeft={(props) => <Shield {...props} />} // props adds size and color attributes
          label="Privacy Policy"
          onPress={() => openExternalURL("https://expostarter.com")}
        />
        <ListItem
          itemLeft={(props) => <BookOpen {...props} />} // props adds size and color attributes
          label="Terms of service"
          onPress={() => openExternalURL("https://expostarter.com")}
        />
        <ListItem
          itemLeft={(props) => <ArrowBigLeftIcon {...props} />} // props adds size and color attributes
          label="Logout"
          onPress={() => setUser(null)}
        />
      </List>
    </ScrollView>
  );
}
