'use client';

import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';

const lastUpdated = '2026-01-30';

const versions = [
  {
    version: '2.0',
    date: '2026-01-30',
    changes: [
      'Updated to comply with Syrian law and local real estate customs',
      'Added security clearance requirements for furnished rentals',
      'Added physical inspection requirements',
      'Updated pricing terms',
    ],
    isCurrent: true,
  },
  {
    version: '1.0',
    date: '2024-01-15',
    changes: ['Initial version'],
  },
];

export default function TermsPage() {
  const { t, locale } = useLanguage();
  const isArabic = locale === 'ar';

  const title = isArabic
    ? 'شروط الاستخدام'
    : 'Terms of Service';

  const description = isArabic
    ? 'يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصتنا وخدماتنا. هذه الشروط متوافقة مع القانون السوري والعادات المحلية.'
    : 'Please read these terms and conditions carefully before using our platform and services. These terms comply with Syrian law and local customs.';

  return (
    <LegalPageLayout
      title={title}
      lastUpdated={lastUpdated}
      versions={versions}
      description={description}
    >
      {isArabic ? (
        <>
          <section id="acceptance">
            <h2>1. قبول الشروط</h2>
            <p>
              من خلال الوصول إلى واستخدام منصة Dama Home Realty ("الخدمة")، فإنك تقبل وتوافق على الالتزام
              بهذه الشروط والأحكام ("الشروط"). إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.
            </p>
          </section>

          <section id="legal-capacity">
            <h2>2. الأهلية القانونية</h2>
            <h3>2.1 العمر والهوية</h3>
            <p>
              يجب أن يكون المستخدمون <strong>18 سنة أو أكثر</strong> وأن يكون لديهم هوية سارية المفعول
              (بطاقة هوية سورية أو جواز سفر) لاستخدام خدماتنا.
            </p>
            <ul>
              <li>يجب تقديم نسخة من الهوية عند التسجيل.</li>
              <li>يحق لنا التحقق من صحة الهوية المقدمة.</li>
              <li>يحظر استخدام الخدمة على القاصرين دون 18 سنة.</li>
            </ul>
            <p className="mt-4 p-4 bg-red-50 border-r-4 border-red-500 rounded">
              <strong>مهم:</strong> استخدام الخدمة من قبل شخص غير مؤهل قانونياً يعتبر انتهاكاً لهذه الشروط
              وقد يؤدي إلى إلغاء الحساب واتخاذ إجراءات قانونية.
            </p>
          </section>

          <section id="security-clearance">
            <h2>3. الموافقات الأمنية (للإيجار المفروش)</h2>
            <h3>3.1 متطلبات الموافقة الأمنية</h3>
            <p>
              بالنسبة للإيجار المفروش (Furnished Rental)، يجب على المستأجر <strong>تقديم نسخ صالحة
                من الهوية أو جواز السفر</strong> للحصول على الموافقة الأمنية المطلوبة من السلطات السورية.
            </p>
            <ul>
              <li>
                <strong>إلزامية تقديم الوثائق:</strong> يجب على المستأجر تقديم نسخ واضحة من:
                <ul className="mt-2 ml-4">
                  <li>بطاقة الهوية السورية أو جواز السفر</li>
                  <li>وثائق إضافية قد تطلبها السلطات</li>
                </ul>
              </li>
              <li>
                <strong>حق الرفض:</strong> يحق للشركة رفض طلب الإيجار إذا تم رفض الموافقة الأمنية
                من قبل السلطات المختصة.
              </li>
              <li>
                <strong>مدة المعالجة:</strong> قد تستغرق عملية الموافقة الأمنية عدة أيام عمل.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border-r-4 border-amber-500 rounded">
              <strong>تنبيه قانوني:</strong> هذه المتطلبات إلزامية بموجب القوانين واللوائح السورية
              المتعلقة بإيجار العقارات المفروشة. عدم تقديم الوثائق المطلوبة أو رفض الموافقة الأمنية
              يؤدي إلى إلغاء الحجز تلقائياً.
            </p>
          </section>

          <section id="inspection">
            <h2>4. المعاينة الفعلية (المعاينة النافية للجهالة)</h2>
            <h3>4.1 أهمية المعاينة الفعلية</h3>
            <p>
              الصور الرقمية المعروضة على الموقع هي <strong>للتوضيح فقط</strong> ولا تعتبر وصفاً نهائياً
              أو ملزماً للعقار. يقر المستأجر/المشتري بضرورة إجراء <strong>معاينة فعلية</strong>
              (المعاينة النافية للجهالة) للعقار قبل التوقيع على أي عقد.
            </p>
            <ul>
              <li>
                <strong>المسؤولية:</strong> المستأجر/المشتري مسؤول عن فحص العقار شخصياً قبل التوقيع.
              </li>
              <li>
                <strong>عدم الاعتماد على الصور:</strong> لا يمكن الاعتماد على الصور الرقمية فقط
                كأساس للقرار.
              </li>
              <li>
                <strong>حجز موعد المعاينة:</strong> يمكن حجز موعد للمعاينة من خلال الموقع أو التواصل معنا.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-blue-50 border-r-4 border-blue-500 rounded">
              <strong>ملاحظة قانونية:</strong> المعاينة النافية للجهالة هي مبدأ قانوني مهم في القانون السوري
              يضمن أن الطرفين على علم كامل بحالة العقار قبل إتمام الصفقة.
            </p>
          </section>

          <section id="pricing">
            <h2>5. الأسعار</h2>
            <h3>5.1 طبيعة الأسعار المعروضة</h3>
            <p>
              الأسعار المعروضة على الموقع هي <strong>استرشادية فقط</strong> وقد تتغير حتى يتم التوقيع
              على العقد النهائي. السعر النهائي الملزم هو المذكور في العقد الموقع بين الأطراف.
            </p>
            <ul>
              <li>
                <strong>قابلية التغيير:</strong> الأسعار قابلة للتغيير دون إشعار مسبق حتى لحظة التوقيع.
              </li>
              <li>
                <strong>السعر النهائي:</strong> السعر المذكور في العقد الموقع هو السعر الملزم فقط.
              </li>
              <li>
                <strong>العملة:</strong> يمكن عرض الأسعار بالدولار الأمريكي (USD) أو الليرة السورية (SYP).
              </li>
            </ul>
          </section>

          <section id="property-listings">
            <h2>6. قوائم العقارات والحجوزات</h2>
            <h3>6.1 معلومات العقار</h3>
            <p>
              نسعى جاهدين لتوفير معلومات دقيقة عن العقارات، ولكننا لا نضمن دقة أو اكتمال أو موثوقية
              أي قائمة عقارات. تفاصيل العقار والأسعار والتوفر عرضة للتغيير دون إشعار.
            </p>
            <h3>6.2 عملية الحجز</h3>
            <p>عند إجراء حجز:</p>
            <ul>
              <li>توافق على دفع السعر الإجمالي كما هو معروض وقت الحجز.</li>
              <li>مطلوب عربون (عادة 30% من الإجمالي) لتأكيد الحجز.</li>
              <li>الرصيد المتبقي مستحق وفقاً لشروط مالك العقار.</li>
              <li>الحجوزات خاضعة للتوفر وموافقة مالك العقار.</li>
            </ul>
          </section>

          <section id="user-accounts">
            <h2>7. حسابات المستخدمين</h2>
            <h3>7.1 التسجيل</h3>
            <p>لاستخدام ميزات معينة من الخدمة، يجب التسجيل للحصول على حساب. توافق على:</p>
            <ul>
              <li>تقديم معلومات دقيقة وحديثة وكاملة</li>
              <li>الحفاظ على معلوماتك وتحديثها لتبقى دقيقة</li>
              <li>الحفاظ على أمان بيانات اعتماد حسابك</li>
              <li>تحمل المسؤولية عن جميع الأنشطة تحت حسابك</li>
            </ul>
            <h3>7.2 إنهاء الحساب</h3>
            <p>
              نحتفظ بالحق في تعليق أو إنهاء حسابك إذا انتهكت هذه الشروط أو شاركت في أنشطة احتيالية
              أو مسيئة أو غير قانونية.
            </p>
          </section>

          <section id="user-conduct">
            <h2>8. سلوك المستخدم</h2>
            <p>توافق على عدم:</p>
            <ul>
              <li>استخدام الخدمة لأي غرض غير قانوني أو غير مصرح به</li>
              <li>انتهاك أي قوانين في ولايتك القضائية</li>
              <li>التعدي على حقوق الآخرين</li>
              <li>نقل أي كود ضار أو فيروسات أو برامج ضارة</li>
              <li>محاولة الحصول على وصول غير مصرح به إلى الخدمة</li>
              <li>انتحال شخصية أي شخص أو كيان</li>
              <li>التدخل في الخدمة أو تعطيلها</li>
            </ul>
          </section>

          <section id="intellectual-property">
            <h2>9. الملكية الفكرية</h2>
            <p>
              جميع المحتويات على الخدمة، بما في ذلك النصوص والرسومات والشعارات والصور والبرمجيات،
              هي ملك لـ Dama Home Realty أو موردي المحتوى الخاص بها ومحمية بموجب قوانين حقوق النشر
              والملكية الفكرية الأخرى.
            </p>
          </section>

          <section id="disclaimers">
            <h2>10. إخلاء المسؤولية</h2>
            <p>
              يتم توفير الخدمة "كما هي" و"كما هو متاح" دون ضمانات من أي نوع، صريحة أو ضمنية.
              لا نضمن أن الخدمة ستكون غير متقطعة أو خالية من الأخطاء أو آمنة.
            </p>
          </section>

          <section id="limitation-liability">
            <h2>11. تحديد المسؤولية</h2>
            <p>
              إلى أقصى حد يسمح به القانون، لن تكون Dama Home Realty مسؤولة عن أي أضرار غير مباشرة
              أو عرضية أو خاصة أو تبعية أو عقابية ناشئة عن استخدامك للخدمة.
            </p>
          </section>

          <section id="governing-law">
            <h2>12. القانون الحاكم</h2>
            <p>
              تخضع هذه الشروط وتفسر وفقاً لقوانين سوريا، دون اعتبار لأحكام قانون النزاع.
              أي نزاع ينشأ عن هذه الشروط سيتم حله في محاكم سوريا المختصة.
            </p>
          </section>

          <section id="changes-terms">
            <h2>13. تغييرات الشروط</h2>
            <p>
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنقوم بإخطار المستخدمين بأي تغييرات جوهرية
              من خلال نشر الشروط المحدثة على هذه الصفحة. استمرار استخدامك للخدمة بعد هذه التغييرات
              يشكل قبولاً للشروط الجديدة.
            </p>
          </section>

          <section id="contact-terms">
            <h2>14. معلومات الاتصال</h2>
            <p>إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا:</p>
            <ul>
              <li>
                <strong>البريد الإلكتروني:</strong>{' '}
                <a href="mailto:legal@damahomerealty.com">legal@damahomerealty.com</a>
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
          <section id="acceptance">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Dama Home Realty's platform ("the Service"), you accept and agree
              to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
              please do not use our Service.
            </p>
          </section>

          <section id="legal-capacity">
            <h2>2. Legal Capacity</h2>
            <h3>2.1 Age and Identification</h3>
            <p>
              Users must be <strong>18 years of age or older</strong> and hold valid identification
              (Syrian ID card or passport) to use our services.
            </p>
            <ul>
              <li>ID copy must be provided upon registration.</li>
              <li>We reserve the right to verify the validity of provided identification.</li>
              <li>Service use by minors under 18 is prohibited.</li>
            </ul>
            <p className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <strong>Important:</strong> Use of the Service by a legally ineligible person constitutes
              a violation of these Terms and may result in account cancellation and legal action.
            </p>
          </section>

          <section id="security-clearance">
            <h2>3. Security Approvals (for Furnished Rentals)</h2>
            <h3>3.1 Security Clearance Requirements</h3>
            <p>
              For furnished rentals, the tenant <strong>MUST provide valid copies of ID/Passport</strong>
              for security clearance required by Syrian authorities.
            </p>
            <ul>
              <li>
                <strong>Mandatory document submission:</strong> Tenant must provide clear copies of:
                <ul className="mt-2 ml-4">
                  <li>Syrian ID card or passport</li>
                  <li>Additional documents as may be required by authorities</li>
                </ul>
              </li>
              <li>
                <strong>Right to refuse:</strong> The company has the right to refuse rental if security
                clearance is denied by competent authorities.
              </li>
              <li>
                <strong>Processing time:</strong> Security clearance process may take several business days.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
              <strong>Legal Notice:</strong> These requirements are mandatory under Syrian laws and
              regulations regarding furnished property rentals. Failure to provide required documents
              or denial of security clearance results in automatic booking cancellation.
            </p>
          </section>

          <section id="inspection">
            <h2>4. Physical Inspection (المعاينة النافية للجهالة)</h2>
            <h3>4.1 Importance of Physical Inspection</h3>
            <p>
              Digital photos displayed on the website are <strong>for illustration purposes only</strong>
              and do not constitute a final or binding description of the property. The tenant/buyer
              acknowledges the necessity of conducting a <strong>physical inspection</strong>
              (المعاينة النافية للجهالة) of the property before signing any contract.
            </p>
            <ul>
              <li>
                <strong>Responsibility:</strong> Tenant/buyer is responsible for personally inspecting
                the property before signing.
              </li>
              <li>
                <strong>No reliance on photos:</strong> Digital photos alone cannot be relied upon
                as a basis for decision.
              </li>
              <li>
                <strong>Booking inspection:</strong> Inspection appointments can be booked through
                the website or by contacting us.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <strong>Legal Note:</strong> المعاينة النافية للجهالة is an important legal principle
              in Syrian law ensuring both parties have full knowledge of the property's condition
              before completing the transaction.
            </p>
          </section>

          <section id="pricing">
            <h2>5. Pricing</h2>
            <h3>5.1 Nature of Displayed Prices</h3>
            <p>
              Prices displayed on the website are <strong>indicative only</strong> and subject to
              change until the final contract is signed. The final binding price is that mentioned
              in the contract signed between parties.
            </p>
            <ul>
              <li>
                <strong>Subject to change:</strong> Prices may change without prior notice until the
                moment of signing.
              </li>
              <li>
                <strong>Final price:</strong> Only the price mentioned in the signed contract is binding.
              </li>
              <li>
                <strong>Currency:</strong> Prices may be displayed in US Dollars (USD) or Syrian Pounds (SYP).
              </li>
            </ul>
          </section>

          <section id="property-listings">
            <h2>6. Property Listings and Bookings</h2>
            <h3>6.1 Property Information</h3>
            <p>
              We strive to provide accurate property information, but we do not guarantee the accuracy,
              completeness, or reliability of any property listings. Property details, prices, and
              availability are subject to change without notice.
            </p>
            <h3>6.2 Booking Process</h3>
            <p>When you make a booking:</p>
            <ul>
              <li>You agree to pay the total price as displayed at the time of booking</li>
              <li>A deposit (typically 30% of the total) is required to confirm your booking</li>
              <li>The remaining balance is due according to the property owner's terms</li>
              <li>Bookings are subject to availability and property owner approval</li>
            </ul>
          </section>

          <section id="user-accounts">
            <h2>7. User Accounts</h2>
            <h3>7.1 Registration</h3>
            <p>To use certain features of the Service, you must register for an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
            <h3>7.2 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms or
              engage in fraudulent, abusive, or illegal activity.
            </p>
          </section>

          <section id="user-conduct">
            <h2>8. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful code, viruses, or malware</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the Service</li>
            </ul>
          </section>

          <section id="intellectual-property">
            <h2>9. Intellectual Property</h2>
            <p>
              All content on the Service, including text, graphics, logos, images, and software, is the
              property of Dama Home Realty or its content suppliers and is protected by copyright and
              other intellectual property laws.
            </p>
          </section>

          <section id="disclaimers">
            <h2>10. Disclaimers</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
              EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              ERROR-FREE, OR SECURE.
            </p>
          </section>

          <section id="limitation-liability">
            <h2>11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DAMA HOME REALTY SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE
              OF THE SERVICE.
            </p>
          </section>

          <section id="governing-law">
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Syria,
              without regard to its conflict of law provisions. Any dispute arising from these Terms
              shall be resolved in competent Syrian courts.
            </p>
          </section>

          <section id="changes-terms">
            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any
              material changes by posting the updated Terms on this page. Your continued use of the
              Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section id="contact-terms">
            <h2>14. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@damahomerealty.com">legal@damahomerealty.com</a>
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
