// HeroSection.tsx
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection(): JSX.Element {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-12">
      <h1 className="font-heading text-2xl md:text-5xl tracking-wider uppercase">
         <span className="font-bold">2 Million</span> Homeowners <br />
        Pay <span className="font-bold">Unnecessary</span>  Private <br /> 
        Mortgage Insurance.
    </h1>
      <p className="text-2xl md:text-4xl mt-16">
        Are you one of them?
      </p>
      <div className="mt-6 flex justify-center gap-4 flex-wrap">
        <Link
            to="/learn"
             className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold"
         >
            FIND OUT MORE
        </Link>

        <Link
           to="/quiz"
           className="bg-green-900 hover:bg-green-800 text-white text-lg px-6 py-3 rounded-xl border-2 border-white font-semibold"
      >
            TAKE THE QUIZ
        </Link>
        </div>
    </section>
  );
}
