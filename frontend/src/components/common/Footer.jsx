import React from 'react';
import { PawPrint, Heart, Shield, Award, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Pawsome<span className="text-brand-500">Haven</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Connecting compassionate families with rescue pets across the region. Every animal deserves a loving forever home.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>501(c)(3) Certified Non-Profit Shelter</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Adopt a Pet
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/pets?species=Dog" className="hover:text-brand-500 transition-colors">
                  Rescue Dogs & Puppies
                </Link>
              </li>
              <li>
                <Link to="/pets?species=Cat" className="hover:text-brand-500 transition-colors">
                  Rescue Cats & Kittens
                </Link>
              </li>
              <li>
                <Link to="/pets?species=Rabbit" className="hover:text-brand-500 transition-colors">
                  Rabbits & Small Pets
                </Link>
              </li>
              <li>
                <Link to="/pets?species=Bird" className="hover:text-brand-500 transition-colors">
                  Birds & Parrots
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <span className="hover:text-brand-500 cursor-pointer">Adoption Checklist</span>
              </li>
              <li>
                <span className="hover:text-brand-500 cursor-pointer">Pet Health & Vaccinations</span>
              </li>
              <li>
                <span className="hover:text-brand-500 cursor-pointer">Shelter Volunteer Program</span>
              </li>
              <li>
                <span className="hover:text-brand-500 cursor-pointer">Donation & Foster Care</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Shelter HQ
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                <span>100 Pawsome Way, San Francisco, CA</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                <span>(415) 555-PAWS (7297)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                <span>adoptions@pawsome.org</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Pawsome Haven Foundation. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for pet welfare & loving homes.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
