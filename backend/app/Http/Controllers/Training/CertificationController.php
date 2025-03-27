<?php

namespace App\Http\Controllers\Training;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certification;
use App\Models\UserCertification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class CertificationController extends Controller
{
    public function index(Request $request)
    {
        $count = $request->query('count', 10);
        $page = $request->query('page', 1);

        $user = Auth::user();
        $certifications = UserCertification::with(['certification'])
            ->where('user_id', $user->id)
            ->paginate($count, ['*'], 'page', $page);

        return response()->json([
            "success" => true,
            "certifications" => $certifications
        ]);
    }

    public function show($id)
    {
        $certification = UserCertification::with(['certification'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$certification) {
            return response()->json([
                "success" => false,
                "message" => "Certification not found"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "certification" => $certification
        ]);
    }


    function getCertification($count, $page, $id = null)
    {
        $user = Auth::user();

        if ($id == null) {
            $cerifications = UserCertification::with(['certification'])
                ->where('user_id', $user->id)
                ->paginate($count, ['*'], 'page', $page);

            return response()->json([
                "success" => "true",
                "certifications" => $cerifications
            ]);
        }

        return response()->json([
            "success" => "false",
            "certification" => null
        ]);
    }

    function availableCertifications()
    {
        $certifications = Certification::all();

        return response()->json([
            "success" => "true",
            "certifications" => $certifications
        ]);
    }
    

    function getPopularCertifications()
    {
        $certifications = Certification::withCount('userCertification')
            ->orderBy('user_certification_count', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            "success" => "true",
            "certifications" => $certifications
        ]);
    }

    function verifyUserCertification(Request $request, $id)
    {
        $certification = UserCertification::find($id);

        if (!$certification) {
            return response()->json([
                "success" => "false",
                "certification" => null
            ]);
        }

        $user = Auth::user();
        if ($certification->user_id != $user->id) {
            return response()->json([
                "success" => "false",
                "message" => "Not authorized"
            ]);
        }

        $certification->verification_status = 'verified';
        $certification->save();

        return response()->json([
            "success" => "true",
            "certification" => $certification
        ]);
    }
}