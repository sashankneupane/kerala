'use client';
import React from "react";
import Hero from "@/components/hero";
import PhotoGrid from "@/components/photogrid";
import { motion } from "framer-motion";
import portraitsData from "./data.json";

export default function PortraitsOfKerala() {

  const baseUrl = "/photos/portraits-of-kerala";
  const imagesUrl = `${baseUrl}/portraits`;

  const heroImages = portraitsData.heroImages.map(image => `${imagesUrl}/${image}.jpg`);
  const images = portraitsData.portraits.map(portrait => ({
    src: `${imagesUrl}/${portrait.filename}.jpg`,
    title: portrait.title,
    subtitle: portrait.subtitle,
    description: portrait.description
  }));

  return (
    <main className="min-h-screen bg-black">
      <Hero 
        images={heroImages}
        title="Portraits of Kerala"
        description="A collection of personal stories from the diverse people of Kerala, offering a glimpse into the state's rich traditions and evolving culture."
        imageInterval={5000}
        author="Bipana Bastola"
      />

      {/* Project Description */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg leading-relaxed">
              Through their responses to the questions, &quot;How do you feel about Theyyam?&quot; and 
              &quot;If you were to say things about Kerala to people, what would you say?&quot;, 
              each individual shares their perspective on what makes Kerala so special.
            </p>
            <p className="text-lg leading-relaxed">
              This project invites you to explore Kerala through the stories of its people. 
              Each portrait reveals the living culture of Kerala—the traditions, the beauty, 
              and the spirit that makes it unique.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portraits Grid */}
      <section className="py-16">
        <div className="max-w-[1800px] mx-auto px-4">
          <PhotoGrid 
            images={images}
            type="M"
            showLayoutToggle={true}
            showTitle={true}
            showSubtitle={true}
            className="mb-8"
          />
        </div>
      </section>
    </main>
  );
}