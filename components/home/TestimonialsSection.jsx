'use client';

import { motion } from 'framer-motion';
import { QuoteIcon } from 'lucide-react';

const testimonials = [
  {
    content: "ShifaAI has completely transformed how I manage my health. The AI symptom checker accurately identified my condition, and the report analysis feature helped me understand my lab results in plain language.",
    author: "Sarah Thompson",
    role: "Patient",
    image: "/testimonials/patient1.jpg" // Replace with actual image path
  },
  {
    content: "As a cardiologist, ShifaAI's medical imaging analysis has proven to be an invaluable second opinion. It helps me catch details I might have missed and gives my patients greater confidence in their diagnoses.",
    author: "Dr. James Wilson",
    role: "Cardiologist",
    image: "/testimonials/doctor1.jpg" // Replace with actual image path
  },
  {
    content: "The platform's medication recommendations have been spot on, considering my entire medical history and potential interactions. The reminders keep me on track with my treatment plan.",
    author: "Michael Chen",
    role: "Patient",
    image: "/testimonials/patient2.jpg" // Replace with actual image path
  },
  {
    content: "Our hospital has seen a 40% increase in diagnostic efficiency since implementing ShifaAI. The platform streamlines our workflow and allows us to provide better care to more patients.",
    author: "Dr. Emily Rodriguez",
    role: "Hospital Administrator",
    image: "/testimonials/admin1.jpg" // Replace with actual image path
  }
];

export default function TestimonialsSection() {
  return (
    <div className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Testimonials</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            What Our Users Say
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
            Hear from patients, doctors, and healthcare administrators who have experienced the ShifaAI difference
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 relative"
            >
              <div className="absolute top-6 left-6 text-blue-600/20 dark:text-blue-400/20">
                <QuoteIcon size={36} />
              </div>
              
              <div className="relative z-10">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{testimonial.content}</p>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
                    {/* Replace with actual image if available */}
                    <div className="h-full w-full bg-gradient-to-br from-blue-500 to-teal-400 opacity-50"></div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 