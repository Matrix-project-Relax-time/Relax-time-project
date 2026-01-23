import { Slot } from "expo-router";
import { DataProvider } from "../../components/DataContext";

export default function TabLayout() {
  return (
    <DataProvider>
      <Slot />
    </DataProvider>
  );
}
