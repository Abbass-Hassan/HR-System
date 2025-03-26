<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LeaveService;
use Illuminate\Support\Facades\Auth;

class HRLeaveController extends Controller
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
        $userId = $request->query('user_id');
        $leaveType = $request->query('leave_type');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        $query = \App\Models\LeaveRequest::with(['user', 'approver']);
        
        if ($status) {
            $query->where('status', $status);
        }
        
        if ($userId) {
            $query->where('user_id', $userId);
        }
        
        if ($leaveType) {
            $query->where('leave_type', $leaveType);
        }
        
        if ($startDate && $endDate) {
            $query->where(function($q) use ($startDate, $endDate) {
                $q->whereBetween('start_date', [$startDate, $endDate])
                  ->orWhereBetween('end_date', [$startDate, $endDate])
                  ->orWhere(function($q2) use ($startDate, $endDate) {
                      $q2->where('start_date', '<=', $startDate)
                         ->where('end_date', '>=', $endDate);
                  });
            });
        }
        
        $leaveRequests = $query->latest()
            ->paginate($count, ['*'], 'page', $page);
        
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
    
    public function pending(Request $request)
    {
        $count = $request->query('count', 10);
        $page = $request->query('page', 1);
        
        $leaveRequests = \App\Models\LeaveRequest::with(['user', 'approver'])
            ->where('status', 'pending')
            ->latest()
            ->paginate($count, ['*'], 'page', $page);
        
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
        $leaveRequest = \App\Models\LeaveRequest::with(['user', 'approver'])->find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'leave_request' => $this->transform($leaveRequest)
        ]);
    }
    
    public function approve($id)
    {
        $hr = Auth::user();
        
        try {
            $leaveRequest = $this->leaveService->updateLeaveStatus($id, 'approved', null, $hr->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Leave request approved successfully',
                'leave_request' => $this->transform($leaveRequest)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    public function reject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);
        
        $hr = Auth::user();
        
        try {
            $leaveRequest = $this->leaveService->updateLeaveStatus(
                $id, 
                'rejected', 
                $request->rejection_reason, 
                $hr->id
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Leave request rejected successfully',
                'leave_request' => $this->transform($leaveRequest)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    public function statistics(Request $request)
    {
        $year = $request->query('year');
        $month = $request->query('month');
        
        $statistics = $this->leaveService->getLeaveStatisticsForHR($year, $month);
        
        return response()->json([
            'success' => true,
            'statistics' => $statistics
        ]);
    }
    
    private function transform($leaveRequest)
    {
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
                'department_id' => $leaveRequest->user->department_id,
                'position_id' => $leaveRequest->user->position_id,
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