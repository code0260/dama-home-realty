'use client';

import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { useLanguage } from '@/components/providers/LanguageProvider';

const lastUpdated = '2026-01-30';

const versions = [
  {
    version: '2.0',
    date: '2026-01-30',
    changes: [
      'Updated to comply with Syrian Civil Law (Article 104)',
      'Renamed to Booking, Deposit & Cancellation Policy',
      'Added specific terms for sales, tourist rentals, and brokerage fees',
    ],
    isCurrent: true,
  },
  {
    version: '1.0',
    date: '2024-01-15',
    changes: ['Initial version'],
  },
];

export default function RefundPolicyPage() {
  const { t, locale } = useLanguage();
  const isArabic = locale === 'ar';

  const title = isArabic
    ? 'سياسة الحجز والعربون والإلغاء'
    : 'Booking, Deposit & Cancellation Policy';

  const description = isArabic
    ? 'تحدد هذه السياسة شروط الحجز والعربون والإلغاء لجميع المعاملات العقارية وفقاً للقانون المدني السوري.'
    : 'This policy outlines the terms for bookings, deposits, and cancellations for all real estate transactions in accordance with Syrian Civil Law.';

  return (
    <LegalPageLayout
      title={title}
      lastUpdated={lastUpdated}
      versions={versions}
      description={description}
    >
      {isArabic ? (
        <>
          <section id="overview">
            <h2>1. المقدمة</h2>
            <p>
              تحكم هذه السياسة جميع معاملات الحجز والعربون والإلغاء في مكتب Dama Home Realty.
              تخضع جميع المعاملات العقارية للقانون المدني السوري والعقود الموقعة بين الأطراف.
              يرجى قراءة هذه السياسة بعناية قبل إتمام أي حجز أو معاملة.
            </p>
            <p className="font-semibold text-primary mt-4">
              <strong>القاعدة العامة:</strong> جميع المعاملات العقارية تحكمها العقود الموقعة بين الأطراف المعنية.
            </p>
          </section>

          <section id="sales">
            <h2>2. معاملات البيع (البيع)</h2>
            <h3>2.1 العربون في معاملات البيع</h3>
            <p>
              في معاملات بيع العقارات، يعتبر العربون (المقدم) تأكيداً على نية الشراء من قبل المشتري.
              وفقاً للمادة <strong>104 من القانون المدني السوري</strong>، إذا انسحب المشتري من الصفقة،
              فإن العربون المدفوع يكون غير قابل للاسترجاع.
            </p>
            <ul>
              <li>
                <strong>إذا انسحب المشتري:</strong> العربون المدفوع يبقى للمالك ولا يتم استرجاعه.
              </li>
              <li>
                <strong>إذا انسحب البائع:</strong> يجب على البائع إرجاع ضعف العربون المدفوع للمشتري.
              </li>
              <li>
                <strong>إذا تمت الصفقة بنجاح:</strong> يتم احتساب العربون كجزء من السعر الإجمالي.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border-r-4 border-amber-500 rounded">
              <strong>ملاحظة قانونية:</strong> هذه الشروط تتماشى مع المادة 104 من القانون المدني السوري
              التي تنظم أحكام العربون في عقود البيع.
            </p>
          </section>

          <section id="tourist-rental">
            <h2>3. الإيجار السياحي (الفندقي)</h2>
            <h3>3.1 شروط الإلغاء</h3>
            <p>تطبق الشروط التالية على حجوزات الإيجار السياحي:</p>

            <h4>3.1.1 الإلغاء قبل 72 ساعة من الوصول</h4>
            <p>
              إذا تم الإلغاء <strong>أكثر من 72 ساعة</strong> قبل تاريخ الوصول المحدد:
            </p>
            <ul>
              <li>يتم استرجاع <strong>كامل العربون</strong> المدفوع.</li>
              <li>لا توجد رسوم إلغاء.</li>
            </ul>

            <h4>3.1.2 الإلغاء خلال 72 ساعة من الوصول</h4>
            <p>
              إذا تم الإلغاء <strong>أقل من 72 ساعة</strong> قبل تاريخ الوصول:
            </p>
            <ul>
              <li>يتم خصم <strong>رسوم ليلة واحدة</strong> من العربون المدفوع.</li>
              <li>يتم استرجاع باقي المبلغ.</li>
            </ul>

            <h4>3.1.3 عدم الحضور (No-Show)</h4>
            <p>
              في حالة عدم الحضور في التاريخ المحدد دون إشعار مسبق:
            </p>
            <ul>
              <li>يتم احتجاز <strong>كامل مبلغ الحجز أو العربون</strong> المدفوع.</li>
              <li>لا يتم استرجاع أي مبلغ.</li>
            </ul>
          </section>

          <section id="brokerage-fees">
            <h2>4. عمولة المكتب (الوساطة العقارية)</h2>
            <h3>4.1 شروط دفع العمولة</h3>
            <p>
              عمولة المكتب العقاري مستحقة عند توقيع العقد النهائي بين الأطراف.
              بمجرد توقيع العقد، تصبح العمولة مستحقة الدفع وغير قابلة للاسترجاع.
            </p>
            <ul>
              <li>
                <strong>عند توقيع العقد:</strong> تصبح عمولة المكتب مستحقة الدفع فوراً.
              </li>
              <li>
                <strong>في حالة الإلغاء:</strong> لا يتم استرجاع عمولة المكتب حتى في حالة إلغاء الصفقة لاحقاً.
              </li>
              <li>
                <strong>نسبة العمولة:</strong> يتم تحديدها مسبقاً في اتفاقية الوساطة الموقعة.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-blue-50 border-r-4 border-blue-500 rounded">
              <strong>مهم:</strong> عمولة المكتب هي أجر عن خدمة الوساطة المقدمة،
              وتستحق عند إتمام عملية الوساطة (توقيع العقد)، بغض النظر عن ما يحدث لاحقاً.
            </p>
          </section>

          <section id="processing">
            <h2>5. معالجة الاسترجاعات</h2>
            <h3>5.1 وقت المعالجة</h3>
            <p>
              في الحالات التي يكون فيها الاسترجاع مسموحاً، يتم معالجة طلب الاسترجاع خلال
              <strong> 5-10 أيام عمل</strong> بعد الموافقة عليه.
            </p>
            <h3>5.2 طريقة الاسترجاع</h3>
            <p>
              يتم استرجاع المبلغ إلى نفس طريقة الدفع المستخدمة في الحجز الأصلي.
              في حالة الدفع نقداً، يتم التنسيق مع العميل لاسترجاع المبلغ.
            </p>
          </section>

          <section id="disputes">
            <h2>6. حل النزاعات</h2>
            <p>
              في حالة وجود أي نزاع بخصوص سياسة الاسترجاع، يرجى التواصل معنا على:
            </p>
            <ul>
              <li>
                <strong>البريد الإلكتروني:</strong>{' '}
                <a href="mailto:legal@damahomerealty.com">legal@damahomerealty.com</a>
              </li>
              <li>
                <strong>الهاتف:</strong>{' '}
                <a href="tel:+963932498092">+963 932 498 092</a>
              </li>
            </ul>
            <p className="mt-4">
              سيتم مراجعة طلبك والرد عليه خلال <strong>5 أيام عمل</strong>.
            </p>
          </section>

          <section id="governing-law">
            <h2>7. القانون الحاكم</h2>
            <p>
              تخضع هذه السياسة للقانون المدني السوري، وخاصة المادة 104 المتعلقة بأحكام العربون.
              في حالة وجود أي تعارض بين هذه السياسة والقانون السوري، يطبق القانون السوري.
            </p>
          </section>

          <section id="contact">
            <h2>8. التواصل معنا</h2>
            <p>للاستفسارات حول سياسة الحجز والعربون والإلغاء، يرجى التواصل معنا:</p>
            <ul>
              <li>
                <strong>البريد الإلكتروني:</strong>{' '}
                <a href="mailto:support@damahomerealty.com">support@damahomerealty.com</a>
              </li>
              <li>
                <strong>الهاتف:</strong>{' '}
                <a href="tel:+963932498092">+963 932 498 092</a>
              </li>
              <li>
                <strong>العنوان:</strong> دمشق، حي المزرعة، شارع أسامة بن زيد، دخلة العاصي.
              </li>
            </ul>
          </section>
        </>
      ) : (
        <>
          <section id="overview">
            <h2>1. Introduction</h2>
            <p>
              This policy governs all booking, deposit, and cancellation transactions at Dama Home Realty.
              All real estate transactions are subject to Syrian Civil Law and contracts signed between parties.
              Please read this policy carefully before completing any booking or transaction.
            </p>
            <p className="font-semibold text-primary mt-4">
              <strong>General Rule:</strong> All real estate transactions are governed by contracts signed between the concerned parties.
            </p>
          </section>

          <section id="sales">
            <h2>2. Sales Transactions (البيع)</h2>
            <h3>2.1 Deposit in Sales Transactions</h3>
            <p>
              In real estate sales transactions, the deposit (العربون) is a confirmation of the buyer's intent to purchase.
              According to <strong>Article 104 of the Syrian Civil Law</strong>, if the buyer withdraws from the transaction,
              the paid deposit is non-refundable.
            </p>
            <ul>
              <li>
                <strong>If the buyer withdraws:</strong> The paid deposit remains with the owner and is not refunded.
              </li>
              <li>
                <strong>If the seller withdraws:</strong> The seller must return double the paid deposit to the buyer.
              </li>
              <li>
                <strong>If the transaction succeeds:</strong> The deposit is counted as part of the total price.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
              <strong>Legal Note:</strong> These terms comply with Article 104 of the Syrian Civil Law
              which regulates deposit provisions in sales contracts.
            </p>
          </section>

          <section id="tourist-rental">
            <h2>3. Tourist Rental (الإيجار السياحي)</h2>
            <h3>3.1 Cancellation Terms</h3>
            <p>The following terms apply to tourist rental bookings:</p>

            <h4>3.1.1 Cancellation More Than 72 Hours Before Arrival</h4>
            <p>
              If cancellation occurs <strong>more than 72 hours</strong> before the scheduled arrival date:
            </p>
            <ul>
              <li><strong>Full deposit refund</strong> is provided.</li>
              <li>No cancellation fees apply.</li>
            </ul>

            <h4>3.1.2 Cancellation Within 72 Hours of Arrival</h4>
            <p>
              If cancellation occurs <strong>less than 72 hours</strong> before the scheduled arrival:
            </p>
            <ul>
              <li><strong>One night's rental fee</strong> is deducted from the paid deposit.</li>
              <li>The remaining amount is refunded.</li>
            </ul>

            <h4>3.1.3 No-Show</h4>
            <p>
              In case of no-show on the scheduled date without prior notice:
            </p>
            <ul>
              <li>The <strong>full booking amount or deposit</strong> is forfeited.</li>
              <li>No refund is provided.</li>
            </ul>
          </section>

          <section id="brokerage-fees">
            <h2>4. Brokerage Fees (عمولة المكتب)</h2>
            <h3>4.1 Brokerage Fee Payment Terms</h3>
            <p>
              Brokerage fees are due upon signing the final contract between parties.
              Once the contract is signed, the brokerage fee becomes due and non-refundable.
            </p>
            <ul>
              <li>
                <strong>Upon contract signing:</strong> The brokerage fee becomes immediately due.
              </li>
              <li>
                <strong>In case of cancellation:</strong> The brokerage fee is not refunded even if the transaction is later cancelled.
              </li>
              <li>
                <strong>Fee percentage:</strong> Determined in advance in the signed brokerage agreement.
              </li>
            </ul>
            <p className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <strong>Important:</strong> The brokerage fee is compensation for the brokerage service provided,
              and is due upon completion of the brokerage process (contract signing), regardless of subsequent events.
            </p>
          </section>

          <section id="processing">
            <h2>5. Refund Processing</h2>
            <h3>5.1 Processing Time</h3>
            <p>
              In cases where refunds are permitted, refund requests are processed within
              <strong> 5-10 business days</strong> after approval.
            </p>
            <h3>5.2 Refund Method</h3>
            <p>
              Refunds are issued to the same payment method used for the original booking.
              For cash payments, coordination with the client is made for refund collection.
            </p>
          </section>

          <section id="disputes">
            <h2>6. Dispute Resolution</h2>
            <p>
              In case of any dispute regarding the refund policy, please contact us at:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@damahomerealty.com">legal@damahomerealty.com</a>
              </li>
              <li>
                <strong>Phone:</strong>{' '}
                <a href="tel:+963932498092">+963 932 498 092</a>
              </li>
            </ul>
            <p className="mt-4">
              Your request will be reviewed and responded to within <strong>5 business days</strong>.
            </p>
          </section>

          <section id="governing-law">
            <h2>7. Governing Law</h2>
            <p>
              This policy is subject to Syrian Civil Law, particularly Article 104 regarding deposit provisions.
              In case of any conflict between this policy and Syrian law, Syrian law shall apply.
            </p>
          </section>

          <section id="contact">
            <h2>8. Contact Us</h2>
            <p>For inquiries about the booking, deposit, and cancellation policy, please contact us:</p>
            <ul>
              <li>
                <strong>Email:</strong>{' '}
                <a href="mailto:legal@damahomerealty.com">legal@damahomerealty.com</a>
              </li>
              <li>
                <strong>Phone:</strong>{' '}
                <a href="tel:+963932498092">+963 932 498 092</a>
              </li>
              <li>
                <strong>Address:</strong> Damascus, Al-Mazraa, Osama Bin Zaid St., Al-Assi Entrance.
              </li>
            </ul>
          </section>
        </>
      )}
    </LegalPageLayout>
  );
}
