import { Stack } from "expo-router";
import React from "react";
import EmergencyContactForm from "@/components/AddContact";

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="setting" options={{ title: 'Settings'}} />
      <Stack.Screen
        name="addContact"
        options={{
          title: "Add Emergency Contact",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            fontWeight: "600",
          },
          animation: "slide_from_right",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
