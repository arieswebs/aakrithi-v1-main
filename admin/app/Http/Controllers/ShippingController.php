<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ShiprocketService;

class ShippingController extends Controller
{
    protected $shiprocketService;

    public function __construct(ShiprocketService $shiprocketService)
    {
        $this->shiprocketService = $shiprocketService;
    }

    public function checkPincode(Request $request)
    {
        $request->validate([
            'pincode' => 'required|digits:6',
            'type'    => 'nullable|string', // retail or wholesale
        ]);

        $pincode = $request->pincode;
        
        // B2B might be heavier, but we pass generic weights for serviceability checks
        // unless product specific weights are needed. Default is 0.5kg for retail.
        // For wholesale checking freight, we can pass a 5kg default.
        $weight = $request->type === 'wholesale' ? 5.0 : 0.5;
        
        $response = $this->shiprocketService->checkServiceability($pincode, $weight, 1);

        if (!$response) {
            return response()->json([
                'success' => false,
                'message' => 'Shipping service is currently unavailable. Please try again later.'
            ]);
        }

        // Shiprocket returns status 404 if pincode is unserviceable
        if (isset($response['status']) && $response['status'] == 404) {
            return response()->json([
                'success'     => false,
                'message'     => 'Currently, we do not deliver to this pincode. We are expanding quickly!',
                'is_b2b_fail' => $request->type === 'wholesale'
            ]);
        }
        
        // If successful, extract the fastest courier date and cod status
        if (isset($response['data']) && isset($response['data']['available_courier_companies']) && count($response['data']['available_courier_companies']) > 0) {
            // Find courier with delivery date shortest, but for simplicity let's take the recommended one (first)
            $couriers = $response['data']['available_courier_companies'];
            $bestCourier = $couriers[0]; 
            
            $etd = $bestCourier['etd']; // Estimated Time of Delivery (e.g., "Oct 25, 2026")
            $codAvailable = $bestCourier['cod'] == 1;

            $message = "Delivery available by <strong>{$etd}</strong>.";
            if ($request->type === 'wholesale') {
                 $message = "Express Wholesale Logistics available.<br>Estimated transit: <strong>{$etd}</strong>.";
            } else {
                 if ($codAvailable) {
                     $message .= "<br>Cash on Delivery is eligible.";
                 }
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'etd'     => $etd,
                'cod'     => $codAvailable
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Serviceability could not be determined.'
        ]);
    }
}
