import React, { createContext, useContext } from "react";
import { notification, ConfigProvider } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

interface NotificationContextProps {
  openNotification: (
    type: NotificationType,
    message: string,
    description?: string
  ) => void;
  contextHolder: React.ReactNode;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    type: NotificationType,
    message: string,
    description?: string
  ) => {
    api[type]({
      message,
      description,
      placement: "bottomRight",
    });
  };

  return (
    <ConfigProvider>
      {contextHolder}
      <NotificationContext.Provider value={{ openNotification, contextHolder }}>
        {children}
      </NotificationContext.Provider>
    </ConfigProvider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
