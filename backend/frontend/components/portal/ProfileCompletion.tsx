'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { User as UserType } from '@/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProfileCompletionProps {
  user: UserType | null;
}

export function ProfileCompletion({ user }: ProfileCompletionProps) {
  const completion = useMemo(() => {
    if (!user) return { percentage: 0, missing: [] };

    const checks = [
      { key: 'name', label: 'Full Name', value: user.name },
      { key: 'email', label: 'Email', value: user.email },
      { key: 'email_verified', label: 'Email Verified', value: user.email_verified_at },
      { key: 'phone', label: 'Phone Number', value: (user as any).phone },
      { key: 'address', label: 'Address', value: (user as any).address },
    ];

    const completed = checks.filter((check) => check.value).length;
    const total = checks.length;
    const percentage = Math.round((completed / total) * 100);

    const missing = checks
      .filter((check) => !check.value)
      .map((check) => check.label);

    return { percentage, missing, completed, total };
  }, [user]);

  if (!user || completion.percentage === 100) {
    return null;
  }

  return (
    <Card className="border-secondary/20 bg-linear-to-br from-secondary/5 via-transparent to-secondary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-secondary" />
            Profile Completion
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              completion.percentage >= 80
                ? 'border-green-500 text-green-700 dark:text-green-400'
                : completion.percentage >= 50
                ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400'
                : 'border-red-500 text-red-700 dark:text-red-400'
            )}
          >
            {completion.percentage}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {completion.completed} of {completion.total} fields completed
            </span>
            <span className="font-semibold text-primary dark:text-white">
              {completion.percentage}%
            </span>
          </div>
          <Progress value={completion.percentage} className="h-2" />
        </div>

        {/* Missing Fields */}
        {completion.missing.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-primary dark:text-white">
              Complete your profile:
            </p>
            <ul className="space-y-1">
              {completion.missing.map((field, index) => {
                const Icon =
                  field.includes('Email') || field.includes('Mail')
                    ? Mail
                    : field.includes('Phone')
                    ? Phone
                    : User;

                return (
                  <motion.li
                    key={field}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span>{field}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Complete Profile Button */}
        <Button
          asChild
          className="w-full bg-secondary hover:bg-secondary/90 text-white"
        >
          <Link href="/portal/profile">
            Complete Profile
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

