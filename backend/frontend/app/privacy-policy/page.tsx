'use client';

import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';

const lastUpdated = '2026-01-30';

const versions = [
  {
    version: '2.0',
    date: '2026-01-30',
    changes: [
      'Updated to comply with Syrian data protection requirements',
      'Clarified data usage for legal contracts and security approvals',
      'Added data deletion policy after rental period',
      'Removed GDPR references (not applicable in Syria)',
    ],
    isCurrent: true,
  },
  {
    version: '1.0',
    date: '2024-01-15',
    changes: ['Initial version'],
  },
];

export default function PrivacyPolicyPage() {
  const { t, locale } = useLanguage();
  const isArabic = locale === 'ar';

  const title = isArabic
    ? 'سياسة الخصوصية'
    : 'Privacy Policy';

  const description = isArabic
    ? 'تعرف على كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك الشخصية عند استخدام خدماتنا. نحن ملتزمون بحماية خصوصيتك وفقاً للقوانين السورية.'
    : 'Learn how we collect, use, and protect your personal information when you use our services. We are committed to protecting your privacy in accordance with Syrian laws.';

  return (
    <LegalPageLayout
      title={title}
      lastUpdated={lastUpdated}
      versions={versions}
      description={description}
    >
      {isArabic ? (
        <>
          <section id="introduction">
            <h2>1. المقدمة</h2>
            <p>
              Dama Home Realty ("نحن" أو "الشركة") ملتزمة بحماية خصوصيتك. توضح سياسة الخصوصية هذه
              كيفية جمعنا واستخدامنا والكشف عن معلوماتك وحمايتها عند استخدام منصة العقارات وخدماتنا.
            </p>
            <p>
              باستخدام خدماتنا، فإنك توافق على جمع واستخدام المعلومات وفقاً لهذه السياسة.
              نحن نلتزم بالقوانين واللوائح السورية المتعلقة بحماية البيانات الشخصية.
            </p>
          </section>

          <section id="information-we-collect">
            <h2>2. المعلومات التي نجمعها</h2>
            <h3>2.1 المعلومات الشخصية</h3>
            <p>قد نجمع المعلومات الشخصية التالية:</p>
            <ul>
              <li>الاسم وعنوان البريد الإلكتروني ورقم الهاتف</li>
              <li>معلومات الهوية (بطاقة الهوية أو جواز السفر) - <strong>للعقود القانونية والموافقات الأمنية فقط</strong></li>
              <li>معلومات الحجز والاستفسارات العقارية</li>
              <li>بيانات اعتماد الحساب والتفضيلات</li>
              <li>سجل التواصل مع وكلائنا</li>
            </ul>
            <p className="mt-4 p-4 bg-blue-50 border-r-4 border-blue-500 rounded">
              <strong>استخدام محدود للهوية:</strong> معلومات الهوية (بطاقة الهوية/جواز السفر) يتم جمعها
              <strong> حصرياً</strong> لأغراض:
              <ul className="mt-2 ml-4">
                <li>إتمام العقود القانونية المطلوبة</li>
                <li>الحصول على الموافقات الأمنية الرسمية المطلوبة من السلطات السورية</li>
              </ul>
            </p>

            <h3>2.2 المعلومات المجمعة تلقائياً</h3>
            <p>قد نجمع تلقائياً:</p>
            <ul>
              <li>عنوان IP ومعلومات الجهاز</li>
              <li>نوع المتصفح والإصدار</li>
              <li>الصفحات التي تمت زيارتها والوقت المستغرق على منصتنا</li>
              <li>ملفات تعريف الارتباط (Cookies) وتقنيات التتبع المماثلة</li>
            </ul>
          </section>

          <section id="how-we-use">
            <h2>3. كيفية استخدامنا لمعلوماتك</h2>
            <p>نستخدم المعلومات المجمعة للأغراض التالية:</p>
            <ul>
              <li>
                <strong>معالجة الحجوزات والاستفسارات العقارية:</strong> استخدام معلوماتك لإتمام الحجوزات
                والاستفسارات العقارية.
              </li>
              <li>
                <strong>إتمام العقود القانونية:</strong> استخدام معلومات الهوية لإتمام العقود القانونية
                المطلوبة بين الأطراف.
              </li>
              <li>
                <strong>الموافقات الأمنية:</strong> تقديم معلومات الهوية للسلطات السورية المختصة للحصول
                على الموافقات الأمنية المطلوبة (للإيجار المفروش).
              </li>
              <li>
                <strong>التواصل معك:</strong> التواصل معك بخصوص حجوزاتك وخدماتك.
              </li>
              <li>
                <strong>إرسال تأكيدات الحجز والتحديثات المهمة:</strong> إرسال رسائل تأكيد الحجز
                والتحديثات المتعلقة بخدماتك.
              </li>
              <li>
                <strong>تحسين خدماتنا وتجربة المستخدم:</strong> استخدام المعلومات المجمعة لتحسين
                خدماتنا وتجربة المستخدم.
              </li>
              <li>
                <strong>الامتثال للالتزامات القانونية:</strong> الامتثال للقوانين واللوائح السورية.
              </li>
              <li>
                <strong>منع الاحتيال وضمان أمان المنصة:</strong> استخدام المعلومات لمنع الاحتيال
                وضمان أمان منصتنا.
              </li>
            </ul>
          </section>

          <section id="data-protection">
            <h2>4. حماية البيانات</h2>
            <h3>4.1 عدم بيع البيانات</h3>
            <p className="font-semibold text-primary">
              <strong>نحن لا نبيع بياناتك الشخصية لأي طرف ثالث.</strong>
            </p>
            <p>
              معلوماتك الشخصية محمية ولا يتم بيعها أو تأجيرها أو مشاركتها مع أطراف ثالثة لأغراض
              تسويقية أو تجارية.
            </p>

            <h3>4.2 التخزين الآمن</h3>
            <p>
              نطبق التدابير التقنية والتنظيمية المناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به
              أو التعديل أو الكشف أو التدمير. يتم تخزين البيانات بشكل آمن باستخدام تقنيات التشفير
              الحديثة.
            </p>
            <p className="mt-4 p-4 bg-green-50 border-r-4 border-green-500 rounded">
              <strong>التزامنا:</strong> نحن ملتزمون بحماية معلوماتك الشخصية بأعلى معايير الأمان
              المتاحة.
            </p>
          </section>

          <section id="data-retention">
            <h2>5. الاحتفاظ بالبيانات</h2>
            <h3>5.1 فترة الاحتفاظ</h3>
            <p>
              نحتفظ بمعلوماتك الشخصية فقط <strong>للمدة اللازمة</strong> لتحقيق الأغراض الموضحة في
              هذه السياسة، ما لم تتطلب القوانين فترة احتفاظ أطول.
            </p>
            <h3>5.2 حذف البيانات بعد انتهاء فترة الإيجار</h3>
            <p>
              <strong>بعد انتهاء فترة الإيجار</strong>، يتم حذف معلوماتك الشخصية (بما في ذلك نسخ
              الهوية/جواز السفر) من أنظمتنا، <strong>ما لم تكن مطلوبة بموجب القانون</strong> للاحتفاظ بها.
            </p>
            <ul>
              <li>
                <strong>الحذف التلقائي:</strong> بعد انتهاء فترة الإيجار، يتم حذف البيانات تلقائياً
                من أنظمتنا.
              </li>
              <li>
                <strong>الاستثناءات القانونية:</strong> قد نحتفظ ببعض البيانات إذا كانت مطلوبة بموجب
                القوانين السورية (مثل السجلات المالية أو العقود).
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border-r-4 border-amber-500 rounded">
              <strong>مهم:</strong> في حالة طلب السلطات السورية المختصة الاحتفاظ ببعض البيانات لأغراض
              قانونية، سنمتثل لهذه المتطلبات وفقاً للقوانين السورية.
            </p>
          </section>

          <section id="data-sharing">
            <h2>6. مشاركة البيانات والكشف عنها</h2>
            <p>
              نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك فقط في الحالات التالية:
            </p>
            <ul>
              <li>
                <strong>السلطات السورية المختصة:</strong> عند الحاجة للحصول على الموافقات الأمنية
                أو للامتثال للقوانين واللوائح السورية.
              </li>
              <li>
                <strong>مقدمي الخدمات الموثوقين:</strong> مع مقدمي خدمات الطرف الثالث الموثوقين
                (مثل معالجات الدفع) الذين يساعدون في تشغيل منصتنا.
              </li>
              <li>
                <strong>المتطلبات القانونية:</strong> عند الحاجة بموجب القانون أو لحماية حقوقنا
                وسلامتنا.
              </li>
              <li>
                <strong>بموافقتك الصريحة:</strong> عندما تسمح لنا صراحة بمشاركة معلوماتك.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-red-50 border-r-4 border-red-500 rounded">
              <strong>ضمان:</strong> نحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية
              أو تجارية. جميع المشاركات تتم فقط للأغراض المذكورة أعلاه.
            </p>
          </section>

          <section id="data-security">
            <h2>7. أمان البيانات</h2>
            <p>
              نطبق التدابير التقنية والتنظيمية المناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به
              أو التعديل أو الكشف أو التدمير. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة 100%.
            </p>
            <p>
              نستخدم تقنيات التشفير الحديثة وجدران الحماية وأنظمة الحماية المتقدمة لحماية بياناتك.
            </p>
          </section>

          <section id="cookies">
            <h2>8. ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على منصتنا. يمكنك التحكم في ملفات تعريف
              الارتباط من خلال إعدادات المتصفح. ومع ذلك، قد يؤدي تعطيل ملفات تعريف الارتباط إلى
              الحد من قدرتك على استخدام ميزات معينة.
            </p>
          </section>

          <section id="your-rights">
            <h2>9. حقوقك</h2>
            <p>لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:</p>
            <ul>
              <li>
                <strong>حق الوصول:</strong> طلب نسخة من بياناتك الشخصية.
              </li>
              <li>
                <strong>حق التصحيح:</strong> تصحيح البيانات غير الدقيقة أو غير الكاملة.
              </li>
              <li>
                <strong>حق الحذف:</strong> طلب حذف بياناتك الشخصية (بعد انتهاء فترة الإيجار).
              </li>
              <li>
                <strong>حق الاعتراض:</strong> الاعتراض على معالجة بياناتك الشخصية.
              </li>
            </ul>
            <p className="mt-4">
              لممارسة هذه الحقوق، يرجى الاتصال بنا على{' '}
              <a href="mailto:privacy@damahomerealty.com">privacy@damahomerealty.com</a>.
            </p>
          </section>

          <section id="children-privacy">
            <h2>10. خصوصية الأطفال</h2>
            <p>
              خدماتنا غير مخصصة للأفراد الذين تقل أعمارهم عن 18 عاماً. نحن لا نجمع معلومات شخصية
              من الأطفال بشكل متعمد.
            </p>
          </section>

          <section id="changes">
            <h2>11. تغييرات سياسة الخصوصية</h2>
            <p>
              قد نحدث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات من خلال نشر سياسة
              الخصوصية الجديدة على هذه الصفحة وتحديث تاريخ "آخر تحديث".
            </p>
          </section>

          <section id="contact">
            <h2>12. التواصل معنا</h2>
            <p>إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا:</p>
            <ul>
              <li>
                <strong>البريد الإلكتروني:</strong>{' '}
                <a href="mailto:privacy@damahomerealty.com">privacy@damahomerealty.com</a>
              </li>
              <li>
                <strong>الهاتف:</strong>{' '}
                <a href="tel:+963123456789">+963 123 456 789</a>
              </li>
              <li>
                <strong>العنوان:</strong> دمشق، سوريا
              </li>
            </ul>
          </section>
        </>
      ) : (
        <>
          <section id="introduction">
            <h2>1. Introduction</h2>
            <p>
              Dama Home Realty ("we," "our," or "us") is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our real estate platform and services.
            </p>
            <p>
              By using our services, you agree to the collection and use of information in accordance
              with this policy. We comply with Syrian laws and regulations regarding personal data protection.
            </p>
          </section>

          <section id="information-we-collect">
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul>
              <li>Name, email address, phone number</li>
              <li>Identification information (ID card or passport) - <strong>for legal contracts and security approvals only</strong></li>
              <li>Booking and property inquiry information</li>
              <li>Account credentials and preferences</li>
              <li>Communication history with our agents</li>
            </ul>
            <p className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <strong>Limited Use of Identification:</strong> Identification information (ID card/passport)
              is collected <strong>exclusively</strong> for:
              <ul className="mt-2 ml-4">
                <li>Completing required legal contracts</li>
                <li>Obtaining official security approvals required by Syrian authorities</li>
              </ul>
            </p>

            <h3>2.2 Automatically Collected Information</h3>
            <p>We may automatically collect:</p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our platform</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section id="how-we-use">
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul>
              <li>
                <strong>Processing bookings and property inquiries:</strong> Using your information
                to complete bookings and property inquiries.
              </li>
              <li>
                <strong>Completing legal contracts:</strong> Using identification information to complete
                required legal contracts between parties.
              </li>
              <li>
                <strong>Security approvals:</strong> Providing identification information to competent
                Syrian authorities to obtain required security approvals (for furnished rentals).
              </li>
              <li>
                <strong>Communicating with you:</strong> Communicating with you about your bookings and services.
              </li>
              <li>
                <strong>Sending booking confirmations and important updates:</strong> Sending booking
                confirmations and updates related to your services.
              </li>
              <li>
                <strong>Improving our services and user experience:</strong> Using collected information
                to improve our services and user experience.
              </li>
              <li>
                <strong>Complying with legal obligations:</strong> Complying with Syrian laws and regulations.
              </li>
              <li>
                <strong>Preventing fraud and ensuring platform security:</strong> Using information to
                prevent fraud and ensure our platform's security.
              </li>
            </ul>
          </section>

          <section id="data-protection">
            <h2>4. Data Protection</h2>
            <h3>4.1 No Data Sale</h3>
            <p className="font-semibold text-primary">
              <strong>We do not sell your personal data to any third party.</strong>
            </p>
            <p>
              Your personal information is protected and is not sold, rented, or shared with third parties
              for marketing or commercial purposes.
            </p>

            <h3>4.2 Secure Storage</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. Data is
              stored securely using modern encryption technologies.
            </p>
            <p className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <strong>Our Commitment:</strong> We are committed to protecting your personal information
              with the highest available security standards.
            </p>
          </section>

          <section id="data-retention">
            <h2>5. Data Retention</h2>
            <h3>5.1 Retention Period</h3>
            <p>
              We retain your personal information only <strong>for as long as necessary</strong> to
              fulfill the purposes outlined in this Privacy Policy, unless a longer retention period
              is required by law.
            </p>
            <h3>5.2 Data Deletion After Rental Period</h3>
            <p>
              <strong>After the rental period ends</strong>, your personal information (including ID/passport
              copies) is deleted from our systems, <strong>unless required by law</strong> to retain it.
            </p>
            <ul>
              <li>
                <strong>Automatic deletion:</strong> After the rental period ends, data is automatically
                deleted from our systems.
              </li>
              <li>
                <strong>Legal exceptions:</strong> We may retain some data if required by Syrian laws
                (such as financial records or contracts).
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
              <strong>Important:</strong> If competent Syrian authorities require retention of some data
              for legal purposes, we will comply with these requirements in accordance with Syrian laws.
            </p>
          </section>

          <section id="data-sharing">
            <h2>6. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal information. We may share your information only in the
              following circumstances:
            </p>
            <ul>
              <li>
                <strong>Competent Syrian Authorities:</strong> When needed to obtain security approvals
                or to comply with Syrian laws and regulations.
              </li>
              <li>
                <strong>Trusted Service Providers:</strong> With trusted third-party service providers
                (e.g., payment processors) who assist in operating our platform.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.
              </li>
              <li>
                <strong>With Your Consent:</strong> When you explicitly authorize us to share your information.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <strong>Guarantee:</strong> We do not share your personal information with third parties
              for marketing or commercial purposes. All sharing is done only for the purposes mentioned above.
            </p>
          </section>

          <section id="data-security">
            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the Internet is 100% secure.
            </p>
            <p>
              We use modern encryption technologies, firewalls, and advanced protection systems to
              protect your data.
            </p>
          </section>

          <section id="cookies">
            <h2>8. Cookies</h2>
            <p>
              We use cookies to enhance your experience on our platform. You can control cookies through
              your browser settings. However, disabling cookies may limit your ability to use certain features.
            </p>
          </section>

          <section id="your-rights">
            <h2>9. Your Rights</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li>
                <strong>Right to Access:</strong> Request a copy of your personal data.
              </li>
              <li>
                <strong>Right to Rectification:</strong> Correct inaccurate or incomplete data.
              </li>
              <li>
                <strong>Right to Erasure:</strong> Request deletion of your personal data (after rental period ends).
              </li>
              <li>
                <strong>Right to Object:</strong> Object to processing of your personal data.
              </li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@damahomerealty.com">privacy@damahomerealty.com</a>.
            </p>
          </section>

          <section id="children-privacy">
            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly
              collect personal information from children.
            </p>
          </section>

          <section id="changes">
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section id="contact">
            <h2>12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@damahomerealty.com">privacy@damahomerealty.com</a>
              </li>
              <li>
                <strong>Phone:</strong>{' '}
                <a href="tel:+963123456789">+963 123 456 789</a>
              </li>
              <li>
                <strong>Address:</strong> Damascus, Syria
              </li>
            </ul>
          </section>
        </>
      )}
    </LegalPageLayout>
  );
}
