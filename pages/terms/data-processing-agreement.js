import React from 'react';
import classNames from 'classnames';
import Head from 'next/head';

import styled from '@emotion/styled';
import Link from 'next/link';

const StyledDataProcessingAgreement = styled.div`
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
    flex-direction: column;
    align-items: center;
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

  .list {
    list-style-type: none;
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

  .backBtn {
    text-decoration: none;
  }

  @media (max-width: 480px) {
    .document {
      padding: 48px 24px;
    }
  }
`;

export default function DataProcessingAgreement() {
  /*
<li>
<p>
  <b>Preamble</b>
</p>
<ul className={classNames('decimalList', 'noTab')}>
  <li>
    <div>
      1.1 This Data Processing Agreement represents an integral part of the terms for
      business customers. Under the Data Protection Laws, Pantheon Lab Limited
      (“Pantheon Lab”), a company incorporated under the laws of Hong Kong SAR has a
      position of a ‘Processor’ and Pantheon Lab’s business customers have a position
      of a ‘Data User’ regarding the personal data collected using Pantheon Lab
      services (the “Services”).
    </div>
  </li>
</ul>
</li>

  */
  return (
    <StyledDataProcessingAgreement>
      <Head>
        <title>AIDOL Assistant - Data Processing Agreement‍</title>
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
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
            }}
            href={`/`}
          >
            Back To Assistant
          </Link>
        </div>
        <div className="document">
          <p>
            <b>Data Processing Agreement‍</b>
          </p>
          <br />
          <p>
            <b>Effective as of 1st April, 2023</b>
          </p>
          <ul className="numberedList">
            <li>
              <p>
                <b>Preamble</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    1.1 This Data Processing Agreement represents an integral part of the terms for
                    business customers. Under the Data Protection Laws, Pantheon Lab Limited
                    (“Pantheon Lab”), a company incorporated under the laws of Hong Kong SAR has a
                    position of a ‘Processor’ and Pantheon Lab’s business customers have a position
                    of a ‘Data User’ regarding the personal data collected using Pantheon Lab
                    services (the “Services”).
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Definitions</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    2.1 The following definitions explain some of the terminology and abbreviations
                    used throughout this Data Processing Agreement:
                  </div>
                </li>

                <li>
                  <div>‘DPA’ refers to this Data Processing Agreement.</div>
                </li>

                <li>
                  <div>
                    ‘Agreement’ refers to any service agreement entered into or to be entered into
                    between the parties.
                  </div>
                </li>

                <li>
                  <div>
                    ‘Data Protection Laws’ refers to all applicable laws and regulations regarding
                    the Processing of Data including the Personal Data (Privacy) Ordinance (Cap. 486
                    of the Laws of Hong Kong), as amended from time to time and, including any
                    successor legislation.
                  </div>
                </li>

                <li>
                  <div>
                    ‘Processor’ refers to Pantheon Lab Limited, a company incorporated under the
                    laws of Hong Kong SAR with company registration number 71038004.
                  </div>
                </li>

                <li>
                  <div>
                    ‘Data User’ refers to the business customers of the Pantheon Lab Services.
                  </div>
                </li>

                <li>
                  <div>
                    ‘Processing’ refers to any operation or set of operations which is performed on
                    personal data or on sets of personal data, whether or not by automated means,
                    such as collection, recording, organization, structuring, storage, adaptation or
                    alteration, retrieval, consultation, use, disclosure by transmission,
                    dissemination or otherwise making available, alignment or combination,
                    restriction, erasure or destruction.
                  </div>
                </li>

                <li>
                  <div>
                    ‘Data’ refers to information provided by Data User to the Processor, or
                    collected by the Processor on behalf of the Data User, relating to an identified
                    or identifiable natural person. An identifiable natural person is one who can be
                    identified, directly or indirectly, in particular by reference to an identifier
                    such as a name, an identification number, location data, an online identifier or
                    to one or more factors specific to the physical, physiological, genetic, mental,
                    economic, cultural or social identity of that natural person.
                  </div>
                </li>

                <li>
                  <div>
                    ‘Data Subject’ refers to an identified or identifiable natural person to whom
                    Data relates.
                  </div>
                </li>

                <li>
                  <div>
                    ‘Data Breach’ refers to a breach of security leading to the accidental or
                    unlawful destruction, loss, alteration, unauthorized disclosure of, or access
                    to, Data transmitted, stored or otherwise processed.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>3. Processing</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    3.1 Processor undertakes to process all Data in accordance with Data Protection
                    Laws and other applicable laws, statutes, and regulations. Nature and the
                    purpose of processing, the types of Data processed, and the categories of Data
                    Subjects whose Data is processed are set out in Appendix 1 to this DPA.{' '}
                  </div>
                </li>

                <li>
                  <div>
                    3.2 Unless otherwise explicitly stated in this DPA, the Processor may process
                    the Data for the purposes of providing and improving the Services set out in the
                    Agreement, and only in accordance with the Data User’s documented instructions.
                    Instructions referred to herein are incorporated in the Agreement, this DPA, or
                    may be contained within other, written document concluded or exchanged between
                    the Data User and the Processor. If the Processor in its opinion believes that
                    an instruction of the Data User infringes the Data Protection Law, it shall
                    immediately inform the Data User.{' '}
                  </div>
                </li>

                <li>
                  <div>
                    3.3 During the term of this DPA Data User shall remain the owner of the Data
                    transferred to the Processor as well as the Data collected by the Processor on
                    behalf of the Data User. Nothing in this DPA shall be understood to transfer the
                    ownership of the Data to the Processor or any other third-party.
                  </div>
                </li>

                <li>
                  <div>
                    3.4 Data User warrants that the Data is obtained in accordance with the
                    applicable laws, statutes and regulations and that Processing which Data User
                    requests does not violate any applicable law, statute, or regulation.
                  </div>
                </li>

                <li>
                  <div>
                    3.5 Data that the Processor shall process includes such Data which is requested
                    by the Data User on a case-by-case basis, and which is necessary to perform the
                    services described in the Agreement.
                  </div>
                </li>

                <li>
                  <div>
                    3.6 Data may be processed for the duration of the Agreement unless otherwise
                    instructed by the Data User.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Personnel</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    4.1 The Processor shall ensure that all employees, contractors, and other
                    persons operating under the authority of the Processor are bound by a strict
                    confidentiality agreement prior to providing them with access to the Data.
                  </div>
                </li>
                <li>
                  <div>
                    4.2 The Processor shall take steps to ensure that any person acting under the
                    authority of the Processor who has access to the Data does not process them
                    except on instructions from the Data User.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Security</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    5.1 Taking into account the state of the art, the costs of implementation and
                    the nature, scope, context and purposes of processing as well as the risk of
                    varying likelihood and severity for the rights and freedoms of Data Subjects,
                    the Processor shall implement appropriate technical and organizational measures
                    to ensure a level of security appropriate to the risk, including inter alia as
                    appropriate:
                  </div>
                </li>

                <li>
                  <div>• the pseudonymization and encryption of the Data;</div>
                </li>

                <li>
                  <div>
                    • the ability to ensure the ongoing confidentiality, integrity, availability and
                    resilience of processing systems and services;
                  </div>
                </li>

                <li>
                  <div>
                    • the ability to restore the availability and access to the Data in a timely
                    manner in the event of a physical or technical incident;
                  </div>
                </li>

                <li>
                  <div>
                    • a process for regularly testing, assessing and evaluating the effectiveness of
                    technical and organizational measures for ensuring the security of the
                    processing.
                  </div>
                </li>

                <li>
                  <div>
                    5.2 In assessing the appropriate level of security account shall be taken in
                    particular of the risks that are presented by processing, in particular from
                    accidental or unlawful destruction, loss, alteration, unauthorized disclosure
                    of, or access to the Data transmitted, stored or otherwise processed.
                  </div>
                </li>

                <li>
                  <div>
                    5.3 The list of technical and organizational security measures is provided in
                    the Appendix 2 of this DPA.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Sub-Processor</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    6.1 The Data User agrees that Processor may engage sub-processors as the
                    Processor deems necessary.
                  </div>
                </li>
                <li>
                  <div>
                    6.2 Where the Processor engages another processor for carrying out specific
                    processing activities on behalf of the Data User, the same Data protection
                    obligations as set out in this DPA shall be imposed on that other processor by
                    way of a contract or other legal act, providing sufficient guarantees to
                    implement appropriate technical and organizational measures in such a manner
                    that the processing will meet the requirements of the applicable laws, statutes,
                    and regulations. Where that other processor fails to fulfil its Data protection
                    obligations, the Processor shall remain fully liable to the Data User for the
                    performance of that other processor’s obligations.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Data Subject rights</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    7.1 Taking into account the nature of the processing, the Processor shall assist
                    the Data User by appropriate technical and organizational measures, insofar as
                    this is possible, for the fulfilment of the Data User’s obligations, as
                    reasonably understood by the Data User, to respond to requests to exercise Data
                    Subject rights under the Data Protection Laws.
                  </div>
                </li>

                <li>
                  <div>7.2 The Processor shall:</div>
                </li>

                <li>
                  <div>
                    • promptly notify the Data User if Processor or Sub-Processor receive a request
                    from a Data Subject under Data Protection Laws or other applicable law, statute,
                    or regulation in respect of the Data; and
                  </div>
                </li>

                <li>
                  <div>
                    • ensure that the Processor or Sub-Processor do not respond to that request
                    except on the documented instructions of the Data User or as required by
                    applicable laws to which the Processor or Sub-Processor is subject, in which
                    case the Processor shall to the extent permitted by applicable laws inform the
                    Data User of that legal requirement before the Processor or Sub-Processor
                    respond to the request.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Data Breach</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    8.1 The Processor shall notify the Data User without undue delay after becoming
                    aware of a Data Breach affecting the Data, providing the Data User with
                    sufficient information to allow the Data User to meet any obligations to report
                    or inform authorized authorities and Data Subjects where necessary of the Data
                    Breach.
                  </div>
                </li>
                <li>
                  <div>
                    8.2 The Processor shall co-operate with the Data User and take such reasonable
                    commercial steps as are directed by the Data User to assist in the
                    investigation, mitigation, and remediation of each such Data Breach.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Data Protection Impact Assessment and Prior Consultation</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    9.1 The Processor shall provide reasonable assistance to the Data User with any
                    Data protection impact assessments, and prior consultations with competent data
                    privacy authorities, which the Data User reasonably considers to be required
                    under the Data Protection Laws or equivalent provisions of any other applicable
                    law, in each case solely in relation to processing of the Data by and
                    considering the nature of the processing and information available to, the
                    Processor.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Deletion or return of the Data </b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    10.1 Subject to sections 10.2 and 10.3 the Processor and each Sub-Processor if
                    any shall promptly and in any event within thirty (30) days of the date of
                    cessation of any Services involving the processing of the Data (the
                    &quot;Cessation Date&quot;), delete and procure the deletion of all copies of
                    those Data.
                  </div>
                </li>
                <li>
                  <div>
                    10.2 Subject to section 10.3, the Data User may in its absolute discretion by
                    written notice to the Processor within seven (7) days prior to the Cessation
                    Date require Processor and each Sub-Processor if any to return a complete copy
                    of all Data to the Data User by secure file transfer in such format as is
                    reasonably notified by the Data User to the Processor; and
                  </div>
                </li>
                <li>
                  <div>
                    10.3 The Processor may retain the Data to the extent required by applicable laws
                    and only to the extent and for such period as required by applicable laws and
                    always provided that the Processor ensures the confidentiality of all such Data
                    and ensures that such Data is only processed as necessary for the purpose(s)
                    specified in the applicable laws requiring its storage and for no other purpose.
                  </div>
                </li>
                <li>
                  <div>
                    10.4 The Processor shall provide written certification to the Data User that the
                    Processor fully complied with this section 10 upon written request of the Data
                    User issued after the expiry of the deadline from section 10.1.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Audit rights</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    11.1 Subject to provisions of this article 11 the Processor shall make available
                    to the Data User on request all information necessary to demonstrate compliance
                    with this DPA, and shall allow for and contribute to audits, including
                    inspections, by the Data User or an auditor mandated by the Data User in
                    relation to the processing of the Data. All costs of the audit shall be borne by
                    the Data User and must be scheduled at least one month in advance. The Data User
                    may commence audit only if they have provided a bond or security deposit that
                    will serve to compensate any loss or damages that may be caused by the audit
                    such as ceasing of providing the services or employee work hours spent on the
                    audit. The amount of bond or security deposit shall be agreed beforehand with
                    the Processor but in no event shall be less than HK$100,000 (one hundred
                    thousand Hong Kong dollars) considering the proportion between the data
                    processed on behalf of the Data User and the number of customers the Processor
                    has.
                  </div>
                </li>
                <li>
                  <div>
                    11.2 Information and audit rights of the Data User only arise under section 11.1
                    to the extent that the Agreement does not otherwise give them information and
                    audit rights meeting the relevant requirements of the Data Protection Laws.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Final provisions</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    12.1 Any matter that is not regulated by this DPA shall be governed by the
                    Agreement or other subsequent contract concluded or exchanged between the
                    parties to this DPA.
                  </div>
                </li>
                <li>
                  <div>
                    12.2 If any part of this DPA is found to be invalid, illegal, or unenforceable
                    in any respect, it will not affect the validity or enforceability of the
                    remainder of the DPA.
                  </div>
                </li>
                <li>
                  <div>
                    12.3 Any failure to exercise or enforce any right or the provision of this DPA
                    shall not constitute a waiver of such right or provision.
                  </div>
                </li>
                <li>
                  <div>
                    12.4 The section titles in the DPA are for convenience only and have no legal or
                    contractual effect.
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <p>Last updated: April 17, 2023</p>
        </div>

        <div className="document">
          <p>
            <b>Appendix 1 – Description of processing</b>
          </p>
          <ul className="list">
            <li>
              <p>
                <b>
                  The purpose of the Processor’s processing of Data on behalf of the Data User is:{' '}
                </b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • Processor’s provision of Services to the Data User and improvement of Services
                    delivered to the Data User.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>
                  The Processor’s processing of Data on behalf of the Data User shall mainly pertain
                  to (the nature of the processing):
                </b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • Collection of Data on behalf of the Data User through the Service from the
                    Data User’s personnel or other data subjects.
                  </div>
                </li>

                <li>
                  <div>
                    • Development of the content requested by the Data User using the Data provided
                    for that purpose.
                  </div>
                </li>

                <li>
                  <div>
                    • Improving the content made available to the Data User by including the Data in
                    the AI training dataset which may result in the improvement of the Processor’s
                    AI technology. Processor will bundle the Data together with other available data
                    to create a larger dataset for AI training. Any Data in the dataset will be
                    deleted after the termination of this DPA or earlier if instructed by the Data
                    User.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>
                  The processing includes the following types of personal data about data subjects:
                </b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • Data may include but is not limited to the following categories of personal
                    data:
                  </div>
                </li>

                <li>
                  <div>
                    first and last name; images, videos, voice recordings; employer; business role;
                    professional title; department; business contact information (e.g., email,
                    phone, physical address); business network; business experience; business
                    interests, localization data, connection data, other communication data; and
                    other Data Processed during the use of the Services. Data User confirms that the
                    text scripts do not contain personal data.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>Processing includes the following categories of data subject:</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • Data User’s customers and other business contacts; employees and contractors;
                    subcontractors and agents; consultants, prospects and event sponsors and
                    attendees.
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <p>
                <b>
                  The Processor’s processing of Data on behalf of the Data User may be performed
                  when this Data Processing Agreement commences. Processing has the following
                  duration:
                </b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • Processing shall not be time-limited and shall be performed until this DPA is
                    terminated or cancelled by one of the parties.
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <p>Last updated: April 17, 2023</p>
        </div>

        <div className="document">
          <p>
            <b>Appendix 2 – Technical and organizational measures of the Processor </b>
          </p>
          <div>
            The Processor has implemented and maintains the following technical and organizational
            measures to protect the security, confidentiality and integrity of the Personal Data:
          </div>
          <ul className="list">
            <li>
              <p>
                <b>Security Operations</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • A comprehensive, written information security programme is implemented
                  </div>
                </li>
                <li>
                  <div>
                    • An Information Security Officer is appointed to lead the security programme
                  </div>
                </li>
                <li>
                  <div>
                    • Information security incorporates risk assessment for the protection of
                    personal data
                  </div>
                </li>
                <li>
                  <div>
                    • Risk assessment, prioritisation and risk treatment is performed at least
                    annually
                  </div>
                </li>
                <li>
                  <div>
                    • At least annually, an external security assessment is performed for the
                    Services
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Human Resource Security</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>• Pre-employment screening is performed for all employees</div>
                </li>
                <li>
                  <div>• Non-disclosure agreements are part of all employee contracts</div>
                </li>
                <li>
                  <div>
                    • Information security and security awareness training is mandatory for all
                  </div>
                </li>
                <li>
                  <div>• All employees must review and approve the Acceptable Use Policy</div>
                </li>
                <li>
                  <div>
                    • Violations of security policies leads to loss of access and disciplinary
                    action
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Data Center Security </b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>• Infrastructure is managed via ISO27001 certified AWS data centres</div>
                </li>
                <li>
                  <div>• All data is stored in Ohio, United States</div>
                </li>
                <li>
                  <div>• The Services are hosted in multiple availability zones for redundancy</div>
                </li>
                <li>
                  <div>
                    • Access to the infrastructure is restricted to authorized personnel only
                  </div>
                </li>
                <li>
                  <div>
                    • All access is logged and audited, and logs are retained for up to 2 years
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Physical Access Control</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>• Entrances and exits of buildings are permanently closed</div>
                </li>
                <li>
                  <div>• There is a reception area for access control</div>
                </li>
                <li>
                  <div>
                    • All offices require a key or keycard, with use by authorised key holders only
                  </div>
                </li>
                <li>
                  <div>• All visitors are accompanied by employees</div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>System Access Control</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>• System and data access is based on the principle of least privilege</div>
                </li>
                <li>
                  <div>• Access is managed using role-based access control (RBAC)</div>
                </li>
                <li>
                  <div>
                    • Only approved system administrators can provision or deprovision access
                  </div>
                </li>
                <li>
                  <div>
                    • All internal access is managed using a password manager and two-factor
                    authentication
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Device and Network Security</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • All devices are monitored and hardened, with disk encryption, firewall and
                    antivirus
                  </div>
                </li>
                <li>
                  <div>
                    • The production system is segregated into private subnets protected by virtual
                    firewalls
                  </div>
                </li>
                <li>
                  <div>
                    • Only authorized engineers can review, test, and approve network configuration
                    changes
                  </div>
                </li>
                <li>
                  <div>
                    • Only authorized system administrators can access to the production system,
                    with access restricted by IP and port, and all communication encrypted over SSH
                  </div>
                </li>
                <li>
                  <div>
                    • All servers in the production system are patched to minimise security
                    vulnerabilities
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Secure Development</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • All code is tracked in revision control and all changes are reviewed before
                    release
                  </div>
                </li>
                <li>
                  <div>
                    • Each change passes through 2 environments before release to the production
                    system
                  </div>
                </li>
                <li>
                  <div>
                    • The production environment is segregated from all non-production environments
                  </div>
                </li>
                <li>
                  <div>• There is no data shared across production and testing environments</div>
                </li>
                <li>
                  <div>
                    • Data is segregated between users through restricted access permissions
                  </div>
                </li>
                <li>
                  <div>
                    • Risk assessment is part of the development process and all engineers are
                    trained on the OWASP Top 10 web application security risks
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Application Level Security</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>• A strong password policy is in place for user login</div>
                </li>
                <li>
                  <div>• Production passwords are hashed in storage</div>
                </li>
                <li>
                  <div>
                    • All personally identifiable data in the production system is pseudonymized by
                    default
                  </div>
                </li>
                <li>
                  <div>
                    • All data is encrypted at rest with at least 256 bit encryption AES (or
                    equivalent)
                  </div>
                </li>
                <li>
                  <div>
                    • All communication is encrypted in transit using TLS 1.2 by default over https
                  </div>
                </li>
                <li>
                  <div>
                    • An external penetration test is performed on every major architectural change
                    and at least annually, with critical or high-risk vulnerabilities remediated
                    within 30 days
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Protection from Data Loss and Corruption</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • There is a documented Business Continuity Plan and Incident Response Plan
                  </div>
                </li>
                <li>
                  <div>
                    • The Recovery Time Objective (RTO) is set as 24 hours for full system recovery
                  </div>
                </li>
                <li>
                  <div>
                    • The Recovery Point Objective (RPO) is set as full point of time recovery
                  </div>
                </li>
                <li>
                  <div>
                    • The production system is backed to point-in-time for up to 7 days and
                    snapshots are retained for up to 1 month
                  </div>
                </li>
                <li>
                  <div>• Backups and system recovery is tested at least annually</div>
                </li>
                <li>
                  <div>
                    • In the event of a data breach that affects a customer, both customer and
                    regulatory authorities are notified within 24 hours.
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="list">
            <li>
              <p>
                <b>Third party management</b>
              </p>
              <ul className={classNames('decimalList', 'noTab')}>
                <li>
                  <div>
                    • A register of all processing activities and use of third-party processors is
                    maintained
                  </div>
                </li>
                <li>
                  <div>
                    • All third-party processors are assessed to ensure security requirements are
                    met
                  </div>
                </li>
                <li>
                  <div>
                    • Supplier security and service delivery performance are reviewed at least
                    annually
                  </div>
                </li>
              </ul>
            </li>
          </ul>

          <p>Last updated: April 17, 2023</p>
        </div>
      </div>
    </StyledDataProcessingAgreement>
  );
}
