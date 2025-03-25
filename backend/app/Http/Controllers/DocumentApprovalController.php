<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DocumentApprovalController extends Controller
{
    

    /**
     * Display a listing of all documents for HR review.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Get status filter if provided
        $status = $request->query('status', 'pending');
        
        // Get documents with user information
        $documents = Document::with('user')
                    ->where('status', $status)
                    ->latest()
                    ->get();
        
        return response()->json([
            'success' => true,
            'documents' => $documents
        ]);
    }

    /**
     * Approve a document.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve($id)
    {
        $document = Document::findOrFail($id);
        
        // Check if document is already reviewed
        if ($document->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Document has already been reviewed'
            ], 400);
        }
        
        // Update document status
        $document->status = 'approved';
        $document->reviewed_by = Auth::id();
        $document->reviewed_at = now();
        $document->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Document approved successfully',
            'document' => $document
        ]);
    }

    /**
     * Reject a document with feedback.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject(Request $request, $id)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'feedback' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Feedback is required',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $document = Document::findOrFail($id);
        
        // Check if document is already reviewed
        if ($document->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Document has already been reviewed'
            ], 400);
        }
        
        // Update document status
        $document->status = 'rejected';
        $document->feedback = $request->feedback;
        $document->reviewed_by = Auth::id();
        $document->reviewed_at = now();
        $document->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Document rejected with feedback',
            'document' => $document
        ]);
    }

    /**
     * Get document statistics for HR dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $stats = [
            'pending' => Document::where('status', 'pending')->count(),
            'approved' => Document::where('status', 'approved')->count(),
            'rejected' => Document::where('status', 'rejected')->count(),
            'total' => Document::count()
        ];
        
        return response()->json([
            'success' => true,
            'statistics' => $stats
        ]);
    }
}