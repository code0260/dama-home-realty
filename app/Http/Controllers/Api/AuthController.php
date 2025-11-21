<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Traits\HasApiResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    use HasApiResponse;
    /**
     * Register a new user
     */
    public function register(RegisterRequest $request)
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Assign Tenant role by default
            if (!$user->hasRole('Tenant')) {
                $user->assignRole('Tenant');
            }

            Auth::login($user);

            return $this->successResponse(
                ['user' => $user->load('roles')],
                'Registration successful',
                201
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(),
                'Validation failed'
            );
        } catch (\Exception $e) {
            Log::error('AuthController@register error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to register. Please try again later.',
                500
            );
        }
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request)
    {
        try {

            $credentials = $request->only('email', 'password');
            $remember = $request->boolean('remember', false);

            if (Auth::attempt($credentials, $remember)) {
                $request->session()->regenerate();
                $user = Auth::user();

                return $this->successResponse(
                    ['user' => $user->load('roles')],
                    'Login successful'
                );
            }

            return $this->errorResponse(
                'The provided credentials do not match our records.',
                401,
                ['email' => ['The provided credentials do not match our records.']]
            );
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(),
                'Validation failed'
            );
        } catch (\Exception $e) {
            Log::error('AuthController@login error: ' . $e->getMessage(), [
                'request' => $request->except(['password']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to login. Please try again later.',
                500
            );
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return $this->successResponse(null, 'Logged out successfully');
        } catch (\Exception $e) {
            Log::error('AuthController@logout error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to logout. Please try again.',
                500
            );
        }
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return $this->unauthorizedResponse('Not authenticated');
            }

            return $this->successResponse(
                $user->load('roles'),
                'User retrieved successfully'
            );
        } catch (\Exception $e) {
            Log::error('AuthController@user error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch user. Please try again later.',
                500
            );
        }
    }
}
