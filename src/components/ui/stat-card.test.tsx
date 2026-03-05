import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from '@/components/ui/stat-card';
import { Wallet } from 'lucide-react';
import React from 'react';

describe('StatCard', () => {
    it('renders the label and value correctly', () => {
        render(
            <StatCard
                title="Total Revenue"
                value="₹ 45.2L"
                trend="+12.5%"
                icon={<Wallet size={20} />}
                color="text-emerald-600"
            />
        );

        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getByText('₹ 45.2L')).toBeInTheDocument();
        expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });
});
