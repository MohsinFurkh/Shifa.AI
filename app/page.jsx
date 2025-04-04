import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeatureSection from '../components/FeatureSection';
import HeroSection from '../components/HeroSection';
import TestimonialsSection from '../components/TestimonialsSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Patient Features */}
        <FeatureSection 
          title="Patient-Focused Features" 
          subtitle="Our platform offers innovative AI solutions designed specifically for patients, making healthcare more accessible, understandable, and personalized."
          features={[
            {
              title: "AI-Powered Symptom Checker",
              description: "Enter your symptoms and our AI suggests possible conditions and recommended tests.",
              icon: "ChatBubbleBottomCenterTextIcon",
            },
            {
              title: "Test Recommendation System",
              description: "Get personalized test recommendations based on your symptoms and medical history.",
              icon: "ClipboardDocumentCheckIcon",
            },
            {
              title: "Report Analysis & Insights",
              description: "Upload your medical reports and our AI will read and explain them in simple language.",
              icon: "DocumentChartBarIcon",
            },
            {
              title: "Medicine Recommendations",
              description: "Receive AI-suggested medication options based on your diagnosis.",
              icon: "BeakerIcon",
            },
            {
              title: "Telemedicine Integration",
              description: "Connect with qualified doctors for AI-assisted consultations from anywhere.",
              icon: "VideoCameraIcon",
            },
            {
              title: "Health Dashboard",
              description: "Access your personal health records, test results, and AI recommendations in one place.",
              icon: "ChartBarIcon",
            },
          ]}
          bgColor="bg-gray-50"
        />
        
        {/* Healthcare Professional Features */}
        <FeatureSection 
          title="Powerful Tools for Healthcare Professionals" 
          subtitle="Our AI-powered platform provides a suite of tools designed to enhance clinical decision-making, improve efficiency, and elevate patient care."
          features={[
            {
              title: "AI-Powered Medical Image Analysis",
              description: "Our advanced algorithms detect abnormalities in medical images with high precision.",
              icon: "PhotoIcon",
            },
            {
              title: "Automated Report Summarization",
              description: "Save time with AI that summarizes lengthy lab reports and medical histories into concise, actionable insights.",
              icon: "DocumentTextIcon",
            },
            {
              title: "Patient Case Management",
              description: "Track patient progress and view AI-generated health insights efficiently.",
              icon: "UserGroupIcon",
            },
            {
              title: "Clinical Decision Support",
              description: "Access AI-powered diagnostic suggestions and treatment recommendations based on the latest medical research.",
              icon: "LightBulbIcon",
            },
            {
              title: "Secure Collaboration",
              description: "Collaborate with colleagues and specialists securely while maintaining strict HIPAA compliance.",
              icon: "LockClosedIcon",
            },
            {
              title: "Research & Analytics",
              description: "Leverage anonymized clinical data for research and quality improvement.",
              icon: "PresentationChartLineIcon",
            },
          ]}
          bgColor="bg-white"
        />
        
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
} 