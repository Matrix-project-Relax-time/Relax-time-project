import { useEffect, useState } from "react";

import * as SecureStore from "expo-secure-store";
import { healthCheck } from "./api/client";
import RootLayout from "./app/_layout";
import LoadingScreen from "./components/loading-screen";
import WelcomeScreen from "./components/welcome-screen";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Call backend when app starts
  useEffect(() => {
    (async () => {
      try {
        // Check if welcome has been completed
        const welcomeCompleted = await SecureStore.getItemAsync(
          "welcomeCompleted"
        );

        if (!welcomeCompleted) {
          setShowWelcome(true);
        }

        // Health check with backend
        await healthCheck();
      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const handleWelcomeComplete = async () => {
    try {
      // Mark welcome as completed
      await SecureStore.setItemAsync("welcomeCompleted", "true");
      setShowWelcome(false);
    } catch (error) {
      console.error("Error saving welcome state:", error);
      setShowWelcome(false);
    }
  };

  if (!isReady) {
    return <LoadingScreen message="Initializing app..." />;
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return <RootLayout />;
}
