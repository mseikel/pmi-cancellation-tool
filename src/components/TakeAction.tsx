import React from "react";

export function TakeAction() {
  const LETTER_TEXT = `[Date]

[Servicer Name]
[Servicer Address]

Re: PMI Cancellation Request — Loan No. ________

Dear [Servicer Name],

I’m requesting cancellation of private mortgage insurance on my loan. Based on my payment history and my home’s current value, I believe I have sufficient equity for cancellation. Please confirm the next steps and any required documentation to remove PMI.

Sincerely,
[Your Name]
[Property Address]
[Phone / Email]
`;

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(LETTER_TEXT);
      alert("Letter copied to clipboard.");
    } catch {
      alert("Couldn’t copy. Please select and copy manually.");
    }
  };

  const Card: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
    <div className="bg-white rounded-xl p-4 space-y-4 overflow-auto border ">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {children}
    </div>
  );

  const LinkButton: React.FC<
    React.PropsWithChildren<{ href: string; label?: string }>
  > = ({ href, children, label }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label || (typeof children === "string" ? children : "External link")}
      className="inline-block rounded-lg bg-green-900 text-white px-4 py-2 hover:bg-green-800"
    >
      {children}
    </a>
  );

  return (
    <section id="resources" className="screen-minus-nav flex flex-col max-w-5xl mx-auto px-4 transform py-4 md:-translate-y-4">
      


      <div className="flex-1 grid grid-cols-1 auto-rows-auto md:grid-cols-2  gap-4">
        {/* 1 */}
        <Card title="Request PMI Cancellation">
          <p>Call or email your mortage servicer. It is the company to which you send monthly mortage payments. </p>
          <p>Their telephone number and mailing address should be listed on your monthly statement</p>
          <p>For informational purposes only, here's a model script you can send by email or your servicer’s secure message portal.</p>
          <details className="space-y-2">
            <summary className="cursor-pointer text-green-800 underline">
            Sample PMI Cancellation Request
            </summary>
            <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
              {LETTER_TEXT}
            </pre>

          </details>
        </Card>

        



        {/* 2 */}
        <Card title="File a Complaint">
          <p>If your servicer is unresponsive or refuses PMI cancellation without proper reason, you can submit a complaint to the CFPB.</p>
          <div className="space-y-2">
            <LinkButton href="https://www.consumerfinance.gov/complaint/" label="CFPB Complaint Form">
              CFPB Complaint Form
            </LinkButton>
          </div>
          <p className="pt-2">On the complaint form, it might be helpful to also identify which company owns your loan:</p>
          <div className="flex gap-2">
  <LinkButton href="https://yourhome.fanniemae.com/calculators-tools/loan-lookup">
    Fannie Mae
  </LinkButton>
  <LinkButton href="https://myhome.freddiemac.com/resources/loanlookup">
    Freddie Mac
  </LinkButton>
</div>

        </Card>
        {/* 3 */}
        <Card title="Explore the Research">
            <p>Interested in how the government could make PMI cancellation free and automatic?</p>
            <p>Check out these resources to learn about how the FHFA could save over 2 million homeowners $3 billion a year.</p>
          <ul className="list-disc list-outside pl-6 space-y-2">
            <li>
      <a
        href="https://www.americanbanker.com/opinion/the-fhfa-could-save-borrowers-billions-with-automated-pmi-cancellation"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-800 underline italic"
      >
        The FHFA Could Save Borrowers Billions with Automated PMI Cancellation (Op-Ed)
      </a>
    </li>
    <li>
      <a
        href="https://drive.google.com/file/d/1z9EisRNt9eIFg-ZVr4TP7it70BCiBmSa/view"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-800 underline italic"
      >
        Regulatory Opportunities for Enhancing Affordability: The Use of AVMs to Auto-Cancel PMI (PDF)
      </a>
    </li>
    
  </ul>
        </Card>
        {/* 4 */}
        <Card title="Contact Policymakers">
          <p>Reach out your elected representatives to support automated PMI cancellation based on current home prices using existing technology.</p>
          <p>It can be helpful to add details about your personal experience with the PMI cancellation process.</p>
          <details className="space-y-2">
  <summary className="cursor-pointer text-green-800 underline">
    Sample Call Script
  </summary>

  <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap italic">
    “Hi, I’m [Name] from [ZIP]. Please support FHFA requiring Fannie Mae and Freddie Mac to
    automatically cancel private mortgage insurance when homeowners reach sufficient equity using
    automated valuation models (AVMs). This would save over 2 million homeowners an average of
    $1,200 each in the first year alone. Can I count on your support?”
  </pre>
</details>

<LinkButton href="https://www.congress.gov/members/find-your-member">
  Find your Representatives
</LinkButton>

        </Card>
      </div>
    </section>
  );
}

export default TakeAction;
