import React from "react";
import { Tabs } from "expo-router";
import BottomTabBar from "@/components/shared/bottom-tab-bar";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props: any) => <BottomTabBar {...props} />}
    />
  );
}
