'use client';

import { motion } from 'framer-motion';
import { Search, MessageCircle, CheckCircle2, Home } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ServiceProcess() {
  const { t, locale } = useLanguage();

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  const steps: Step[] = [
    {
      icon: Search,
      title: getTranslation('contact.browseServices', 'تصفح الخدمات', 'Browse Services'),
      description: getTranslation('contact.browseServicesDesc', 'استكشف مجموعة شاملة من خدماتنا العقارية المصممة خصيصاً للمغتربين', 'Explore our comprehensive range of real estate services tailored for expats'),
    },
    {
      icon: MessageCircle,
      title: getTranslation('contact.requestService', 'طلب خدمة', 'Request Service'),
      description: getTranslation('contact.requestServiceDesc', 'املأ نموذجاً بسيطاً بمتطلباتك ومعلومات الاتصال', 'Fill out a simple form with your requirements and contact information'),
    },
    {
      icon: CheckCircle2,
      title: getTranslation('contact.weGetBackToYou', 'نعود إليك', 'We Get Back to You'),
      description: getTranslation('contact.weGetBackToYouDesc', 'سيتصل بك فريقنا الخبير خلال 24 ساعة لمناقشة احتياجاتك', 'Our expert team will contact you within 24 hours to discuss your needs'),
    },
    {
      icon: Home,
      title: getTranslation('contact.serviceDelivered', 'تقديم الخدمة', 'Service Delivered'),
      description: getTranslation('contact.serviceDeliveredDesc', 'نقدم الخدمة باحترافية وشفافية ورعاية', 'We provide the service with professionalism, transparency, and care'),
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            {getTranslation('contact.howItWorks', 'كيف يعمل', 'How It Works')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {getTranslation('contact.simpleProcess', 'عملية بسيطة ومباشرة للحصول على الخدمات التي تحتاجها', 'A simple, straightforward process to get the services you need')}
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-linear-to-r from-[#B49162] via-[#B49162]/50 to-[#B49162] transform translate-x-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-[#B49162]/30 hover:shadow-xl transition-all duration-300 h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#B49162] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-4">
                      <div className="inline-flex p-4 bg-[#B49162]/10 rounded-xl">
                        <Icon className="w-8 h-8 text-[#B49162]" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

