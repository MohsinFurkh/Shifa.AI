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

export default function FeatureSection({ title, subtitle, features, bgColor = 'bg-white' }) {
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
            {features.map((feature) => {
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
          </dl>
        </div>
      </div>
    </div>
  );
} 