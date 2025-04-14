'use client';

import { 
  Brain, 
  Stethoscope, 
  FileDown, 
  Pill, 
  Video, 
  LayoutDashboard,
  ScanLine,
  FileText,
  Users,
  Lightbulb,
  LockKeyhole,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';

// Feature data for each category
const patientFeatures = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI-Powered Symptom Checker',
    description: 'Enter your symptoms and our AI will suggest possible conditions and recommended tests.',
  },
  {
    icon: <Stethoscope className="w-6 h-6" />,
    title: 'Test Recommendation System',
    description: 'AI suggests appropriate lab tests based on your symptoms and medical history.',
  },
  {
    icon: <FileDown className="w-6 h-6" />,
    title: 'Report Analysis & Insights',
    description: 'AI reads and explains your diagnostic reports (MRI, X-ray, blood tests, etc.).',
  },
  {
    icon: <Pill className="w-6 h-6" />,
    title: 'Medicine Recommendations',
    description: 'AI suggests medications based on your diagnosis and medical guidelines.',
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Telemedicine Integration',
    description: 'Connect with qualified doctors for AI-assisted consultations from anywhere.',
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: 'Health Dashboard',
    description: 'Access your personal health records, test results, and AI recommendations in one place.',
  },
];

const doctorFeatures = [
  {
    icon: <ScanLine className="w-6 h-6" />,
    title: 'AI-Powered Medical Image Analysis',
    description: 'Our advanced algorithms detect abnormalities in medical images with high precision.',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Automated Report Summarization',
    description: 'Save time with AI that summarizes lengthy lab reports and medical histories into concise, actionable insights.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Patient Case Management',
    description: 'Track patient progress and view AI-generated health insights efficiently.',
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Clinical Decision Support',
    description: 'Access AI-powered diagnostic suggestions and treatment recommendations based on the latest medical research.',
  },
  {
    icon: <LockKeyhole className="w-6 h-6" />,
    title: 'Secure Collaboration',
    description: 'Collaborate with colleagues and specialists securely while maintaining strict HIPAA compliance.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Research & Analytics',
    description: 'Leverage anonymized clinical data for research and quality improvement.',
  },
];

export default function FeaturesSection() {
  return (
    <div id="features" className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              AI-Powered Healthcare Solutions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
              Our platform offers innovative solutions for patients and healthcare professionals
            </p>
          </motion.div>
        </div>

        {/* Patient Features */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            For Patients
          </motion.h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patientFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Doctor Features */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            For Healthcare Professionals
          </motion.h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctorFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 