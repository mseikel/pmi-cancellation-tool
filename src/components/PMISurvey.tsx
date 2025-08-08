import React, { useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import InfoTooltip from "./InfoTooltip";

// ================================
// Survey Step Type Definitions
// ================================

type SurveyStep =
  | "start"
  | "step1_conventional"
  | "step2_purchase"
  | "step3_date"
  | "step4_zip"
  | "step5_interest"
  | "step6_credit_score"
  | "step7_delinquency"
  | "step8_equity_boost"
  | "done"
  | "exit_non_conventional"
  | "exit_high_downpayment";

/**
 * Calculate how many months have passed since the purchase date
 */
function monthsSince(date: Date): number {
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}

function monthName(monthNumber: number): string {
  return new Date(2000, monthNumber - 1).toLocaleString("default", { month: "long" });
}


// ================================
// Constants
// ================================

/**
 * Ordered list of survey steps for progress tracking
 */
const steps: SurveyStep[] = [
  "step1_conventional",
  "step2_purchase",
  "step3_date",
  "step4_zip",
  "step5_interest",
  "step6_credit_score",
  "step7_delinquency",
  "step8_equity_boost"
];

// ================================
// Main Survey Component
// ================================
export function PMISurvey() {
  const [step, setStep] = useState<SurveyStep>("start");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [resultData, setResultData] = useState<any | null>(null);
  const handleAnswer = (
  keyOrObject: string | { [key: string]: any },
  value?: any,
  nextStep?: SurveyStep
) => {
  const updated =
    typeof keyOrObject === "object"
      ? { ...answers, ...keyOrObject }
      : { ...answers, [keyOrObject]: value };

  console.log("📝 handleAnswer updated", updated);
  setAnswers(updated);
  if (nextStep) setStep(nextStep);
};

  // API call when survey is done
useEffect(() => {
  if (step !== "done") return;

  async function fetchEligibility() {
    const payload = {
      zip: answers.zipCode,
      purchase_year: answers.purchaseYear,
      purchase_month: answers.purchaseMonth,
      purchase_price: answers.purchasePrice,
      down_payment: answers.downPayment,
      interest_rate:
        answers.interestRate !== undefined && answers.interestRate !== null
          ? parseFloat(answers.interestRate)
          : undefined,
      credit_score: answers.creditScore || "Great (720 - 759)",
      currently_delinquent: answers.currentlyDelinquent ?? false,
      late_30_in_12mo: answers.late30 ?? false,
      late_60_in_24mo: answers.late60 ?? false,
      equity_boost: typeof answers.equityBoost === "boolean" ? answers.equityBoost : false,
      renovation_value:
        typeof answers.renovationValue === "number" ? answers.renovationValue : 0,
      additional_payments:
        typeof answers.additionalPayments === "number" ? answers.additionalPayments : 0,
    };

    try {
      const API_BASE = "https://pmi-cancellation-api.onrender.com";

      console.log("📦 Submitting to API:", payload);


const response = await fetch(`${API_BASE}/pmi-check`, {
  method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setResultData(result);
      setResultMessage(result.eligibility_message || "Something went wrong.");
    } catch (err) {
      setResultMessage("❌ Failed to connect to the backend.");
    }
  }

  fetchEligibility();
}, [step, answers]);

const [dotCount, setDotCount] = useState(1);

useEffect(() => {
  const interval = setInterval(() => {
    setDotCount((prev) => (prev < 3 ? prev + 1 : 1));
  }, 500); // update every half second

  return () => clearInterval(interval); // clean up on unmount
}, []);


if (step === "done") {
  return (
<div className="min-h-screen w-full px-6 py-16 max-w-3xl mx-auto text-center space-y-6">
  <h2 className="text-4xl font-semibold">
  {resultData && resultData.eligibility_level
    ? `You’re ${resultData.eligibility_level} eligible for PMI cancellation.`
    : `Checking eligibility${".".repeat(dotCount)}`
}
</h2>

      {resultData && (
<div className="bg-white text-left p-4 mt-4 rounded-xl border space-y-3 w-full max-w-xl mx-auto">
          {resultData?.eligibility_message && (
          <p
            dangerouslySetInnerHTML={{ __html: resultData.eligibility_message }}
          />
        )}
      <p>
        Here’s how your responses translated into PMI eligibility:
      </p>
          <ul className="list-disc list-outside pl-7 space-y-3">
  
  <li>
    The typical house purchased in <strong>{resultData.cbsa_used?.[0] || resultData.state_used?.[0]}</strong>{" "}
    {resultData.appreciation_percent >= 0 ? (
      <> <strong>rose</strong> </> 
    ) : (
      <> <strong>fell</strong> </> 
    )}
    in value by <strong>{resultData.appreciation_percent?.toLocaleString()}%</strong> between
    <strong> {monthName(answers.purchaseMonth)} {answers.purchaseYear} </strong> and
    <strong> {monthName(resultData.current_month)} {resultData.current_year}</strong>.
  </li>

  <li>
    Your home, originally purchased for <strong>${resultData.purchase_price?.toLocaleString()}</strong>, would now be worth around <strong>${resultData.current_home_value?.toLocaleString()}</strong> based on area price trends.
  </li>

  {resultData.renovation_value > 0 && (
    <li>
      With a reported renovation value of <strong>${resultData.renovation_value.toLocaleString()}</strong>, your estimated home value increases to <strong>${resultData.adjusted_current_value.toLocaleString()}</strong>.
    </li>
  )}

  <li>
    With a down payment of <strong>${answers.downPayment?.toLocaleString()}</strong>
    {resultData.additional_payments > 0 && (
      <>
        , additional payments of <strong>${resultData.additional_payments.toLocaleString()}</strong>
      </>
    )}
    , and{" "}
    {answers.interestRate == null
      ? "an estimated "
      : "a reported "}
    mortgage rate of <strong>{(resultData.interest_rate * 100).toFixed(1)}%</strong>,
    your remaining loan balance is approximately <strong>${resultData.unpaid_balance?.toLocaleString()}</strong>.
  </li>

  <li>
    Your estimated home equity is <strong>${resultData.estimated_equity?.toLocaleString()}</strong>, which is <strong>{resultData.equity_percent?.toLocaleString()}%</strong> of your current home value.
  </li>
</ul>
<p>
  Without any additional or missed payments, your PMI would likely automatically cancel around <strong>{resultData.auto_cancel_date}</strong>.
  {["LIKELY", "POSSIBLY"].includes(resultData.eligibility_level?.[0]) && (
  <> Requesting cancellation now could save you <strong>${resultData.estimated_pmi_savings?.toLocaleString()}</strong> in PMI fees.</>
)}

</p>

        </div>
      )}
       
      {/* Debug info only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <pre className="bg-neutral-100 p-4 text-left rounded text-sm">
          {JSON.stringify(answers, null, 2)}
        </pre>
      )}

      {process.env.NODE_ENV === "development" && resultData && (
  <pre className="bg-neutral-100 p-4 text-left rounded text-sm">
    {JSON.stringify(resultData, null, 2)}
  </pre>
)}

    </div>
  );
}

if (step === "exit_non_conventional") {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6 py-16 max-w-3xl mx-auto space-y-6">
      <h1 className="font-heading text-3xl md:text-5xl tracking-wider uppercase">
        This tool only applies
        to <strong>30-year conventional</strong> mortgages.
      </h1>
      <p className="text-xl md:text-3xl leading-relaxed mt-12 mb-6 max-w-5xl">
        But you can still take action by exploring our resources
        and templates for contacting servicers.
      </p>
      <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
        <Link
          to="/learn"
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold text-center w-full md:w-auto"
        >
          LEARN MORE
        </Link>

        <Link
          to="/#resources"
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold text-center w-full md:w-auto"
        >
          TAKE ACTION
        </Link>
      </div>
    </div>
  );
}

if (step === "exit_high_downpayment") {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6 py-16 max-w-3xl mx-auto space-y-6">
      <h1 className="font-heading text-3xl md:text-5xl tracking-wider uppercase">
        PMI is <strong>not</strong> required with <br />
        <strong>20% or more</strong> down.
      </h1>
      <p className="text-xl md:text-3xl leading-relaxed mt-12 mb-6 max-w-5xl">
        But you can still take action by exploring our resources
        and templates for contacting servicers.
      </p>
      <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
        <Link
          to="/learn"
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold text-center w-full md:w-auto"
        >
          LEARN MORE
        </Link>

        <Link
          to="/#resources"
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold text-center w-full md:w-auto"
        >
          TAKE ACTION
        </Link>
      </div>
    </div>
  );
}

const renderStep = () => {
  if (step === "start") {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center px-6 py-16 max-w-5xl mx-auto">
        <h1 className="font-heading text-3xl md:text-5xl tracking-wider uppercase">
          Are you paying <br /> <span className="font-bold">unnecessary</span> PMI?
        </h1>

        <p className="text-xl md:text-3xl leading-relaxed mt-12 mb-6 max-w-5xl">
          Answer a few quick questions to find out
          if you're one of over <strong>2 million</strong> homeowners likely eligible to save <strong>$1,200</strong> a year.
        </p>

      <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-xl mx-auto">
        <a
          href="/learn"
          className="w-full md:w-auto text-center bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold"
        >
          WHAT IS PMI?
        </a>
        <button
        onClick={() => setStep("step1_conventional")}
        className="w-full md:w-auto text-center bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold"
        >
        START SURVEY
        </button>
      </div>
    </div>
  );
}

switch (step) {
  case "step1_conventional":
    return (
      <Question
        prompt={
          <h2 className="text-3xl font-semibold text-center">
            <span className="inline">
              Do you have a 30-year <br /> 
              conventional mortgage?
            </span>
            
            <InfoTooltip className="inline-block align-middle ml-2">
              Most mortgages are {" "}
              <a
                href="https://www.consumerfinance.gov/owning-a-home/conventional-loans/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-800 hover:text-green-900"
              >
                conventional
              </a>{" "}
              loans.
              <br />
              <br />
              If you have an <strong>FHA, VA, or USDA</strong> loan and/or your mortgage is for a term <br />
              <strong>less than</strong> 30 years, select "<strong>No</strong>".
            </InfoTooltip>
          </h2>
        }
        options={[
          { label: "Yes", value: true, next: "step2_purchase" },
          { label: "No", value: false, next: "exit_non_conventional" },
        ]}
        onAnswer={(val, next) => handleAnswer("conventional", val, next)}
      />
    );

  case "step2_purchase":
    return (
      <PurchaseQuestion
        prompt={
          <h2 className="text-3xl font-semibold text-center">
            <span className="inline">
              Tell us more about <br />  your home purchase.
            </span>
          </h2>
        }
        onSubmit={(price, downPayment) => {
          const ltv = (price - downPayment) / price;

          const updated = {
            ...answers,
            purchasePrice: price,
            downPayment: downPayment,
            originalLTV: ltv,
          };
          setAnswers(updated);

          if ((downPayment / price) >= 0.20) {
            setStep("exit_high_downpayment");
            } else {
            setStep("step3_date");
            }
        }}
      />
    );

  case "step3_date":
    return (
      <DateQuestion
        prompt="When did you purchase your home?"
        onSubmit={(date) => {
          const months = monthsSince(date);
          const updated = {
            ...answers,
            ownershipMonths: months,
            purchaseYear: date.getFullYear(),
            purchaseMonth: date.getMonth() + 1,
          };
          setAnswers(updated);
          setStep("step4_zip");
        }}
      />
    );

  case "step4_zip":
    return (
      <ZipCodeQuestion
        onSubmit={(zip) => 
          handleAnswer("zipCode", zip, "step5_interest")}
      />
    );

  case "step5_interest":
    return (
      <NumericQuestion
        onSubmit={(rate) => 
          handleAnswer("interestRate", rate, "step6_credit_score")}
      />
    );
  
  case "step6_credit_score":
    return (
      <CreditScoreQuestion
        onSubmit={(val) => 
          handleAnswer("creditScore", val, "step7_delinquency")}
      />
    );

  case "step7_delinquency":
    return (
      <DelinquencyQuestion
        onSubmit={({ currentlyDelinquent, late30, late60 }) => {
          handleAnswer(
            {
              currentlyDelinquent,
              late30,
              late60,
            },
            undefined,
            "step8_equity_boost"
          );      
        }}
      />
    );

  case "step8_equity_boost":
    return (
      <EquityBoostQuestion
  onSubmit={({ equityBoost, renovationValue, additionalPayments }) => {
    handleAnswer(
      {
        equityBoost,
        renovationValue,
        additionalPayments
      },
      undefined,
      "done"
    );
  }}
/>
    );
  }
};

const currentStepIndex = steps.indexOf(step);
const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;
const showProgressBar = steps.includes(step);

return (
  <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth text-black">
    {/* ✅ Conditionally show progress bar */}
    {showProgressBar && (
      <div className="fixed bottom-12 left-0 w-full px-6 z-50">
  <div className="relative w-full h-4 bg-neutral-300 rounded-full">
    {/* Progress fill */}
    <div
      className="absolute top-0 left-0 h-4 bg-green-800 rounded-full transition-all duration-500"
      style={{ width: `${progressPercent}%` }}
    />
    {/* Labels */}
    <div className="absolute top-full mt-1 w-full flex justify-between text-xs text-black font-semibold px-1">
      <span>Start</span>
      <span>{Math.round(progressPercent)}%</span>
      <span>Results</span>
    </div>
  </div>
</div>

    )}

    {/* ✅ Main Section */}
    <section className="snap-start h-screen flex justify-center items-center px-6 py-16 max-w-3xl mx-auto">
      <div className="w-full max-w-xl text-center">
        {renderStep()}
      </div>
    </section>
  </div>
);
}

function Question({
  prompt,
  options,
  onAnswer,
}: {
  prompt: React.ReactNode;
  options: { label: string; value: any; next?: SurveyStep }[];
  onAnswer: (val: any, next?: SurveyStep) => void;
}) {
  return (
    <div className="text-center space-y-6">
      <div className="text-2xl font-semibold">{prompt}</div>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(opt.value, opt.next)}
            className="w-full md:w-40 px-4 py-3 bg-white text-lg border-2 border-neutral-400 rounded-xl hover:bg-green-100 font-semibold"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}


function NumericQuestion({
  onSubmit,
}: {
  onSubmit: (val: number | null) => void;
}) {
  const [rate, setRate] = useState("");
  const parsedRate = parseFloat(rate);

  const isValid =
    rate !== "" &&
    !isNaN(parsedRate) &&
    parsedRate > 0 &&
    parsedRate <= 20;

const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value;
  // Allow only one decimal and remove invalid characters
  const cleaned = raw.replace(/[^0-9.]/g, '').replace(/^(\d*\.\d{0,2}).*$/, '$1');
  setRate(cleaned);
};


  return (
    <div className="text-center space-y-6">
      {/* Prompt with tooltip */}
      <h2 className="text-3xl font-semibold text-center">
        What is your mortgage <br />
        <span className="inline-flex items-center justify-center gap-2">
          interest rate?
          <InfoTooltip>
            This is the <strong>annual interest rate</strong> on your mortgage, <strong>not</strong> your APR.
            <br /><br />
            Find your interest rate on the first page of your <strong>closing disclosure</strong>. <br /><br />
            It's okay if you don't know – instead we'll use the <strong>average interest rate</strong> in the month you purchased your home.
          </InfoTooltip>
        </span>
      </h2>

      {/* Input field */}
      <div className="max-w-sm mx-auto">
<input
  type="text"
  className="w-60 p-3 border border-neutral-400 rounded-xl text-lg"
  value={rate}
  onChange={(e) => {
    const raw = e.target.value.replace(/[^\d.]/g, "");
    setRate(raw);
  }}
  onFocus={() => {
    // strip % if it was added on blur
    setRate(rate.replace(/[^\d.]/g, ""));
  }}
  onBlur={() => {
    if (rate !== "" && !isNaN(parseFloat(rate))) {
      setRate(`${parseFloat(rate).toString()}%`);
    }
  }}
  placeholder="4.5%"
/>



      </div>

      {/* Matching buttons */}
      <div className="flex justify-center gap-4 flex-wrap">

        <button
          onClick={() => onSubmit(null)}
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold"
        >
          Skip
        </button>

        <button
          onClick={() => onSubmit(parsedRate / 100)}
          disabled={!isValid}
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function DateQuestion({
  onSubmit,
}: {
  prompt: string;
  onSubmit: (date: Date) => void;
}) {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const [isValid, setIsValid] = useState(false);

useEffect(() => {
  const parsedYear = parseInt(year);
  const valid =
    !!month &&
    !!year &&
    /^\d{4}$/.test(year) &&
    parsedYear >= 1990 &&
    parsedYear <= 2050;

  setIsValid(valid);
}, [month, year]);


const handleSubmit = () => {
  const parsedYear = parseInt(year);
  const parsedMonth = parseInt(month);
  const date = new Date(parsedYear, parsedMonth - 1);
  onSubmit(date);
};


  return (
    <div className="text-center space-y-6">
      {/* Question text */}
      <h2 className="text-3xl font-semibold text-center">
        When did you purchase your home?
      </h2>

      {/* Month and year input row */}
      <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto w-full">
        {/* Month dropdown */}
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="p-3 border border-neutral-400 rounded-xl text-lg w-full md:w-2/3"
        >
          <option value="">Select Month</option>
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
          ].map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </select>

        {/* Year input */}
        <input
          type="number"
          placeholder="Enter Year"
          className="p-3 border border-neutral-400 rounded-xl text-lg w-full md:w-1/3"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="1990"
          max="2050"
        />
      </div>

      {/* Continue button */}
      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}

function ZipCodeQuestion({
  onSubmit,
}: {
  onSubmit: (zipCode: string) => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", ""]);
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return; // Allow only single digit

    const newDigits = [...digits];
    newDigits[i] = val;
    setDigits(newDigits);

    if (val && i < 4) {
      inputsRef.current[i + 1]?.focus(); // Move to next input
    }
  };

  const handleBackspace = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus(); // Move back if empty
    }
  };

  const zipCode = digits.join("");
  const isValid = zipCode.length === 5;

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-semibold text-center">
        What is your home's ZIP code?
      </h2>

      <div className="flex justify-center gap-2 pt-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el!;
        }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleBackspace(i, e)}
            className="w-12 h-12 text-center text-2xl border border-neutral-400 rounded-md"
          />
        ))}
      </div>

      <button
        onClick={() => onSubmit(zipCode)}
        disabled={!isValid}
        className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        Continue
      </button>
    </div>
  );
}

function CreditScoreQuestion({
  onSubmit,
}: {
  onSubmit: (val: string | null) => void;
}) {
  const [score, setScore] = useState("");

  const options = [
    "Excellent (760+)",
    "Great (720 - 759)",
    "Good (660 - 719)",
    "Fair (Below 660)",
  ];

  const isValid = score !== "";

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-semibold text-center">
        What is your credit score range?
        <InfoTooltip className="inline-block align-middle ml-2">
          Your credit score will <strong>not</strong> affect your eligibility for cancellation, but it will help estimate savings.
          <br /><br />
          You can often find your{" "}
          <a
            href="https://www.consumerfinance.gov/ask-cfpb/where-can-i-get-my-credit-scores-en-316/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-green-800 hover:text-green-900"
          >
            credit score
          </a> through your credit card company or other free sources.
          <br /><br />
          If you don't know or prefer not to say, we’ll use PMI pricing for credit scores between <strong>720 and 760</strong>.
        </InfoTooltip>
      </h2>

      <div className="w-60 mx-auto">
        <select
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full p-3 border border-neutral-400 rounded-xl text-lg"
        >
          <option value="" disabled>
            Select Range
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 flex-wrap pt-2">
        <button
          onClick={() => onSubmit(null)}
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold"
        >
          Skip
        </button>
        <button
          onClick={() => onSubmit(score)}
          disabled={!isValid}
          className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}


function DelinquencyQuestion({
  onSubmit,
}: {
  onSubmit: (answers: {
    currentlyDelinquent: boolean;
    late30: boolean;
    late60: boolean;
  }) => void;
}) {
  const [currentlyDelinquent, setCurrentlyDelinquent] = useState(false);
  const [late30, setLate30] = useState(false);
  const [late60, setLate60] = useState(false);
  const [noMissed, setNoMissed] = useState(false);

  const handleDelinquent = (checked: boolean) => {
    setCurrentlyDelinquent(checked);
    if (checked) {
      setNoMissed(false);
    }
  };

  const handleLate30 = (checked: boolean) => {
    setLate30(checked);
    if (checked) {
      setNoMissed(false);
    }
  };

  const handleLate60 = (checked: boolean) => {
    setLate60(checked);
    if (checked) {
      setNoMissed(false);
    }
  };

  const handleNoMissed = (checked: boolean) => {
    setNoMissed(checked);
    if (checked) {
      setLate30(false);
      setLate60(false);
      setCurrentlyDelinquent(false);
    }
  };

  const isValid = currentlyDelinquent || late30 || late60 || noMissed;

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-semibold text-center">
        <span className="inline-block">
          Have you recently missed any mortgage payments?
          <InfoTooltip className="inline-flex align-baseline ml-2">
            <strong>Missed payments</strong> generally mean <strong>30 or more days</strong> past due, not just a few days late.
            <br /><br />
            Check your payment history by reviewing your <strong>credit report</strong> or contacting your servicer.
          </InfoTooltip>
        </span>
      </h2>

      <div className="flex flex-col gap-4 max-w-lg mx-auto text-left text-lg pt-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={currentlyDelinquent}
            onChange={(e) => handleDelinquent(e.target.checked)}
            disabled={noMissed}
            className="mt-1"
          />
          <span>Yes, I’m currently behind on my mortgage.</span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={late30}
            onChange={(e) => handleLate30(e.target.checked)}
            disabled={noMissed }
            className="mt-1"
          />
          <span>Yes, I’ve been 30+ days late in the past 12 months.</span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={late60}
            onChange={(e) => handleLate60(e.target.checked)}
            disabled={noMissed }
            className="mt-1"
          />
          <span>Yes, I’ve been 60+ days late in the past 24 months.</span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={noMissed}
            onChange={(e) => handleNoMissed(e.target.checked)}
            disabled={late30 || late60 || currentlyDelinquent}
            className="mt-1"
          />
          <span>No, I have not recently missed any payments.</span>
        </label>
      </div>

      <button
        onClick={() => onSubmit({ currentlyDelinquent, late30, late60 })}
        disabled={!isValid}
        className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        Continue
      </button>
    </div>
  );
}

function EquityBoostQuestion({
  onSubmit,
}: {
  onSubmit: (answer: {
    equityBoost: boolean;
    renovationValue?: number;
    additionalPayments?: number;
  }) => void;
}) {
  const [equityBoost, setEquityBoost] = useState<boolean | null>(null);
  const [renovationValue, setRenovationValue] = useState("");
  const [additionalPayments, setAdditionalPayments] = useState("");

  const parsedRenovation = parseFloat(renovationValue.replace(/[^\d.]/g, ""));
  const parsedPayments = parseFloat(additionalPayments.replace(/[^\d.]/g, ""));
  const isEstimateValid =
    (!isNaN(parsedRenovation) && parsedRenovation >= 0) ||
    (!isNaN(parsedPayments) && parsedPayments >= 0);

  const handleYes = () => {
    setEquityBoost(true);
  };

  const handleNo = () => {
    setEquityBoost(false);
    onSubmit({ equityBoost: false, renovationValue: 0, additionalPayments: 0 });
  };

  const handleContinue = () => {
    onSubmit({
      equityBoost: true,
      renovationValue: isNaN(parsedRenovation) ? 0 : parsedRenovation,
      additionalPayments: isNaN(parsedPayments) ? 0 : parsedPayments,
    });
  };

  const handleIDontKnow = () => {
    onSubmit({ equityBoost: true, renovationValue: 0 , additionalPayments: 0 });
  };

  const handleEstimateInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "renovation" | "payments"
    ) => {
    const raw = e.target.value.replace(/[^\d.]/g, "");
    const formatted = raw ? `$${parseFloat(raw).toLocaleString()}` : "";

    if (field === "renovation") setRenovationValue(formatted);
    else setAdditionalPayments(formatted);
};

  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-semibold text-center">
        Have you made renovations or additional mortgage payments?
        <InfoTooltip className="inline-block align-middle ml-2">
          If you’ve made <strong>extra payments</strong> on your mortgage or completed <strong>major renovations</strong> — like a new kitchen or finished basement — you may have <strong>more equity</strong> than this tool assumes.
        </InfoTooltip>
      </h2>

      <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
        <button
          onClick={handleYes}
          className={`w-full md:w-40 px-4 py-3 text-lg font-semibold border-2 border-neutral-400 rounded-xl ${equityBoost ? "bg-green-900 text-white border-white" : "bg-white hover:bg-green-100"}`}
        >
          Yes
        </button>
        <button
          onClick={handleNo}
          className="w-full md:w-40 px-4 py-3 bg-white text-lg font-semibold border-2 border-neutral-400 rounded-xl hover:bg-green-100"
        >
          No
        </button>
      </div>

{equityBoost && (
  <>
    <div className="max-w-sm mx-auto pt-4 space-y-6">
      {/* Renovation Estimate */}
      <div>
        <label className="block text-lg text-center pb-2 font-medium">
          Renovation Value
          <InfoTooltip size={16} className="inline-block align-middle ml-2">
            Rough estimate of how much your home value increased from completed renovations.
          </InfoTooltip>
        </label>
        <input
          type="text"
          className="w-60 p-3 border border-neutral-400 rounded-xl text-lg"
          value={renovationValue}
          onChange={(e) => handleEstimateInput(e, "renovation")}
          placeholder="$10,000"
        />
      </div>

      {/* Additional Payments Estimate */}
      <div>
        <label className="block text-lg text-center pb-2 font-medium">
          Additional Payments
          <InfoTooltip size={16} className="inline-block align-middle ml-2">
            Estimate of how much extra principal you've paid beyond your scheduled payments.
          </InfoTooltip>
        </label>
        <input
          type="text"
          className="w-60 p-3 border border-neutral-400 rounded-xl text-lg"
          value={additionalPayments}
          onChange={(e) => handleEstimateInput(e, "payments")}
          placeholder="$5,000"
        />
      </div>
    </div>

    {/* Buttons */}
    <div className="flex justify-center gap-4 flex-wrap pt-6">
      <button
        onClick={handleIDontKnow}
        className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold"
      >
        Skip
      </button>
      <button
        onClick={handleContinue}
        disabled={!isEstimateValid}
        className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  </>
)}
    </div>
  );
}


function PurchaseQuestion({
  prompt,
  onSubmit,
}: {
  prompt: React.ReactNode;
  onSubmit: (price: number, downPayment: number) => void;
}) {
  const [price, setPrice] = useState<string>("");
  const [downDollar, setDownDollar] = useState<string>("");
  const [downPercent, setDownPercent] = useState("");

  const parsedPrice = parseFloat(price);
  const parsedDownDollar = parseFloat(downDollar);
  const parsedDownPercent = parseFloat(downPercent);

  const priceValid = parsedPrice >= 50000 && parsedPrice <= 5000000;
  const downDollarValid = parsedDownDollar >= 0 && parsedDownDollar <= 3000000;
  const downPercentValid = parsedDownPercent >= 0 && parsedDownPercent <= 100;

  const isValid =
  parsedPrice > 0 &&
  (parsedDownDollar >= 0 || parsedDownPercent >= 0) &&
  downDollarValid &&
  downPercentValid &&
  priceValid;

const handleSync = (source: "dollar" | "percent", value: string) => {
  const val = parseFloat(value);

  if (source === "dollar") {
    setDownDollar(value);
    setDownPercent(""); // clear manual entry in percent field

    if (!isNaN(val) && parsedPrice > 0) {
      const calc = (val / parsedPrice) * 100;
      setDownPercent(`${calc.toFixed(1)}%`);
    }
  } else {
    setDownPercent(value);
    setDownDollar(""); // clear manual entry in dollar field

    if (!isNaN(val) && parsedPrice > 0) {
      setDownDollar(((val / 100) * parsedPrice).toFixed(0));
    }
  }
};


  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">{prompt}</h2>

      <div className="space-y-2">
        <label className="block text-left text-lg font-medium flex items-center gap-2">
  Original Purchase Price
  <InfoTooltip size={16}>
      This is the <strong>full price</strong> you paid at <strong>closing</strong>.<br /><br />
      Find it on your <strong>closing dislosure</strong> as the "sale price of property" or check the <br />
      price history on <strong>Zillow</strong> or <strong> Redfin</strong>.
  </InfoTooltip>
</label>
        <input
  type="text"
  className="w-full p-3 border border-neutral-400 rounded-xl text-lg"
  value={
    price !== ""
      ? `$${Number(price).toLocaleString()}`
      : ""
  }
  onChange={(e) => {
  const raw = e.target.value.replace(/[^\d]/g, "");
  setPrice(raw);
  setDownDollar("");
  setDownPercent("");
}}

  onBlur={(e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setPrice(raw);
  }}
  onFocus={(e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setPrice(raw);
  }}
  placeholder="$350,000"
/>


        <label className="block text-left text-lg font-medium mt-4 flex items-center gap-2">
  Down Payment
  <InfoTooltip size={16}>
      This is the <strong>purchase price</strong> minus the <strong>original mortgage amount</strong>.<br /><br />
      Find it on your <strong>closing disclosure</strong> under "down payment/funds from borrower."
  </InfoTooltip>
</label>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full">
          
<input
  type="text"
  className="w-full md:w-1/2 p-3 border border-neutral-400 rounded-xl text-lg"
  value={downPercent}
  onChange={(e) => {
    const raw = e.target.value.replace(/[^\d.]/g, ""); // allow decimals
    setDownPercent(raw);
    handleSync("percent", raw);
  }}
  onBlur={() => {
    if (downPercent !== "") {
      const formatted = `${parseFloat(downPercent).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
      setDownPercent(formatted);
    }
  }}
  onFocus={() => {
    const raw = downPercent.replace(/[^\d.]/g, "");
    setDownPercent(raw);
  }}
  placeholder="10%"
/>

  <div className="text-sm font-semibold text-neutral-600">OR</div>

 <input
  type="text"
  className="w-full md:w-1/2 p-3 border border-neutral-400 rounded-xl text-lg"
  value={
    downDollar !== ""
      ? `$${Number(downDollar).toLocaleString()}`
      : ""
  }
  onChange={(e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    handleSync("dollar", raw);
  }}
  onBlur={(e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setDownDollar(raw);
  }}
  onFocus={(e) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    setDownDollar(raw);
  }}
  placeholder="$35,000"
/>

</div>

      </div>

     <button
  onClick={() => onSubmit(parsedPrice, parseFloat(downDollar))}
  disabled={!isValid}
  className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
>
  Continue
</button>

    </div>
  );
}
