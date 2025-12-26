import { Suspense } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-secondary mt-2">Loading...</p>
        </div>
      }>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
