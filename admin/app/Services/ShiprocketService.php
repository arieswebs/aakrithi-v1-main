<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ShiprocketService
{
    protected $baseUrl = 'https://apiv2.shiprocket.in/v1/external';

    /**
     * Get the Shiprocket Authentication Token.
     * Caches the token for 9 days since it expires in 10 days.
     *
     * @return string|null
     */
    public function getToken()
    {
        return Cache::remember('shiprocket_token', now()->addDays(9), function () {
            $email = env('SHIPROCKET_EMAIL');
            $password = env('SHIPROCKET_PASSWORD');

            if (!$email || !$password) {
                Log::error('Shiprocket credentials missing in .env');
                return null;
            }

            try {
                $response = Http::withoutVerifying()->post("{$this->baseUrl}/auth/login", [
                    'email'    => $email,
                    'password' => $password,
                ]);

                if ($response->successful() && isset($response['token'])) {
                    return $response['token'];
                }

                Log::error('Shiprocket Authentication Failed: ' . $response->body());
                return null;

            } catch (\Exception $e) {
                Log::error('Shiprocket Authentication Exception: ' . $e->getMessage());
                return null;
            }
        });
    }

    /**
     * Check if a pincode is serviceable and get courier details.
     *
     * @param string $deliveryPincode The customer's pincode
     * @param float $weight Estimated weight in kg (default 0.5)
     * @param int $cod 1 for COD, 0 for Prepaid
     * @return array|null
     */
    public function checkServiceability($deliveryPincode, $weight = 0.5, $cod = 0)
    {
        $token = $this->getToken();

        if (!$token) {
            return null;
        }

        $pickupPincode = env('SHIPROCKET_ORIGIN_PINCODE', '682001');

        try {
            $response = Http::withoutVerifying()->withToken($token)->get("{$this->baseUrl}/courier/serviceability/", [
                'pickup_postcode'   => $pickupPincode,
                'delivery_postcode' => $deliveryPincode,
                'weight'            => $weight,
                'cod'               => $cod,
            ]);

            return $response->json();

        } catch (\Exception $e) {
            Log::error('Shiprocket Serviceability Exception: ' . $e->getMessage());
            return null;
        }
    }
}
