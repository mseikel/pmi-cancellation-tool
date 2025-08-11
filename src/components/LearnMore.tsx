import { FadeInWhenVisible } from './FadeInWhenVisible';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react'; // import the wide arrow

export function LearnMore() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <section className="snap-start h-screen relative flex justify-center items-center px-6 py-16 max-w-4xl mx-auto text-black">
  <FadeInWhenVisible>
    <h2 className="font-heading text-3xl md:text-5xl tracking-wider uppercase text-center">
      Why might my <strong>Private Mortgage Insurance</strong> (PMI) be <strong>Unnecessary</strong>?
    </h2>
  </FadeInWhenVisible>

  <div className="absolute bottom-4 flex justify-center w-full">
    <ChevronDown size={64} className="text-green-800 animate-bounce" />
  </div>
</section>


      {/* SECTION 2 – UNDERWATER + FIRST-TIME HOMEBUYER */}
      <section className="snap-start h-screen flex flex-col relative justify-center items-center px-6 py-16 max-w-3xl mx-auto space-y-10 text-lg leading-relaxed text-black">
        <FadeInWhenVisible>
          <p className="text-2xl md:text-4xl leading-snug max-w-3xl">
            When buying a home, putting at least <strong>20 percent</strong> down protects <strong>lenders</strong> from mortgage default.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible>
          <div className="flex flex-col md:flex-row justify-end gap-10 md:gap-24 items-center md:items-start text-right">
            <img src={`${import.meta.env.BASE_URL}home-icon.png`} alt="Home icon" className="w-32 h-32 md:w-44 md:h-44 flex-shrink-0" />
            <p className="text-2xl md:text-4xl leading-snug max-w-xl">
              But many <strong>borrowers</strong> can't afford 20 percent down, especially for their <strong>first</strong> home.
            </p>
          </div>
        </FadeInWhenVisible>
        <div className="absolute bottom-4 flex justify-center w-full">
    <ChevronDown size={64} className="text-green-800 animate-bounce" />
  </div>
      </section>

      {/* SECTION 3 – WHAT IS PMI */}
      <section className="snap-start h-screen relative flex flex-col justify-center items-center px-6 py-16 max-w-3xl mx-auto text-center text-lg leading-relaxed text-black space-y-6">
        <FadeInWhenVisible>
          <p className="text-2xl md:text-4xl leading-snug max-w-2xl mx-auto">
            So lenders offer an alternative:<br />
            <strong>PRIVATE MORTGAGE INSURANCE</strong>.
          </p>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <img src={`${import.meta.env.BASE_URL}bank-icon.png`} alt="Bank icon" className="w-40 h-auto mx-auto" />
        </FadeInWhenVisible>
        <div className="absolute bottom-4 flex justify-center w-full">
    <ChevronDown size={64} className="text-green-800 animate-bounce" />
  </div>
      </section>

           {/* SECTION 4 – COST + DEFAULT PROTECTION */}
      <section className="snap-start relative h-screen flex flex-col justify-center items-center px-6 py-16 max-w-3xl mx-auto text-center text-lg leading-relaxed text-black space-y-6 relative">
        <img src={`${import.meta.env.BASE_URL}dollar-icon.png`} alt="Dollar icon" className="place-self-end w-24 h-24 md:w-32 md:h-32 rotate-[30deg]" />
        <FadeInWhenVisible>
          <p className="text-2xl md:text-4xl leading-snug max-w-2xl mx-auto">
            With <strong>PMI</strong>, consumers can make a smaller down payment
            like <strong>10 percent</strong>.<br />
            <br />
            Lenders then require <strong>borrowers</strong> to pay 
            mortgage insurers roughly <strong>$100</strong> a month.
          </p>
        </FadeInWhenVisible>
        <div className="absolute bottom-4 flex justify-center w-full">
    <ChevronDown size={64} className="text-green-800 animate-bounce" />
  </div>
        <img src={`${import.meta.env.BASE_URL}dollar-icon.png`} alt="Dollar icon" className="place-self-start w-24 h-24 md:w-32 md:h-32 rotate-[-30deg]" />
      </section>

      {/* SECTION 5 – PMI CANCELLATION + LENDER SAFETY */}
      <section className="snap-start relative h-screen flex flex-col justify-center px-6 py-16 max-w-3xl mx-auto text-lg leading-relaxed text-black space-y-12">
  <FadeInWhenVisible>
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Icon */}
      <img
        src={`${import.meta.env.BASE_URL}check-icon.png`}
        alt="Check icon"
        className="w-32 h-32 md:w-40 md:h-40 object-contain"
      />
      <p className="text-2xl md:text-4xl leading-snug max-w-2xl text-center md:text-right">
        By <strong>law</strong>, PMI is <strong>automatically cancelled </strong> 
        once a borrower has paid off <strong>22 percent</strong> of the property's <strong>original</strong> value.
      </p>
    </div>
  </FadeInWhenVisible>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
  <ChevronDown size={64} className="text-green-800 animate-bounce" />
</div>

      </section>

      {/* SECTION 6 – PROPERTY VALUE SURGE */}
<section className="snap-start h-screen relative flex justify-center items-center max-w-3xl mx-auto px-6 text-black">
  <FadeInWhenVisible>
    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 w-full">
      
      {/* Text */}
      <div className="space-y-6 max-w-xl">
        <p className="text-2xl md:text-4xl leading-snug text-center md:text-left">
          But home prices have <strong>increased</strong> significantly.
        </p>
        <p className="text-2xl md:text-4xl leading-snug text-center md:text-left">
          And many borrowers have <strong>sufficient equity</strong> to cancel their PMI payments.
        </p>
      </div>

      {/* Image */}
      <img
        src={`${import.meta.env.BASE_URL}graph-icon.png`}
        alt="Graph icon"
        className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] flex-shrink-0"
      />
    </div>
  </FadeInWhenVisible>

  {/* Down Arrow */}
  <div className="absolute bottom-4 flex justify-center w-full">
    <ChevronDown size={64} className="text-green-800 animate-bounce" />
  </div>
</section>


      {/* SECTION 7 – COST SAVINGS */}
      <section className="snap-start relative h-screen flex justify-center items-center max-w-3xl mx-auto px-6 text-black">
        <FadeInWhenVisible>
          <div className="py-24 w-full text-center space-y-3">
            <p className="text-2xl md:text-4xl leading-snug max-w-3xl mx-auto">
              Based on current home values, <br className="hidden md:block"  /> <strong>2.6 million</strong> borrowers could save <br className="hidden md:block" />
              <strong>$1,200</strong> in the first year by cancelling PMI.
            </p>
            <div className="flex justify-center">
              <img
                src={`${import.meta.env.BASE_URL}usa-icon.png`}
                alt="USA icon"
                className="w-[250px] h-[250px] object-contain"
              />
            </div>
          </div>
        </FadeInWhenVisible>
        <div className="absolute bottom-4 flex justify-center w-full">
    <ChevronDown size={64} className="text-green-800 animate-bounce" />
  </div>
      </section>


      {/* SECTION 9 – CALL TO ACTION */}
<section className="snap-start h-screen flex items-center justify-center px-6 text-black">
  <FadeInWhenVisible>
  <div className="max-w-4xl mx-auto space-y-6 md:space-y-16 text-center w-full">
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
        <div className="w-full md:w-2/3 bg-white px-6 py-4 rounded-xl text-xl text-center md:text-left  md:text-2xl leading-snug h-full flex items-center">
          Take a few minutes to determine if you might be eligible to cancel PMI.
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
        <div className="w-full md:w-2/3 bg-white px-6 py-4 rounded-xl text-center md:text-left text-xl md:text-2xl leading-snug h-full flex items-center">
          Explore our resources to simplify the PMI cancellation process.
        </div>
      </div>
    </div>
  </div>
  </FadeInWhenVisible>
</section>

    </div>
  );
}
