<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    /**
     * Display a listing of the user's documents.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $documents = Auth::user()->documents()->latest()->get();
        
        return response()->json([
            'success' => true,
            'documents' => $documents
        ]);
    }

    /**
     * Store a newly created document in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Store the file
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('documents', $fileName, 'public');
            
            // Create document record
            $document = new Document;
            $document->user_id = Auth::id();
            $document->title = $request->title;
            $document->description = $request->description;
            $document->file_path = $filePath;
            $document->file_type = $file->getClientMimeType();
            $document->file_size = $file->getSize();
            $document->status = 'pending';
            $document->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'document' => $document
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Document upload failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified document.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $document = Document::findOrFail($id);
        
        // Check if user owns this document or is HR
        if (Auth::id() !== $document->user_id && Auth::user()->account_type !== 'hr') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }
        
        return response()->json([
            'success' => true,
            'document' => $document
        ]);
    }

    /**
     * Remove the specified document from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        
        // Check if user owns this document
        if (Auth::id() !== $document->user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }
        
        // Only allow deletion if status is pending
        if ($document->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete document that has been reviewed'
            ], 400);
        }
        
        // Delete the file
        if (Storage::disk('public')->exists($document->file_path)) {
            Storage::disk('public')->delete($document->file_path);
        }
        
        // Delete the record
        $document->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }
}