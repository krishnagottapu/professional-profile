import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Personal and open-source projects by Sai Krishna Gottapu. GitHub repositories and featured works.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
