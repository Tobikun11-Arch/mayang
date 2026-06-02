'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowLeft, Send} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to sign in
      </Link>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Forgot password?
        </h2>
        <p className="text-muted-foreground">
          Enter your email and we&apos;ll send you a 6-digit code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#3c5e45]"
          size="lg"
          disabled={isSubmitting}
        >
          <Send size={18} />
          {isSubmitting ? 'Sending...' : 'Send Code'}
        </Button>
      </form>
    </div>
  );
}