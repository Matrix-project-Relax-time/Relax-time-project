import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ReminderContextType = {
  remindersEnabled: boolean | null; // null = first-time
  setRemindersEnabled: (value: boolean) => void;
  reminderModalVisible: boolean;
  setReminderModalVisible: (value: boolean) => void;
};

export const ReminderContext = createContext<ReminderContextType>({
  remindersEnabled: null,
  setRemindersEnabled: () => {},
  reminderModalVisible: false,
  setReminderModalVisible: () => {},
});

export const ReminderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [remindersEnabled, setRemindersEnabled] = useState<boolean | null>(
    null
  );
  const [reminderModalVisible, setReminderModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("remindersEnabled");

      if (stored === null) {
        // first-time user
        setRemindersEnabled(null);
        setReminderModalVisible(true);
      } else {
        setRemindersEnabled(stored === "true");
        setReminderModalVisible(false);
      }
    })();
  }, []);

  return (
    <ReminderContext.Provider
      value={{
        remindersEnabled,
        setRemindersEnabled,
        reminderModalVisible,
        setReminderModalVisible,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
};
