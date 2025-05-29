import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PenSquare, FolderPlus, Beaker, Microscope, TestTube } from 'lucide-react';
import { User, Stethoscope, FlaskConical, Calendar, FileText, MessageCircle, Bell, CreditCard, CalendarClock, Clock, DollarSign, TrendingUp  } from 'lucide-react';
import AppLogo from './app-logo';


export function AppSidebar() {

    const {auth}= usePage().props;
    console.log('Auth User', auth.user);
    const user = auth.user as {id:number; name:string; role:'admin'|'user'} |null;
    //const role = auth?.user?.role;
    console.log('Auth',user);


const mainNavItems: NavItem[] = user?.role === 'admin' ? [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Patients',
        href: '/admin/patients',
        icon: User,
    },
    {
        title: 'Doctors',
        href: '/admin/doctors',
        icon: Stethoscope,
    },
    {
        title: 'Lab Technicians',
        href: '/admin/labtechnicians',
        icon: Microscope,
    },
    {
        title: 'Appointments',
        href: '/admin/appointments',
        icon: Calendar,
    },
    {
        title: 'Prescriptions',
        href: '/admin/prescriptions',
        icon: FileText,
    },
    {
        title: 'Laboratory',
        href: '/admin/laboratory',
        icon: FlaskConical,
    },
    {
        title: 'Messages',
        href: '/admin/messages',
        icon: MessageCircle,
    },
    {
        title: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
    },
    /*{
        title: 'Reports & Analytics',
        href: '/admin/reports',
        icon: TrendingUp,
    },*/
    {
        title: 'Billing & Payments',
        href: '/admin/billing',
        icon: CreditCard,
    },
]: user?.role === 'doctor' ?
[
    {
        title: 'Dashboard',
        href: '/doctor/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Schedule',
        href: '/doctor/schedule',
        icon: CalendarClock,
    },
    {
        title: 'Appointments',
        href: '/doctor/appointments',
        icon: Calendar,
    },
    {
        title: 'Patients',
        href: '/doctor/patients',
        icon: User,
    },
    {
        title: 'Lab Technicians',
        href: '/doctor/labtechnicians',
        icon: Microscope,
    },
    {
        title: 'Laboratory',
        href: '/doctor/laboratory',
        icon: FlaskConical,
    },
    {
        title: 'Prescriptions',
        href: '/doctor/prescriptions',
        icon: FileText,
    },
    {
        title: 'Messages',
        href: '/doctor/messages',
        icon: MessageCircle,
    },
    {
        title: 'Notifications',
        href: '/doctor/notifications',
        icon: Bell,
    },
]: user?.role === 'labtechnician' ?
[
    {
        title: 'Dashboard',
        href: '/labtechnician/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Laboratory',
        href: '/labtechnician/laboratory',
        icon: FlaskConical,
    },
    {
        title: 'Doctors',
        href: '/labtechnician/doctors',
        icon: Stethoscope,
    },
    {
        title: 'Patients',
        href: '/labtechnician/patients',
        icon: User,
    },
    {
        title: 'Messages',
        href: '/labtechnician/messages',
        icon: MessageCircle,
    },
    {
        title: 'Notifications',
        href: '/labtechnician/notifications',
        icon: Bell,
    },
]: user?.role === 'patient' ?
[
    {
        title: 'Dashboard',
        href: '/patient/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Appointments',
        href: '/patient/appointments',
        icon: Calendar,
    },
    {
        title: 'Doctors',
        href: '/patient/doctors',
        icon: Stethoscope,
    },
    {
        title: 'Laboratory',
        href: '/patient/laboratory',
        icon: FlaskConical,
    },
    {
        title: 'Prescriptions',
        href: '/patient/prescriptions',
        icon: FileText,
    },
    {
        title: 'Medical Records',
        href: '/patient/medicalrecords',
        icon: BookOpen,
    },
    {
        title: 'Messages',
        href: '/patient/messages',
        icon: MessageCircle,
    },
    {
        title: 'Notificaitons',
        href: '/patient/notifications',
        icon: Bell,
    },
    {
        title: 'Billing',
        href: '/patient/billing',
        icon: CreditCard,
    },
]: [];

/*const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];*/

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <div>
                                <AppLogo />
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}


/** */
