import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as icons from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type IconName = keyof typeof icons;

export const getLucideIcon = (name: string): React.FC<React.SVGProps<SVGSVGElement>> | null => {
  const iconName = name as IconName;
  if (icons[iconName]) {
    return icons[iconName] as React.FC<React.SVGProps<SVGSVGElement>>;
  }
  return null;
};
