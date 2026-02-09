"use client";

import { useTheme } from "next-themes";
import { Toaster } from "./ui/sonner";

const ToasterClient = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={(!theme ? "system" : theme) as "system" | "light" | "dark"}
      position="top-center"
      richColors
    />
  );
};

export default ToasterClient;
