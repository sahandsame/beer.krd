import { Camera, Code, Megaphone, Palette, Sparkles, Target } from "lucide-react";

const icons = {
  code: Code,
  megaphone: Megaphone,
  palette: Palette,
  target: Target,
  camera: Camera,
  sparkles: Sparkles,
};

export function ServiceIconPreview({ name }: { name: string }) {
  const Icon = icons[name as keyof typeof icons] ?? Sparkles;
  return <Icon className="size-5" aria-hidden="true" />;
}
