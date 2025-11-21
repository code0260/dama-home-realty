'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="mb-6 p-6 bg-[#B49162]/10 rounded-full">
          <Icon className="w-12 h-12 text-[#B49162]" />
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

      {action && (
        <Button
          onClick={action.onClick}
          asChild={!!action.href}
          className="bg-[#B49162] hover:bg-[#9A7A4F] text-white"
        >
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      )}

      {children}
    </div>
  );
}

