<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LeaveService;
use App\Models\LeaveRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class EmployeeLeaveController extends Controller
{
    protected $leaveService;
    
    public function __construct(LeaveService $leaveService)
    {
        $this->leaveService = $leaveService;
    }
    
    public function index(Request $request)
    {
        $count = $request->query('count', 10);
        $page = $request->query('page', 1);
        $status = $request->query('status');
        
        $user = Auth::user();
        $leaveRequests = $this->leaveService->getUserLeaveHistory($user->id, $count, $page, $status);
        
        return response()->json([
            'success' => true,
            'leave_requests' => $this->transformCollection($leaveRequests),
            'pagination' => [
                'current_page' => $leaveRequests->currentPage(),
                'total_pages' => $leaveRequests->lastPage(),
                'total_records' => $leaveRequests->total(),
                'per_page' => $leaveRequests->perPage()
            ]
        ]);
    }
    
    public function show($id)
    {
        $user = Auth::user();
        $leaveRequest = LeaveRequest::where('user_id', $user->id)
            ->with(['user', 'approver'])
            ->find($id);
            
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found or not authorized'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'leave_request' => $this->transform($leaveRequest)
        ]);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type' => ['required', Rule::in(['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'other'])],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'max:500'],
        ]);
        
        $user = Auth::user();
        
        try {
            $leaveRequest = $this->leaveService->createLeaveRequest($validated, $user->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Leave request submitted successfully',
                'leave_request' => $this->transform($leaveRequest)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    public function cancel($id)
    {
        $user = Auth::user();
        
        try {
            $leaveRequest = $this->leaveService->cancelLeaveRequest($id, $user->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Leave request cancelled successfully',
                'leave_request' => $this->transform($leaveRequest)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    public function statistics()
    {
        $user = Auth::user();
        $statistics = $this->leaveService->getUserLeaveStatistics($user->id);
        
        $leaveHistory = LeaveRequest::where('user_id', $user->id)
            ->with('approver')
            ->orderBy('requested_date', 'desc')
            ->take(5)
            ->get()
            ->map(function($request) {
                return $this->transform($request);
            });
        
        return response()->json([
            'success' => true,
            'statistics' => $statistics,
            'leave_history' => $leaveHistory
        ]);
    }
    
    private function transform($leaveRequest)
    {
        if (!$leaveRequest) {
            return null;
        }
        
        $result = [
            'id' => $leaveRequest->id,
            'leave_type' => $leaveRequest->leave_type,
            'start_date' => $leaveRequest->start_date->format('Y-m-d'),
            'end_date' => $leaveRequest->end_date->format('Y-m-d'),
            'total_days' => $leaveRequest->total_days,
            'balance' => $leaveRequest->balance,
            'requested_date' => $leaveRequest->requested_date->format('Y-m-d'),
            'status' => $leaveRequest->status,
            'reason' => $leaveRequest->reason,
            'rejection_reason' => $leaveRequest->rejection_reason,
            'approval_date' => $leaveRequest->approval_date ? $leaveRequest->approval_date->format('Y-m-d') : null,
            'created_at' => $leaveRequest->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $leaveRequest->updated_at->format('Y-m-d H:i:s')
        ];
        
        if ($leaveRequest->user) {
            $result['user'] = [
                'id' => $leaveRequest->user->id,
                'first_name' => $leaveRequest->user->first_name,
                'last_name' => $leaveRequest->user->last_name,
                'employee_number' => $leaveRequest->user->employee_number,
            ];
        } else {
            $result['user'] = null;
        }
        
        if ($leaveRequest->approver) {
            $result['approver'] = [
                'id' => $leaveRequest->approver->id,
                'first_name' => $leaveRequest->approver->first_name,
                'last_name' => $leaveRequest->approver->last_name,
            ];
        } else {
            $result['approver'] = null;
        }
        
        return $result;
    }
    
    private function transformCollection($leaveRequests)
    {
        return $leaveRequests->map(function ($leaveRequest) {
            return $this->transform($leaveRequest);
        });
    }
}