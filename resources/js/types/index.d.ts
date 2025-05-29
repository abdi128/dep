import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface DateRangeFilter {
    start_date: string;
    end_date: string;
}

export interface ReportsPageProps {
    stats: {
        total_patients: number;
        total_doctors: number;
        total_appointments: number;
        total_prescriptions: number;
        total_lab_tests: number;
        total_revenue: number;
    };
    timeStats: {
        new_patients: number;
        completed_appointments: number;
        pending_prescriptions: number;
        revenue: number;
    };
    appointmentTrends: Record<string, number>;
    revenueByPayment: Record<string, number>;
    patientDemographics: {
        gender: Record<string, number>;
        age_groups: Record<string, number>;
    };
    doctorStats: Array<{
        id: number;
        first_name: string;
        last_name: string;
        specialty: string;
        appointments_count: number;
        user: {
            email: string;
        };
    }>;
    filters: DateRangeFilter;
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
