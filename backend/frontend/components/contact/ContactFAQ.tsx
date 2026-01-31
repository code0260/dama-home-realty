'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface FAQItem {
  question: string;
  answer: string;
}

export function ContactFAQ() {
  const { t, locale } = useLanguage();

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  const faqData: FAQItem[] = [
    {
      question: getTranslation('contact.faq1Question', 'ما مدى سرعة استلام الرد؟', 'How quickly will I receive a response?'),
      answer: getTranslation('contact.faq1Answer', 'نحن عادة نرد على جميع الاستفسارات خلال 24 ساعة في أيام العمل. للأمور العاجلة، يرجى الاتصال بنا مباشرة على +963 932 498 092.', 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly at +963 932 498 092.'),
    },
    {
      question: getTranslation('contact.faq2Question', 'هل تقدمون جولات افتراضية للعقارات؟', 'Do you offer virtual property tours?'),
      answer: getTranslation('contact.faq2Answer', 'نعم! نقدم جولات افتراضية للعديد من عقاراتنا. يمكنك طلب جولة افتراضية عند التواصل معنا حول عقار محدد.', 'Yes! We offer virtual tours for many of our properties. You can request a virtual tour when contacting us about a specific property.'),
    },
    {
      question: getTranslation('contact.faq3Question', 'ما هي المستندات التي أحتاجها لإيجار عقار؟', 'What documents do I need to rent a property?'),
      answer: getTranslation('contact.faq3Answer', 'بشكل عام، ستحتاج إلى هوية سارية المفعول، وإثبات الدخل، ومراجع. سيوفر لك فريقنا قائمة كاملة بناءً على وضعك المحدد.', 'Generally, you\'ll need a valid ID, proof of income, and references. Our team will provide you with a complete checklist based on your specific situation.'),
    },
    {
      question: getTranslation('contact.faq4Question', 'هل يمكنني جدولة معاينة عقار في عطلة نهاية الأسبوع؟', 'Can I schedule a property viewing on weekends?'),
      answer: getTranslation('contact.faq4Answer', 'نعم، نقدم معاينات في عطلة نهاية الأسبوع بموعد مسبق. يرجى التواصل معنا لجدولة وقت مناسب.', 'Yes, we offer weekend viewings by appointment. Please contact us to schedule a convenient time.'),
    },
    {
      question: getTranslation('contact.faq5Question', 'هل تساعدون في إدارة العقارات؟', 'Do you help with property management?'),
      answer: getTranslation('contact.faq5Answer', 'نعم، نقدم خدمات شاملة لإدارة العقارات بما في ذلك الصيانة وعلاقات المستأجرين والتقارير المالية.', 'Yes, we offer comprehensive property management services including maintenance, tenant relations, and financial reporting.'),
    },
    {
      question: getTranslation('contact.faq6Question', 'ما هي المناطق في دمشق التي تغطونها؟', 'What areas in Damascus do you cover?'),
      answer: getTranslation('contact.faq6Answer', 'نغطي جميع الأحياء الرئيسية في دمشق بما في ذلك البلدة القديمة والمزة وكفر سوسة والمزيد. تواصل معنا للاستفسار عن مناطق محددة.', 'We cover all major neighborhoods in Damascus including Old City, Mezzeh, Kafr Sousa, and more. Contact us to inquire about specific areas.'),
    },
    {
      question: getTranslation('contact.faq7Question', 'كيف يمكنني إدراج عقاري معكم؟', 'How do I list my property with you?'),
      answer: getTranslation('contact.faq7Answer', 'يمكنك إدراج عقارك من خلال صفحة "إدراج عقار". سيقوم فريقنا بالتحقق ومساعدتك في إنشاء إدراج جذاب.', 'You can list your property through our "List Property" page. Our team will verify and help you create an attractive listing.'),
    },
    {
      question: getTranslation('contact.faq8Question', 'ما هي طرق الدفع التي تقبلونها؟', 'What payment methods do you accept?'),
      answer: getTranslation('contact.faq8Answer', 'نقبل طرق دفع متنوعة بما في ذلك التحويلات المصرفية وبطاقات الائتمان والنقد. يتم مناقشة شروط الدفع أثناء عملية الحجز.', 'We accept various payment methods including bank transfers, credit cards, and cash. Payment terms are discussed during the booking process.'),
    },
  ];

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqData.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-gray-200 rounded-lg px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="text-left hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B49162]/10 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4 text-[#B49162]" />
                </div>
                <span className="font-semibold text-[#0F172A] text-base">
                  {faq.question}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-4 pl-11">
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

