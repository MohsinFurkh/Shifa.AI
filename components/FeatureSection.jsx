"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleBottomCenterTextIcon, 
  ClipboardDocumentCheckIcon, 
  DocumentChartBarIcon,
  BeakerIcon,
  VideoCameraIcon,
  ChartBarIcon,
  PhotoIcon,
  DocumentTextIcon,
  UserGroupIcon,
  LightBulbIcon,
  LockClosedIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const iconMap = {
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentCheckIcon,
  DocumentChartBarIcon,
  BeakerIcon,
  VideoCameraIcon,
  ChartBarIcon,
  PhotoIcon,
  DocumentTextIcon,
  UserGroupIcon,
  LightBulbIcon,
  LockClosedIcon,
  PresentationChartLineIcon
};

// Default features to use if none are provided
const defaultFeatures = [
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

export default function FeatureSection({ 
  title = "Why Choose ShifaAI", 
  subtitle = "Our platform combines AI technology with medical expertise to deliver comprehensive healthcare solutions.",
  features = defaultFeatures, 
  bgColor = 'bg-white' 
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Only run client-side code after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Make sure features is always an array
  const featuresToRender = Array.isArray(features) ? features : defaultFeatures;
  
  return (
    <div id="features" className={`${bgColor} py-24 sm:py-32`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">{title}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Intelligent Healthcare Solutions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {subtitle}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {isMounted && featuresToRender.map((feature) => {
              const Icon = iconMap[feature.icon];
              return (
                <div key={feature.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="h-10 w-10 flex-none rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              );
            })}
            {!isMounted && (
              <div className="flex flex-col col-span-3">
                <p className="text-gray-500 text-center">Loading features...</p>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
} 