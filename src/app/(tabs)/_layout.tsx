import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "@/styles/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.gray["100"],
          borderTopWidth: 0,
          height: 130,
          paddingTop: 14,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarActiveTintColor: colors["success"],
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={25} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
        }}
      />
      <Tabs.Screen
        name="partidas"
        options={{
          title: "PARTIDAS",
          tabBarActiveTintColor: colors["success"],
          tabBarIcon: ({ color }) => (
            <Ionicons name="football-outline" color={color} size={25} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "CALENDÁRIO",
          tabBarActiveTintColor: colors["success"],
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" color={color} size={25} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "PERFIL",
          tabBarActiveTintColor: colors["success"],
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" color={color} size={25} />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: 4,
          },
        }}
      />
    </Tabs>
  );
}
