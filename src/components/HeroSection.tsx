// HeroSection.tsx
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="h-[calc(100dvh-var(--nav-h))] flex flex-col justify-center items-center text-center px-4 -translate-y-4">
      <h1 className="font-heading text-[1.88rem] md:text-5xl tracking-wider uppercase leading-tight">
        Are you paying <br className="md:hidden" /> 
        <span className="font-bold">unnecessary</span> <br className="hidden md:block" />
        private <br className="md:hidden" />mortage insurance?
      </h1>

      <p className="text-2xl md:text-4xl mt-8 md:mt-12">
        Answer a few questions <br className="md:hidden" />
        to check <br className="hidden md:block" /> if you're one of <br className="md:hidden" /> 
        over <strong>2 million</strong> homeowners <br className="hidden md:block" /> <br className="md:hidden" /> 
        likely eligible to save <strong>$1,200</strong>.
      </p>

      <div className="mt-8 md:mt-12 flex justify-center w-full">
        <Link
          to="/quiz"
          className="bg-green-900 hover:bg-green-800 text-white text-lg md:text-xl w-80 py-3 rounded-xl border-2 border-white font-semibold text-center"
        >
          FIND OUT HOW MUCH <br className="md:hidden" /> YOU COULD SAVE.
        </Link>
      </div>
    </section>
  );
}
