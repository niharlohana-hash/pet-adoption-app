import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-500 mb-4">
        <PawPrint className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2">
        Page Not Found
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        Oops! It looks like this page wandered off like a curious puppy.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="md" icon={ArrowLeft}>
          Return to Home
        </Button>
      </Link>
    </div>
  );
};
