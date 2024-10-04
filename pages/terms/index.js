import React from 'react';
import classNames from 'classnames';
import Head from 'next/head';
import Link from 'next/link';

import styled from '@emotion/styled';

const StyledTerms = styled.div`
  background: white;
  body {
    color: var(--color-text);
  }

  li {
    padding-left: 16px;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  p {
    line-height: 1.5;
  }

  b {
    font-weight: 800;
  }

  .container {
    display: flex;
    justify-content: center;
    margin-top: 120px;
    margin-bottom: 120px;
  }

  .document {
    margin: 24px;
    /* padding: 20px 72px; */
    max-width: 800px;
    background-color: var(--color-white);
    font-size: 14px;
  }

  .numberedList {
    list-style-type: decimal;
  }

  .decimalList {
    padding-left: 0px;
  }

  .decimalList.noTab {
    margin-left: -34px;
  }

  .decimalList > li {
    list-style-type: none;
    display: flex;
    padding-left: 0;
  }

  .decimalList > li > .content {
    flex: 1;
    margin-left: 16px;
  }

  .decimalList .mt16 {
    margin-top: 16px;
  }

  .alphaList {
    list-style-type: lower-alpha;
  }

  .doubleDigitList {
    margin-left: 9px;
  }

  .doubleDigitList .noTab {
    margin-left: -43px;
  }

  table {
    border-collapse: collapse;
  }

  th {
    background-color: #e5e5e5;
    text-align: left;
    font-weight: 800;
  }

  td,
  th {
    border: 1px solid #ddd;
    padding: 8px;
  }
  a {
    color: blue;
  }

  .backBtn {
    text-decoration: none;
  }

  @media (max-width: 480px) {
    .document {
      padding: 48px 24px;
    }
  }
`;

// TO-DO 110,
export default function Terms() {
  return (
    <StyledTerms>
      <Head>
        <title>AIDOL Assistant - Privacy</title>
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/terms/`} />
      </Head>
      <div className="container">
        <div
          style={{
            position: 'fixed',
            top: '48px',
            left: '48px',
            borderRadius: '24px',
            border: '2px solid gray',
            padding: '8px 16px',
          }}
        >
          <Link
            className="backBtn"
            style={{
              fontFamily: 'Lexend',
              color: 'black',
            }}
            href={`/`}
          >
            Back To Assistant
          </Link>
        </div>
        <div className="document">
          <p>
            <b>TERMS OF USE</b>
          </p>
          <br />
          <ul className="numberedList">
            <li>
              <p>
                <b>Introduction</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    “AIDOL Assistant”, “we”, “our”, “us” is Pantheon Lab Limited along with Pantheon
                    Lab’s subsidiaries and affiliates, their respective directors, officers,
                    employees, licensees, contractors, attorneys, agents, successors, and assigns.
                  </div>
                </li>
                <li>
                  <div>
                    “User”, “you” or “your” is either: i) a business properly registered in your
                    jurisdiction that visits our website or uses any product or service made
                    available through the Platform including the business’ respective directors,
                    officers, employees, licensees, contractors, attorneys, agents, successors and
                    assigns (“Business Customer”); or ii) a private individual that visits our
                    website or uses any products or service made available through the Platform
                    (“Consumer”).
                  </div>
                </li>
                <li>
                  <div>
                    These Terms of Service (“Terms”) govern your use of our web pages located at
                    aidol.studio (the “Site”), services and products accessible through the Site
                    (“Services”) and the associated web-based software provided by AIDOL Assistant
                    (“Software”). The Site, the Services, and the Software are jointly referred to
                    as the “Platform”. Our Privacy Policy, available at{' '}
                    <Link href="/privacy" aria-label="AIDOL Assistant privacy">
                      {`${process.env.NEXT_PUBLIC_FRONTEND_URL}/privacy`}
                    </Link>
                    , explains how we collect, safeguard, and disclose information that results from
                    your use of the Platform.
                  </div>
                </li>
                <li>
                  <div>
                    If you are using the Platform as a Business Customer, our processing of personal
                    data you provide us during your use of the Platform is further regulated by our
                    Data Processing Agreement (“DPA”) available here{' '}
                    <Link
                      href="/terms/data-processing-agreement"
                      aria-label="AIDOL Assistant Data Processing Agreement"
                    >
                      {`${process.env.NEXT_PUBLIC_FRONTEND_URL}/terms/data-processing-agreement`}
                    </Link>
                    . The DPA represents an integral part of the Terms for Business Customers. If
                    you are using the Platform as a private individual the DPA does not apply.
                  </div>
                </li>
                <li>
                  <div>
                    By accessing and using the Platform you acknowledge that you have read and
                    understood the Terms, our Privacy Policy, and where applicable the DPA, and
                    agree to be bound by them. If you do not agree with (or cannot comply with) the
                    above, then you may not use (and must immediately stop using) the Platform, but
                    please let us know by emailing at{' '}
                    <a href="mailto:support@aidol.studio" aria-label="Contact us">
                      support@aidol.studio
                    </a>{' '}
                    so we can try to find a solution. These Terms apply to all visitors, Users and
                    others who wish to access or use the Platform.
                  </div>
                </li>
                <li>
                  <div>Thank you for being responsible.</div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>No Use By Minors</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    The Platform is intended only for access and use by individuals at least
                    eighteen (18) years old.
                  </div>
                </li>
                <li>
                  <div>
                    By accessing or using the Platform, you warrant and represent that you are at
                    least eighteen (18) years of age and with the full authority, right, and
                    capacity to enter into this agreement and abide by all of the terms and
                    conditions of these Terms. If you are not at least eighteen (18) years old, you
                    are prohibited from both the access and usage of the Platform and should
                    immediately stop using the Platform.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Communications</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    If you register on the Platform we will use your email address to send you
                    important Service emails including password resets, purchase confirmations, data
                    breach warnings, as well as marketing emails with information about the Services
                    including information on how to create content, introduction of new
                    functionalities and promotions. You may opt-out of the marketing emails by
                    accessing your account settings on the Platform or by following the unsubscribe
                    link in the emails you receive. We will not send you marketing emails about any
                    third-party product or service without obtaining your explicit prior consent.
                  </div>
                </li>
                <li>
                  <div>
                    For additional information about how we protect your privacy, please refer to
                    our Privacy Policy at{' '}
                    <Link href="/privacy" aria-label="AIDOL Assistant Privacy Policy">
                      {`${process.env.NEXT_PUBLIC_FRONTEND_URL}/privacy`}
                    </Link>
                    .
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Purchases</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    If you wish to purchase any product or service made available through the
                    Platform (“Purchase”), you may be asked to supply certain information relevant
                    to your Purchase including, without limitation, your credit card number, the
                    expiration date of your credit card, and your billing address.
                  </div>
                </li>
                <li>
                  <div>
                    You represent and warrant that: (i) you have the legal right to use any credit
                    card(s) or other payment method(s) in connection with any Purchase; and (ii) the
                    information you supply to us is true, correct, accurate and complete.
                  </div>
                </li>
                <li>
                  <div>
                    We may employ the use of third-party services for the purpose of facilitating
                    payment and the completion of Purchases. By submitting your payment information,
                    you understand and agree that we may share that information with these third
                    parties subject to our Privacy Policy.
                  </div>
                </li>
                <li>
                  <div>
                    Your Purchase is not confirmed until you receive a confirmation email from us.
                    In particular, we reserve the right to reject your Purchase due to product or
                    service unavailability, or if fraud or an unauthorised or illegal transaction is
                    suspected.
                  </div>
                </li>
                <li>
                  <div>
                    All prices shown on the Platform are as a standard denominated in USD. We may
                    determine to show the prices in the currency that AIDOL Assistant determines to
                    be your local currency. All prices shown to Consumers include applicable sales
                    taxes at the rate that is in force from time to time.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Contests, Sweepstakes and Promotions</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    Any contests, sweepstakes, or other promotions (collectively, “Promotions”) made
                    available through the Platform may be governed by rules that are in addition to
                    or separate from these Terms. If you participate in any Promotions, please
                    review the applicable rules as they become available with the applicable
                    Promotion as well as our Privacy Policy. If the rules for a Promotion conflict
                    with these Terms, the rules governing the Promotion will prevail.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Subscriptions</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    Some Services are subject to payments. Paid Services are usually provided on a
                    recurring subscription basis (“Subscription(s)”), but we may also provide them
                    on a fixed-term basis (“Fixed Term”), or as one-time payment add-ons
                    (“Add-on(s)”). Fixed Term Services are paid against the invoice according to the
                    payment terms agreed separately. Unless otherwise agreed, Subscription payment
                    terms shall not apply to Fixed Term Services. If you are interested in Fixed
                    Term Services, please contact us. Subscriptions are billed in advance on a
                    recurring and periodic basis (“Billing Cycle”). Details of the relevant Billing
                    Cycle will be displayed to you at check-out.
                  </div>
                </li>
                <li>
                  <div>
                    At the end of each Billing Cycle, your Subscription will automatically renew
                    unless you cancel it or AIDOL Assistant cancels it. If your Subscription is on
                    an annual basis, we will let you know at least fifteen (15) days in advance of
                    any automatic renewal in order to give you the opportunity to cancel your
                    Subscription. You may cancel your Subscription renewal either through your
                    online account management page or by contacting our customer support team before
                    the renewal takes effect.
                  </div>
                </li>
                <li>
                  <div>
                    A valid payment method, including credit card, is required to process the
                    payment for your Subscription and Add-on(s). You shall provide AIDOL Assistant
                    with accurate and complete billing information including full name, address,
                    state, zip code, telephone number, VAT number (if applicable) and a valid
                    payment method information. By submitting such payment information, you
                    automatically authorise AIDOL Assistant to charge all Subscription and Add-on
                    fees to which you have agreed and incurred through your account, to any such
                    payment instruments.
                  </div>
                </li>
                <li>
                  <div>
                    Should automatic billing fail to occur for any reason, AIDOL Assistant may (but
                    does not have an obligation to) issue an electronic invoice indicating that you
                    must proceed manually, within a certain deadline date, with the full payment
                    corresponding to the billing period as indicated on the invoice. We reserve the
                    right to terminate your Subscription in the event we are unable to collect a
                    relevant payment from you (whether automatically or manually) as and when such
                    relevant payment is due. Where that happens, we will inform you of the
                    termination of your Subscription via email.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Free Trial</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    We may, at our sole discretion, offer a Subscription with a free trial for a
                    limited period of time (“Free Trial”).
                  </div>
                </li>
                <li>
                  <div>
                    You may be required to enter your billing information in order to sign up for a
                    Free Trial. If you do enter your billing information when signing up for Free
                    Trial, you will not be charged by AIDOL Assistant until your Free Trial has
                    expired. On the last day of the Free Trial period, unless you cancelled your
                    Subscription, you will be automatically charged the applicable Subscription fees
                    without further notice for the type of Subscription you have selected.
                  </div>
                </li>
                <li>
                  <div>
                    At any time before the start of your Free Trial and without notice, AIDOL
                    Assistant reserves the right to (i) modify the terms applicable to any Free
                    Trial offer, or (ii) cancel such Free Trial offer.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Fee Changes</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    AIDOL Assistant, in its sole discretion and at any time, may modify Subscription
                    fees for the Subscriptions. We will inform you of any change to your
                    Subscription fees at least thirty (30) days in advance to give you an
                    opportunity to terminate your Subscription before such change becomes effective.
                    Any Subscription fee change will become effective immediately upon publishing,
                    or, if you have an active Subscription, at the end of your then current Billing
                    Cycle.
                  </div>
                </li>
                <li>
                  <div>
                    Your continued use of a Subscription after a Subscription fee change comes into
                    effect constitutes your agreement to pay the revised Subscription fee amount.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Refunds</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    If you make any Purchase on the Platform as a Consumer, you have the right to
                    request a refund of the applicable Purchase price without providing a reason at
                    any time within fifteen (15) days of the original date of purchase. As your
                    Purchase can be used by you immediately, we reserve the right to only issue a
                    pro-rated refund which reflects the amount of time you have enjoyed the Purchase
                    before claiming a refund.
                  </div>
                </li>
                <li>
                  <div>
                    To request a refund (or partial refund), please contact us by using the contact
                    details at the bottom of these Terms. We will issue any refund as soon as
                    possible to the payment method used for the original Purchase.
                  </div>
                </li>
                <li>
                  <div>Refunds do not apply to Business Customers.</div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Software license and Content</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    Subject to your compliance with these Terms, and during your active
                    Subscription, AIDOL Assistant grants you a limited, non-exclusive,
                    non-transferable, non-sublicensable licence to access and use the Software.
                    Except as expressly permitted in these Terms, you may not:
                  </div>
                </li>
                <li>
                  <div>
                    • decompile, reverse engineer, disassemble, attempt to derive the source code
                    of, or decrypt the Software;
                  </div>
                </li>
                <li>
                  <div>
                    • make any modification, adaptation, improvement, enhancement, translation, or
                    derivative work from the Software;
                  </div>
                </li>
                <li>
                  <div>
                    • violate any applicable laws, rules, or regulations in connection with your
                    access or use of the Software;
                  </div>
                </li>
                <li>
                  <div>
                    • remove, alter, or obscure any proprietary notice (including any notice of
                    copyright or trademark) posted by AIDOL Assistant or the licensors of the
                    Software;
                  </div>
                </li>
                <li>
                  <div>
                    • use the Software for any purpose for which it is not designed or intended;
                  </div>
                </li>
                <li>
                  <div>
                    • use the Software for creating a product, service, or software that is,
                    directly or indirectly, competitive with or in any way a substitute for the
                    Software; or
                  </div>
                </li>
                <li>
                  <div>
                    • distribute, transfer, sublicence, lease, lend or rent the Software to any
                    third-party;
                  </div>
                </li>
                <li>
                  <div>
                    Our Platform allows you to post, link, store, share and otherwise make available
                    certain information, text, graphics, videos, or other material (referred to as
                    “Your Content”), and also allows you to create or generate graphics, videos or
                    other material (referred to as “User Generated Content”).
                  </div>
                </li>
                <li>
                  <div>
                    You are responsible for Your Content and User Generated Content, including its
                    legality, reliability, and appropriateness.
                  </div>
                </li>
                <li>
                  <div>
                    By posting or creating content on or through the Platform, you represent and
                    warrant that: (i) Your Content is yours (you own it) and/or you have the right
                    to use it and the right to grant us the rights and licence as provided in these
                    Terms, and (ii) the posting of Your Content on or through the Platform does not
                    violate the privacy rights, publicity rights, copyrights, contract rights,
                    intellectual property rights or any other rights of any person or entity. We
                    reserve the right to terminate your account in the event you infringe this
                    provision.
                  </div>
                </li>
                <li>
                  <div>
                    You retain any and all of your rights to any content you submit, post, display
                    or create on or through the Platform and you are responsible for protecting
                    those rights. We take no responsibility and assume no liability for content you
                    post or create on or through the Platform.
                  </div>
                </li>
                <li>
                  <div>
                    For the purposes of these Terms “AIDOL Assistant Content” refers to all images,
                    text, audio, video data, or any other information located on the Platform or
                    available through the Platform. AIDOL Assistant Content is and will remain the
                    exclusive property of AIDOL Assistant and its licensors. Immediately upon
                    creating the User Generated Content AIDOL Assistant grants you a limited,
                    revocable, non-exclusive, perpetual, worldwide, royalty-free, transferable,
                    sub-licensable licence to use AIDOL Assistant Content in the created User
                    Generated Content. Granted licence is limited by the Acceptable Use Policy
                    requirements and conditioned on the full payment of the applicable Subscription
                    fees. The licence may be revoked only due to the breach of the Acceptable Use
                    Policy. Revoking the licence for the use in User Generated Content that is found
                    in violation of the Acceptable Use Policy will not affect the licence for the
                    non-breaching User Generated Content.
                  </div>
                </li>
                <li>
                  <div>
                    Certain parts of the AIDOL Assistant Content are owned or created by third
                    parties and licenced or transferred through AIDOL Assistant. For example,
                    background images are provided by Pixabay (
                    <a href="https://pixabay.com/service/license" aria-label="Pixabay">
                      https://pixabay.com/service/license
                    </a>
                    ); audio files created through text-to-speech functionality are provided by
                    various integrated text-to-speech services that either grant AIDOL Assistant the
                    sole ownership or an exclusive, sublicensable licence. Licence or ownership
                    granted by third parties to AIDOL Assistant will not restrict the licences
                    provided herein. AIDOL Assistant shall only offer the third-party content that
                    can be licenced to you entirely in accordance with the licence terms specified
                    herein.
                  </div>
                </li>
                <li>
                  <div>
                    AIDOL Assistant has the right but not the obligation to monitor and edit all
                    content submitted by users on the Platform.
                  </div>
                </li>
                <li>
                  <div>
                    By uploading or creating content on or through the Platform, you grant AIDOL
                    Assistant a free of charge, non-exclusive, perpetual, transferable,
                    royalty-free, irrevocable, worldwide licence to: (i) deliver the Platform to
                    you; and (ii) use the content for internal research and development and/or to
                    improve the Platform and any other AIDOL Assistant technology. Where content
                    includes personal information about private individuals this will be further
                    regulated by our Privacy Policy, DPA, or other individual agreement.
                  </div>
                </li>
                <li>
                  <div>
                    You shall ensure that Your Content complies with, and assist AIDOL Assistant to
                    comply with, the requirements of all legislation and regulatory requirements in
                    force from time to time relating to the use of personal data included in Your
                    Content, including (without limitation) any data protection legislation from
                    time to time in force in Hong Kong including the Personal Data (Privacy)
                    Ordinance (Cap. 486 of the Laws of Hong Kong) and any successor legislation. You
                    will collect and process the personal data of all individuals featured in the
                    content in accordance with all applicable laws, including by obtaining any
                    appropriate consents or approvals sufficient for the provision of the Platform
                    by AIDOL Assistant.
                  </div>
                </li>
                <li>
                  <div>You are solely responsible for securing and backing up Your Content.</div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Prohibited Uses – Acceptable Use Policy</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    You agree that you will not misuse the Platform, AIDOL Assistant Content, Your
                    Content or User Generated Content. A misuse constitutes any use, access, or
                    interference with the Platform, AIDOL Assistant Content, Your Content or User
                    Generated Content contrary to these Terms, any other individual agreement
                    executed between you and AIDOL Assistant, and applicable laws and regulations.
                    You will especially not, without limitation, use the Platform, AIDOL Assistant
                    Content, Your Content or User Generated Content:
                  </div>
                </li>
                <li>
                  <div>
                    a. In any way that violates any applicable national or international law or
                    regulation.
                  </div>
                </li>
                <li>
                  <div>
                    b. For the purpose of exploiting, harming, or attempting to exploit or harm
                    minors in any way by exposing them to inappropriate content or otherwise.
                  </div>
                </li>
                <li>
                  <div>
                    c. For the purpose of adult entertainment and/or other incriminating content.
                  </div>
                </li>
                <li>
                  <div>
                    d. To impersonate or attempt to impersonate AIDOL Assistant, a AIDOL Assistant
                    employee, or any other person or entity.
                  </div>
                </li>
                <li>
                  <div>
                    e. In any way that infringes upon the rights of others, or in any way that is
                    obscene, defamatory, immoral, insulting, threatening, fraudulent, bullying,
                    discriminating, or harmful.
                  </div>
                </li>
                <li>
                  <div>
                    f. To engage in any other conduct that interferes with Platform&apos;s security
                    features and restricts or inhibits anyone&apos;s use or enjoyment of the
                    Platform, or which, as reasonably determined by AIDOL Assistant, may harm or
                    offend AIDOL Assistant or other users of the Platform or expose them to
                    liability.
                  </div>
                </li>
                <li>
                  <div>
                    g. Use any robot, spider, or other automatic devices, process, or means without
                    AIDOL Assistant&apos;s prior explicit consent through AIDOL Assistant API, to
                    access the Platform for any purpose, including monitoring or copying any of the
                    material on the Platform.
                  </div>
                </li>
                <li>
                  <div>
                    h. Take any action that may damage or falsify AIDOL Assistant&apos;s ratings or
                    reputation.
                  </div>
                </li>
                <li>
                  <div>
                    The avatars that are not created specifically for you and are already available
                    in the Platform (the “Stock Avatars”) are made based on and bear a life-like
                    resemblance to real people. For this reason, in order to comply with the
                    licensing terms with the actors and to protect the rights and reputation of the
                    actors, additional restrictions apply. In addition to general restrictions, you
                    agree not to use any Stock Avatars (without AIDOL Assistant&apos;s explicit
                    written consent) for the following:
                  </div>
                </li>
                <li>
                  <div>a. In User Generated Content for TV broadcasting. </div>
                </li>
                <li>
                  <div>
                    b. In User Generated Content for &quot;promoted&quot;, &quot;boosted&quot;, or
                    &quot;paid&quot; advertising on any social media platform or similar media.
                  </div>
                </li>
                <li>
                  <div>
                    c. In User Generated Content used as or part of non-fungible tokens (NFTs) or
                    similar.
                  </div>
                </li>
                <li>
                  <div>
                    d. To transmit, or procure the sending of, any advertising or promotional
                    material, including any &quot;junk mail&quot;, &quot;chain letter&quot;,
                    &quot;spam&quot;, or any other similar solicitation.
                  </div>
                </li>
                <li>
                  <div>
                    e. To portray Stock Avatar in User Generated Content in a way that a person
                    would reasonably find offensive, including, but not limited to portraying Stock
                    Avatar as suffering from or medicating for any medical condition, including
                    addiction.
                  </div>
                </li>
                <li>
                  <div>
                    f. To portray Stock Avatar in User Generated Content alongside or in connection
                    with regulated or not age-appropriate goods or services including, but not
                    limited to alcohol, tobacco, nicotine (including vaping products), psychoactive
                    substances, firearms, gambling, contraceptives, sex toys, escort services,
                    dating services, adult entertainment venues and similar.
                  </div>
                </li>
                <li>
                  <div>
                    g. In User Generated Content in which Stock Avatar is making any kind of
                    statement of opinion, including expressing any personal preferences or
                    experiences as if they are Stock Avatar’s preferences or experiences.
                  </div>
                </li>
                <li>
                  <div>
                    h. In User Generated Content in which Stock Avatar is making any kind of
                    statement of fact regarding religion, politics, race, gender, sexuality, or
                    other similar topics that are known to be sensitive to certain demographics.
                  </div>
                </li>
                <li>
                  <div>
                    i. To create trademarks, design-marks, service-marks, or other similar protected
                    or registrable rights.
                  </div>
                </li>
                <li>
                  <div>
                    AIDOL Assistant may, but is not obliged to, monitor User Generated Content for
                    breach of the Acceptable Use Policy. If User Generated Content is automatically
                    flagged for a possible violation of the Acceptable Use Policy, such request for
                    content creation may undergo a manual review or become automatically rejected.
                    AIDOL Assistant can in its full discretion decide if User Generated Content
                    violates this Acceptable Use Policy and reject User Generated Content creation
                    request. If any of User Generated Content is deemed in violation of this
                    Acceptable Use Policy after its creation, you must immediately delete, stop
                    distributing and recall the violating Content both online and offline. We may
                    immediately discontinue your access to the Platform in the event of breach of
                    the Acceptable Use Policy.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Confidential Information</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    “Confidential Information” means the specific terms and conditions of the
                    Agreements and any non-public technical or business information of a party,
                    including without limitation any information relating to a party’s techniques,
                    algorithms, know-how, current and future products and services, research,
                    engineering, designs, financial information, procurement requirements,
                    manufacturing, customer lists, business forecasts, marketing plans and any other
                    information which is disclosed to the other party in any form and (i) which is
                    marked or identified as confidential or proprietary at the time of disclosure,
                    or (ii) that the receiving party knows or should reasonably know to be the
                    confidential or proprietary information of the disclosing party given the nature
                    of such information and the circumstances of its disclosure.
                  </div>
                </li>
                <li>
                  <div>
                    Both AIDOL Assistant and User will only use the other’s Confidential Information
                    as necessary to perform under the Agreements, and must not use or disclose,
                    either during or after the termination of its relationship, such information.
                    Both AIDOL Assistant and User will only disclose the other party’s Confidential
                    Information to persons or entities who need to know the information to perform
                    under the Agreements. These obligations will remain in full force and effect in
                    perpetuity.
                  </div>
                </li>
                <li>
                  <div>
                    Nothing in the Agreements shall prohibit either AIDOL Assistant or User from
                    disclosing Confidential Information of the other party if legally required to do
                    so by judicial, regulatory or governmental order (“Required Disclosure”);
                    provided that the disclosing party shall: (i) give the other party prompt
                    written notice of such Required Disclosure prior to disclosure; (ii) cooperate
                    with the other party in the event the party elects to oppose such disclosure or
                    seek a protective order with respect thereto, and/or (iii) only disclose the
                    portion of Confidential Information specifically requested by the Required
                    Disclosure.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Accounts</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    When you create an account with us, you guarantee that the information you
                    provide us is accurate, complete, and current at all times. Inaccurate,
                    incomplete, or obsolete information may result in the immediate termination of
                    your account on the Platform.
                  </div>
                </li>
                <li>
                  <div>
                    You are responsible for maintaining the confidentiality of your account and
                    password, including but not limited to the restriction of access to your device
                    and/or account. You agree to accept responsibility for all activities or actions
                    that occur under your account and/or password, whether your password is with our
                    Platform or a third-party service.
                  </div>
                </li>
                <li>
                  <div>
                    You must notify us immediately upon becoming aware of any breach of security or
                    unauthorised use of your account.
                  </div>
                </li>
                <li>
                  <div>
                    You may not use as a username the name of another person or entity or that is
                    not lawfully available for use, or a name or trademark that is subject to any
                    rights of another person or entity other than you, without appropriate
                    authorisation. You may not use as a username any name that is offensive, vulgar
                    or obscene or otherwise against the Acceptable Use Policy.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Customer Reference</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    You agree (i) that AIDOL Assistant may identify you as a recipient of Service
                    and use your name and logo in sales presentations and on the AIDOL Assistant
                    website, and with prior approval in marketing materials and press releases, and
                    (ii) with prior approval from you not to be unreasonably withheld to develop a
                    brief customer profile for promotional purposes on any websites owned and/or
                    controlled by AIDOL Assistant.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Error Reporting and Feedback</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    You may provide us directly at{' '}
                    <a href="mailto:support@aidol.studio" aria-label="contact us">
                      support@aidol.studio
                    </a>{' '}
                    with information and feedback concerning errors, suggestions for improvements,
                    ideas, problems, complaints, and other matters related to our Platform
                    (“Feedback”).
                  </div>
                </li>
                <li>
                  <div>
                    You acknowledge and agree that: (i) you shall not retain, acquire or assert any
                    intellectual property rights or other rights, title or interest in or to the
                    Feedback; (ii) we may use the Feedback to improve the Platform or any other
                    technology; (iii) we may have development ideas similar to the Feedback; (iv)
                    the Feedback does not contain confidential information or proprietary
                    information from you or any third-party; and (v) we are not under any obligation
                    of confidentiality with respect to the Feedback.
                  </div>
                </li>
                <li>
                  <div>
                    You hereby grant AIDOL Assistant and its affiliates an exclusive, transferable,
                    irrevocable, free-of-charge, royalty-free, sub-licensable, unlimited and
                    perpetual right to use (including copy, modify, create derivative works,
                    publish, distribute and commercialise) the Feedback in any manner and for any
                    purpose.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Links To Other Web Sites</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    Our Platform may contain links to third-party web sites or services that are not
                    owned or controlled by AIDOL Assistant.
                  </div>
                </li>
                <li>
                  <div>
                    AIDOL Assistant has no control over, and assumes no responsibility for, the
                    content, privacy policies or practices of any third-party web sites or services.
                    We do not warrant the offerings of any of these entities/individuals or their
                    web sites.
                  </div>
                </li>
                <li>
                  <div>
                    You acknowledge and agree that AIDOL Assistant shall not be responsible or
                    liable, directly or indirectly, for any damage or loss caused or alleged to be
                    caused by or in connection with use of or reliance on any such content, goods or
                    services available on or through any such third-party web sites or services.
                  </div>
                </li>
                <li>
                  <div>
                    These third-party web sites and services have their own terms of service and
                    privacy or other policies, and we strongly advise you to read them.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Disclaimer of Warranty</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    OUR PLATFORM AND ANY CONTENT THEREIN ARE PROVIDED BY AIDOL Assistant ON AN “AS
                    IS” AND “AS AVAILABLE” BASIS. AIDOL Assistant MAKES NO REPRESENTATIONS OR
                    WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THE SERVICE
                    AND THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE
                    THAT YOUR USE OF THE SERVICE AND ANY CONTENT THEREIN IS AT YOUR OWN RISK.
                  </div>
                </li>
                <li>
                  <div>
                    TO THE EXTENT PERMITTED BY APPLICABLE LAW, AIDOL Assistant MAKES NO WARRANTY OR
                    REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY,
                    ACCURACY, SUITABILITY OR AVAILABILITY OF THE PLATFORM. WITHOUT LIMITING THE
                    FOREGOING, AIDOL Assistant DOES NOT REPRESENT THAT THE PLATFORM, ANY CONTENT
                    THEREIN OR ANY SERVICES OR ITEMS OBTAINED THROUGH THE PLATFORM WILL BE ACCURATE,
                    RELIABLE, SUITABLE, ERROR-FREE OR UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED,
                    THAT THE PLATFORM OR THE SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR
                    OTHER HARMFUL COMPONENTS OR THAT THE PLATFORM OR ANY SERVICES OR ITEMS OBTAINED
                    THROUGH THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
                  </div>
                </li>
                <li>
                  <div>
                    THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED
                    UNDER APPLICABLE LAW.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Liability and Indemnity</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    TO THE EXTENT PERMITTED BY APPLICABLE LAW, YOU WILL DEFEND, INDEMNIFY AND HOLD
                    HARMLESS AIDOL Assistant AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS FROM
                    AND AGAINST ANY AND ALL LOSSES, DAMAGES, COSTS, EXPENSES (INCLUDING LEGAL FEES),
                    CLAIMS, COMPLAINTS, DEMANDS, ACTIONS, SUITS, PROCEEDINGS, OBLIGATIONS AND
                    LIABILITIES ARISING FROM, CONNECTED WITH OR RELATING TO YOUR USE OF THE SERVICE,
                    ANY CONTNET OR BREACH OF THESE TERMS. NOTWITHSTANDING THE FOREGOING, AIDOL
                    Assistant RETAINS THE RIGHT TO PARTICIPATE IN THE DEFENCE OF AND SETTLEMENT
                    NEGOTIATIONS RELATING TO ANY THIRD-PARTY CLAIM, COMPLAINT, DEMAND, ACTION, SUIT
                    OR PROCEEDING WITH COUNSEL OF OUR OWN SELECTION AT OUR SOLE COST AND EXPENSE.
                  </div>
                </li>
                <li>
                  <div>
                    IN NO EVENT AND UNDER NO CIRCUMSTANCES WILL AIDOL Assistant BE LIABLE TO YOU FOR
                    LOSS OF PROFITS, SALES, BUSINESS, OR REVENUE, BUSINESS INTERRUPTION, LOSS OF
                    ANTICIPATED SAVINGS, LOSS OF BUSINESS OPPORTUNITY, LOSS OF GOODWILL OR
                    REPUTATION, OR ANY INDIRECT OR CONSEQUENTIAL DAMAGE RESULTING FROM YOUR USE OF
                    THE SERVICE OR ANY CONTENT THEREIN.
                  </div>
                </li>
                <li>
                  <div>
                    IN NO EVENT AND UNDER NO CIRCUMSTANCES WILL AIDOL ASSISTANT’S TOTAL AGGREGATE
                    LIABILITY ARISING FROM, IN CONNECTION WITH, OR RELATING TO THESE TERMS, THE
                    SERVICE OR ANY CONTENT THEREIN EXCEED: (I) IF YOU HAVE MADE ANY PURCHASE, THE
                    AMOUNT OF THE PURCHASE GIVING RISE TO THE RELEVANT DISPUTE; OR (II) THE AMOUNT
                    OF ONE-THOUSAND HONG KONG DOLLARS ($1000).
                  </div>
                </li>
                <li>
                  <div>
                    NOTHING IN THESE TERMS IS INTENDED TO EXCLUDE OR LIMIT OUR LIABILITY TO THE
                    EXTENT NOT PERMITTED BY APPLICABLE LAW.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Termination</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    We may terminate or suspend your account and/or prevent your access to the
                    Platform immediately, without prior notice in the event you are in breach of
                    these Terms. We may suspend your subscription auto renewal for any reason or
                    without a reason at any time without any consequences to you.
                  </div>
                </li>
                <li>
                  <div>
                    You are free to stop using the Platform at any time. If you wish to terminate
                    your account, please contact us. Termination of your account will take effect at
                    the end of the then current Billing Cycle and will not give rise to any refund
                    of your Purchase, unless as described under “9. Refund”.
                  </div>
                </li>
                <li>
                  <div>
                    All provisions of these Terms which by their nature should survive termination
                    shall survive termination, including, without limitation, ownership provisions,
                    warranty disclaimers, indemnity and limitations of liability.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Governing Law</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    The Agreements and any dispute or claim (including non-contractual disputes or
                    claims) arising out of or in connection with it or its subject matter or
                    formation are governed by laws of the Hong Kong SAR. The courts of Hong Kong SAR
                    will have exclusive jurisdiction to deal with any dispute (including any
                    non-contractual claim or dispute) which has arisen or may arise out of, or in
                    connection with, the Agreements.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Changes To Service</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    We reserve the right to withdraw or amend our Service, and any service or
                    material we provide via the Platform, in our sole discretion without notice. We
                    will not be liable if for any reason all or any part of the Platform is
                    unavailable at any time or for any period. From time to time, we may restrict
                    your access to some parts of Platform, or the entire Platform.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Amendments To Terms</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    We may amend these Terms at any time by posting the amended Terms on this site.
                    It is your responsibility to review these Terms periodically. These terms become
                    effective immediately upon posting, unless you have an active Subscription in
                    which case the revised Terms will become effective thirty (30) days after
                    posting. If any revision to these Terms has a material impact on your rights or
                    obligations, we may notify you of such revision using your registered e-mail
                    address.
                  </div>
                </li>
                <li>
                  <div>
                    By continuing to access or use our Platform after any revisions become
                    effective, you agree to be bound by the revised Terms. If you do not agree to
                    the revised Terms, you are no longer authorised to use Platform.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Waiver</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    No waiver by AIDOL Assistant of any term or condition set forth in these Terms
                    shall be deemed a further or continuing waiver of such term or condition, or a
                    waiver of any other term or condition, and any failure of AIDOL Assistant to
                    assert a right or provision under these Terms shall not constitute a waiver of
                    such right or provision.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Severability</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    If any provision of these Terms is held by a court or other tribunal of
                    competent jurisdiction to be invalid, illegal or unenforceable for any reason,
                    such provision shall be eliminated or limited to the minimum extent such that
                    the remaining provisions of these Terms will continue in full force and effect.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Assignment</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    We may transfer our rights and obligations under these Terms to another
                    organisation. We will always tell you in writing if this happens and we will
                    ensure that the transfer will not affect your rights.
                  </div>
                </li>
                <li>
                  <div>
                    You may not transfer any of your rights and obligations under these Terms to any
                    other person without our prior express written consent.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Third Party Rights</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    No person other than the User and AIDOL Assistant will have right under the
                    Contracts (Rights of Third Parties) Ordinance (Cap. 623 of the Laws of Hong
                    Kong) to enforce or enjoy the benefit of any of the provisions of these Terms.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Acknowledgement</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    BY USING THE SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU
                    HAVE READ THESE TERMS AND AGREE TO BE BOUND BY THEM.
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <p>
                <b>Contact Us</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    The Platform is operated by Pantheon Lab Limited. Our registered address is Unit
                    947, 9/F, Building 19W, No. 19 Science Park West Avenue, Hong Kong Science Park,
                    Pak Shek Kok, New Territories, Hong Kong
                  </div>
                </li>
                <li>
                  <div>
                    Please send your feedback, comments, requests for technical support by email at:{' '}
                    <a href="mailto:support@aidol.studio" aria-label="contact us">
                      support@aidol.studio
                    </a>
                    .
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <p>Last updated: April 17, 2023</p>
        </div>
      </div>
    </StyledTerms>
  );
}
