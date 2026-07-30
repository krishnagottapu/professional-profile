import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: "Sai Krishna Gottapu | Sr. Software Engineer",
  description:
    "Professional portfolio of Sai Krishna Gottapu — Sr. Software Engineer specializing in Java, Spring Boot, AI Integration, and full-stack development.",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sai Krishna Gottapu",
  jobTitle: "Sr. Software Engineer",
  email: "krishnagottapu4@gmail.com",
  url: "https://saikrishnagottapu.com",
  sameAs: [
    "https://github.com/krishnagottapu",
    "https://www.linkedin.com/in/sai-krishna-gottapu-0710b73b8",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Denver",
    addressRegion: "CO",
  },
  knowsAbout: [
    "Java",
    "Spring Boot",
    "Microservices",
    "MCP",
    "LLM Integration",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sai Krishna Gottapu",
  url: "https://saikrishnagottapu.com",
  author: {
    "@type": "Person",
    name: "Sai Krishna Gottapu",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HeroSection />
    </>
  );
}
