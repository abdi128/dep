<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if(!$request->user() || $request->user()->role !== $role) {
            if($request->user() && $request->user()->role === 'admin'){
                return redirect()->route('admin.dashboard');
            }
            if($request->user() && $request->user()->role === 'doctor'){
                return redirect()->route('doctor.dashboard');
            }
            if($request->user() && $request->user()->role === 'labtechnician'){
                return redirect()->route('labtechnician.dashboard');
            }
            if($request->user() && $request->user()->role === 'patient'){
                return redirect()->route('patient.dashboard');
            }
            return redirect()->route('home');
        }
        return $next($request);
    }
}
