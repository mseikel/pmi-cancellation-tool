import { FadeInWhenVisible } from './FadeInWhenVisible';
import { Link } from 'react-router-dom';

export function LearnMore() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      
      {/* SECTION 1 – TITLE */}
      <section className="snap-start h-screen flex justify-center items-center px-6 py-16 max-w-4xl mx-auto text-black">
        <FadeInWhenVisible>
          <h2 className="font-heading text-3xl md:text-5xl tracking-wider uppercase text-center">
            What is <strong>Unnecessary</strong> Private Mortgage Insurance <strong>(PMI)</strong>?
          </h2>
        </FadeInWhenVisible>
      </section>

      {/* SECTION 2 – UNDERWATER + FIRST-TIME HOMEBUYER */}
      <section className="snap-start h-screen flex flex-col justify-center items-center px-6 py-16 max-w-3xl mx-auto space-y-16 text-lg leading-relaxed text-black">
        <FadeInWhenVisible>
          <p className="text-xl md:text-2xl leading-snug max-w-3xl">
            When buying a home, putting at least <strong>20 percent</strong> down protects <strong>lenders</strong> from mortgage default.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible>
          <div className="flex justify-end gap-16 items-start text-right">
            <img src={`${import.meta.env.BASE_URL}home-icon.png`} alt="Home icon" className="w-40 h-40 flex-shrink-0" />
            <p className="text-xl md:text-2xl leading-snug max-w-xl">
              But many people,<br />especially <strong>first-time homebuyers</strong>,<br />don’t have <strong>$83,000</strong> saved to purchase <br />the average <strong>$415,000</strong> house.
            </p>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* SECTION 3 – WHAT IS PMI */}
      <section className="snap-start h-screen flex flex-col justify-center items-center px-6 py-16 max-w-3xl mx-auto text-center text-lg leading-relaxed text-black space-y-6">
        <FadeInWhenVisible>
          <p className="text-xl md:text-2xl leading-snug max-w-2xl mx-auto">
            So lenders offer an alternative:<br />
            <strong>PRIVATE MORTGAGE INSURANCE (PMI)</strong>.
          </p>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <img src={`${import.meta.env.BASE_URL}bank-icon.png`} alt="Bank icon" className="w-40 h-auto mx-auto" />
        </FadeInWhenVisible>
      </section>

           {/* SECTION 4 – COST + DEFAULT PROTECTION */}
      <section className="snap-start h-screen flex flex-col justify-center items-center px-6 py-16 max-w-3xl mx-auto text-center text-lg leading-relaxed text-black space-y-6 relative">
        <img src={`${import.meta.env.BASE_URL}dollar-icon.png`} alt="Dollar icon" className="place-self-end w-24 h-24 rotate-[30deg]" />
        <FadeInWhenVisible>
          <p className="text-xl md:text-2xl leading-snug max-w-2xl mx-auto">
            With <strong>PMI</strong>, consumers often make a down payment <br />
            of <strong>3, 5, or 10 percent</strong>.<br />
            <br />
            Lenders then require <strong>borrowers</strong> to pay private<br />
            mortgage insurers roughly <strong>$100</strong> a month.
          </p>
        </FadeInWhenVisible>
        <img src={`${import.meta.env.BASE_URL}dollar-icon.png`} alt="Dollar icon" className="place-self-start w-24 h-24 rotate-[-30deg]" />
      </section>

      {/* SECTION 5 – PMI CANCELLATION + LENDER SAFETY */}
      <section className="snap-start h-screen flex flex-col justify-center px-6 py-16 max-w-3xl mx-auto text-left text-lg leading-relaxed text-black space-y-12 relative">
        <FadeInWhenVisible>
          <p className="text-xl md:text-2xl leading-snug max-w-2xl">
            By <strong>law</strong>, PMI is <strong>automatically cancelled</strong><br />
            once a homeowner has paid off<br />
            <strong>22 percent</strong> of the property's <strong>original</strong> value.
          </p>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <p className="text-xl md:text-2xl leading-snug max-w-xl">
            With this buffer, the <strong>lender</strong> is<br />unlikely to lose money,<br />
            even if prices <strong>fall</strong>.
          </p>
        </FadeInWhenVisible>
        {/* <FadeInWhenVisible> */}
          <img
            src={`${import.meta.env.BASE_URL}check-icon.png`}
            className="hidden md:block absolute right-[10%] top-[50%] -translate-y-1/3 w-40 h-40 object-contain"
          />
        {/* </FadeInWhenVisible> */}
      </section>

      {/* SECTION 6 – PROPERTY VALUE SURGE */}
      <section className="snap-start h-screen flex justify-center items-center max-w-3xl mx-auto px-6 text-black">
        <FadeInWhenVisible>
          <div className="flex justify-end items-start gap-16 w-full">
            <img
              src={`${import.meta.env.BASE_URL}graph-icon.png`}
              alt="Graph icon"
              className="w-[200px] h-[200px] flex-shrink-0 mt-1"
            />
            <div className="text-right space-y-6 max-w-xl">
              <p className="text-xl md:text-2xl leading-snug">
                However, property values have<br />
                <strong>surged</strong> since 2020.
              </p>
              <p className="text-xl md:text-2xl leading-snug">
                Millions of homeowners have<br />
                built at least <strong>20 percent equity</strong><br />
                based on current prices.
              </p>
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* SECTION 7 – COST SAVINGS */}
      <section className="snap-start h-screen flex justify-center items-center max-w-3xl mx-auto px-6 text-black">
        <FadeInWhenVisible>
          <div className="py-24 w-full text-center space-y-3">
            <p className="text-xl md:text-2xl leading-snug max-w-3xl mx-auto">
              <strong>2.6 million</strong> homeowners would save <strong>$3.2 billion</strong><br />
              in the first year (or <strong>$1,200</strong> each), if PMI was<br />
              cancelled based on <strong>today's</strong> home values.
            </p>
            <div className="flex justify-center">
              <img
                src={`${import.meta.env.BASE_URL}usa-icon.png`}
                alt="USA icon"
                className="w-[300px] h-[300px] object-contain"
              />
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* SECTION 8 – TECHNOLOGY + GOVERNMENT */}
      <section className="snap-start h-screen flex flex-col justify-center max-w-3xl mx-auto px-6 space-y-8 text-black">
        <FadeInWhenVisible>
          <div className="flex justify-between items-start gap-3 w-full text-left">
            <p className="text-xl md:text-2xl leading-snug max-w-xl">
              Mortgage companies <strong>already</strong><br />
              have the <strong>technology</strong> to track<br />
              <strong>equity</strong> based on current prices.
            </p>
            <img
              src={`${import.meta.env.BASE_URL}tech-icon.png`}
              alt="Technology icon"
              className="w-40 h-40 object-contain flex-shrink-0 -mt-8 mr-10"
            />
          </div>
        </FadeInWhenVisible>

        <FadeInWhenVisible>
          <p className="text-xl md:text-2xl leading-snug max-w-3xl text-right w-full">
            But the <strong>government</strong> doesn’t <a
              href="https://www.americanbanker.com/opinion/the-fhfa-could-save-borrowers-billions-with-automated-pmi-cancellation#:~:text=The%20FHFA%20should%20direct%20the,services%20when%20to%20cancel%20PMI."
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-green-800 hover:text-green-900 ml-1"
            >require</a> their use to 
            automatically cancel <strong>UNNECESSARY PMI</strong>.
          </p>
        </FadeInWhenVisible>
      </section>

      {/* SECTION 9 – CALL TO ACTION */}
<section className="snap-start h-screen flex items-center justify-center px-6 py-24 text-black">
  <FadeInWhenVisible>
  <div className="max-w-4xl mx-auto space-y-16 text-center w-full">
    {/* Large Header */}
    <h2 className="font-heading text-3xl md:text-5xl tracking-wider uppercase">
      <strong>YOU</strong> can help end <br />
      <span className="font-bold">UNNECESSARY PMI.</span>
    </h2>

    {/* Button + text stack */}
    <div className="flex flex-col gap-8 pt-1 items-center text-left w-full">
      {/* Row 1 */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-4">
        <div className="w-full md:w-1/3">
          <Link
            to="/quiz"
            className="flex items-center justify-center w-full h-full bg-green-900 hover:bg-green-800 text-white text-2xl px-6 py-4 rounded-xl border-2 border-white font-semibold text-center"
          >
            CHECK ELIGIBILITY
          </Link>
        </div>
        <div className="w-full md:w-2/3 bg-[#f5f1ea] px-6 py-4 rounded-xl text-base md:text-lg leading-snug h-full flex items-center">
          Take a few minutes to determine if you might be eligible to cancel PMI. But – heads up – the current cancellation
          process can be lengthy and expensive.
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl gap-4">
        <div className="w-full md:w-1/3">
          <a
            href="#resources"
            className="flex items-center justify-center w-full h-full bg-green-900 hover:bg-green-800 text-white text-2xl px-6 py-4 rounded-xl border-2 border-white font-semibold text-center"
          >
            TAKE ACTION
          </a>
        </div>
        <div className="w-full md:w-2/3 bg-[#f5f1ea] px-6 py-4 rounded-xl text-base md:text-lg leading-snug h-full flex items-center">
          Explore our resources to simplify the cancellation process, and join us in pushing for policy changes to end unnecessary PMI for good.
        </div>
      </div>
    </div>
  </div>
  </FadeInWhenVisible>
</section>

    </div>
  );
}
