import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    patient: string;
    phone_number: string;
    address: string;
    date_of_birth: string;
    gender: 'Male' | 'Female';
    password: string;
    password_confirmation: string;
};

export default function PatientRegister() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role: 'patient',
        address: '',
        date_of_birth: '',
        gender: 'Male',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('patient.store.register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Patient Registration" description="Create your patient account">
            <Head title="Patient Registration" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="patient@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            type="text"
                            required
                            tabIndex={3}
                            value={data.first_name}
                            onChange={e => setData('first_name', e.target.value)}
                            disabled={processing}
                            placeholder="First name"
                        />
                        <InputError message={errors.first_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            type="text"
                            required
                            tabIndex={4}
                            value={data.last_name}
                            onChange={e => setData('last_name', e.target.value)}
                            disabled={processing}
                            placeholder="Last name"
                        />
                        <InputError message={errors.last_name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                            id="phone_number"
                            type="tel"
                            required
                            tabIndex={5}
                            value={data.phone_number}
                            onChange={e => setData('phone_number', e.target.value)}
                            disabled={processing}
                            placeholder="+1234567890"
                        />
                        <InputError message={errors.phone_number} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            type="text"
                            required
                            tabIndex={6}
                            value={data.address}
                            onChange={e => setData('address', e.target.value)}
                            disabled={processing}
                            placeholder="Your address"
                        />
                        <InputError message={errors.address} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date_of_birth">Date of Birth</Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            required
                            tabIndex={7}
                            value={data.date_of_birth}
                            onChange={e => setData('date_of_birth', e.target.value)}
                            disabled={processing}
                        />
                        <InputError message={errors.date_of_birth} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <select
                            id="gender"
                            required
                            tabIndex={8}
                            value={data.gender}
                            onChange={e => setData('gender', e.target.value as 'Male' | 'Female')}
                            disabled={processing}
                            className="rounded-md border border-input px-3 py-2"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <InputError message={errors.gender} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={9}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={10}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={11} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Register as Patient
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm mt-4">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={12}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
