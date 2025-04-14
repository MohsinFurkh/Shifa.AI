import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import DashboardSection from '@/components/home/DashboardSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import MedicalImagingPreview from '@/components/home/MedicalImagingPreview';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MedicalImagingPreview />
      <DashboardSection />
      <TestimonialsSection />
    </>
  );
}
