import { Camera, Code, type LucideProps, Megaphone, Palette, Sparkles, Target } from "lucide-react";

const icons = {
  code: Code,
  megaphone: Megaphone,
  palette: Palette,
  target: Target,
  camera: Camera,
  sparkles: Sparkles,
};
export const serviceIconNames = Object.keys(icons);

export function ServiceIcon({ name, ...props }: LucideProps & { name: string }) {
  const Icon = icons[name as keyof typeof icons] ?? Sparkles;
  return <Icon aria-hidden="true" {...props} />;
}
