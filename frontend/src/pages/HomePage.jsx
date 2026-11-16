import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle,
  Home,
  MessageCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { PetCard } from '../components/pets/PetCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { api } from '../services/api';

export const HomePage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.pets.getFeatured();
        setFeaturedPets(res.pets || []);
      } catch (err) {
        console.error('Failed to load featured pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const categories = [
    {
      name: 'Dogs',
      icon: '🐶',
      count: 'Golden, Frenchies & more',
      link: '/pets?species=Dog',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
    },
    {
      name: 'Cats',
      icon: '🐱',
      count: 'Siamese, Shorthair & more',
      link: '/pets?species=Cat',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900',
    },
    {
      name: 'Rabbits',
      icon: '🐰',
      count: 'Holland Lops, Lionheads',
      link: '/pets?species=Rabbit',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900',
    },
    {
      name: 'Birds',
      icon: '🦜',
      count: 'Cockatiels, Parakeets',
      link: '/pets?species=Bird',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-transparent dark:from-brand-950/20 dark:via-slate-950 dark:to-transparent py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Over 1,200+ rescued animals placed into loving homes</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Find your new <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500">
                  best friend
                </span>{' '}
                today.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect with rescue dogs, cats, rabbits, and birds from verified non-profit shelters.
                Experience seamless applications, real-time updates, and direct shelter chat.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/pets">
                  <Button size="lg" variant="primary" icon={Search} className="w-full sm:w-auto shadow-lg shadow-brand-500/25">
                    Browse All Pets
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    How Adoption Works
                  </Button>
                </a>
              </div>

              {/* Metric Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 text-center sm:text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    100%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Vaccinated & Vet-Checked</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    24-48h
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Fast Application Review</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    99.4%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Forever Home Matches</p>
                </div>
              </div>
            </div>

            {/* Right Hero Collage */}
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                  alt="Happy adopted dogs playing"
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <p className="text-xs uppercase font-semibold text-brand-300 tracking-wider">
                      Adoption Success Story
                    </p>
                    <p className="text-base font-bold">
                      "Adopting Leo was the best decision of our family's life."
                    </p>
                    <p className="text-xs text-white/80">Emma & David with rescue lab Leo</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Verified Shelter Quality
                  </p>
                  <p className="text-[11px] text-slate-500">Every animal health-certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore By Species */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Explore by Companion
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your preferred animal species to view available rescues.
            </p>
          </div>
          <Link
            to="/pets"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.link}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block ${cat.bgColor}`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {cat.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Pets Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
              <PawPrint className="w-4 h-4" /> Ready for Adoption
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Meet Our Featured Friends
            </h2>
          </div>
          <Link to="/pets">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              See All Available Pets
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4)
              .fill(0)
              .map((_, i) => <SkeletonCard key={i} />)
          ) : featuredPets.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              No pets available right now. Check back soon!
            </div>
          ) : (
            featuredPets.map((pet) => <PetCard key={pet._id} pet={pet} />)
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-100/60 dark:bg-slate-900/40 py-16 sm:py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Simple 3-Step Adoption Process
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We make finding and adopting your companion transparent, humane, and hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-brand-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Find Your Match
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Filter by species, breed, age, size, and lifestyle compatibility. View full photos, temperament profiles, and medical records.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-amber-500/20">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Submit Online Application
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Fill in our quick online adoption questionnaire. Our certified shelter team reviews your application within 24 to 48 hours.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-md shadow-emerald-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Meet & Welcome Home
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Chat in real-time with shelter caregivers, schedule an in-person meet & greet, and bring your newest family member home!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
