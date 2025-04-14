import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeatureSection';
import DashboardSection from '../components/DashboardSection';
import TestimonialsSection from '../components/TestimonialsSection';
import MedicalImagingPreview from '../components/MedicalImagingPreview';

// Define features data
const features = [
  {
    icon: 'ChatBubbleBottomCenterTextIcon',
    title: 'Virtual Consultations',
    description: 'Connect with healthcare professionals from the comfort of your home with secure video calls.',
  },
  {
    icon: 'ClipboardDocumentCheckIcon',
    title: 'Intelligent Symptom Checker',
    description: 'Our AI-powered symptom checker helps identify potential issues and recommends appropriate care.',
  },
  {
    icon: 'DocumentChartBarIcon',
    title: 'Personalized Health Insights',
    description: 'Get customized insights and recommendations based on your unique health profile and history.',
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection 
        title="Why Choose ShifaAI"
        subtitle="Our platform combines AI technology with medical expertise to deliver comprehensive healthcare solutions."
        features={features}
      />
      <MedicalImagingPreview />
      <DashboardSection />
      <TestimonialsSection />
    </>
  );
} 