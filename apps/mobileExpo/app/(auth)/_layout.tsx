import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function AuthLayout() {
  return (
    <Tabs>
    <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="newArea/index"
        options={{
          title: "New Area",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
            name="profile/authorization/index"
            options={{
                title: "Authorization",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person-outline" size={size} color={color} />
                ),
            }}
        />
    </Tabs>
  );
}