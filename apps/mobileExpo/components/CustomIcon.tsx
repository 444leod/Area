import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
};

export const CustomIcon = ({ name, size = 24, color = "#000" }: IconProps) => {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
};
