<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /*
      Show the login page.

    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }


      Handle an incoming authentication request.

     public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = auth()->user();

        return match ($user->role) {
            'patient' => to_route('patient.dashboard'),
            'doctor' => to_route('doctor.dashboard'),
            'labtechnician' => to_route('labtechnician.dashboard'),
            'admin' => to_route('admin.dashboard'),
            default => to_route('patient.dashboard'),
        };
    }


      Destroy an authenticated session.

    public function create(Request $request): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

     * Show Patient login page.

    public function createPatient(Request $request): Response
    {
        return Inertia::render('patient/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }


     * Handle Patient login.

    public function storePatient(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = auth()->user();

        return redirect()->intended(route('doctor.dashboard', absolute: false));
    }


     * Show Doctor login page.

    public function createDoctor(Request $request): Response
    {
        return Inertia::render('doctor/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }


     * Handle Doctor login.

    public function storeDoctor(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = auth()->user();

        return redirect()->intended(route('doctor.dashboard', absolute: false));
    }

     * Show Lab Technician login page.

    public function createLabTechnician(Request $request): Response
    {
        return Inertia::render('labtechnician/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }


     * Handle Lab Technician login.

    public function storeLabTechnician(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = auth()->user();

        return redirect()->intended(route('labtechnician.dashboard', absolute: false));
    }


     * Show Admin login page.

    public function createAdmin(Request $request): Response
    {
        return Inertia::render('admin/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }


     * Handle Admin login.

    public function storeAdmin(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = auth()->user();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }


     * Common authentication and role check helper.

    protected function authenticateAndRedirect(LoginRequest $request, string $role, string $redirectTo): RedirectResponse
    {
        $request->authenticate();

        $user = auth()->user();

        if ($user->role !== $role) {
            Auth::logout();
            return redirect()->route("login.{$role}")->withErrors(['email' => 'Invalid credentials for this user type.']);
        }

        $request->session()->regenerate();

        return redirect()->intended($redirectTo);
    }
*/
/**
     * Show Patient login page.
     */
    public function createPatient(Request $request): Response
    {
        return Inertia::render('patient/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle Patient login.
     */
    public function storePatient(LoginRequest $request): RedirectResponse
    {
        return $this->authenticateAndRedirect($request, 'patient', '/patient/dashboard');
    }

    /**
     * Show Doctor login page.
     */
    public function createDoctor(Request $request): Response
    {
        return Inertia::render('doctor/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle Doctor login.
     */
    public function storeDoctor(LoginRequest $request): RedirectResponse
    {
        return $this->authenticateAndRedirect($request, 'doctor', '/doctor/dashboard');
    }

    /**
     * Show Lab Technician login page.
     */
    public function createLabTechnician(Request $request): Response
    {
        return Inertia::render('labtechnician/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle Lab Technician login.
     */
    public function storeLabTechnician(LoginRequest $request): RedirectResponse
    {
        return $this->authenticateAndRedirect($request, 'labtechnician', '/labtechnician/dashboard');
    }

    /**
     * Show Admin login page.
     */
    public function createAdmin(Request $request): Response
    {
        return Inertia::render('admin/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle Admin login.
     */
    public function storeAdmin(LoginRequest $request): RedirectResponse
    {
        return $this->authenticateAndRedirect($request, 'admin', '/admin/dashboard');
    }

    /**
     * Common authentication and role check helper.
     */
    protected function authenticateAndRedirect(LoginRequest $request, string $role, string $redirectTo): RedirectResponse
    {
        $request->authenticate();

        $user = auth()->user();

        if ($user->role !== $role) {
            Auth::logout();
            return redirect()->route("{$role}.login")->withErrors(['email' => 'Invalid credentials for this user type.']);
        }

        $request->session()->regenerate();

        return redirect()->intended($redirectTo);
    }


    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
