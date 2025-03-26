<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Validation\Rule;

class EmployeeLeaveController extends Controller
{
    public function index(Request $request)
    {
        $count = $request->query('count', 10);
        $page = $request->query('page', 1);
        $status = $request->query('status');
        
        $user = Auth::user();
        $query = LeaveRequest::where('user_id', $user->id);
        
        if ($status) {
            $query->where('status', $status);
        }
        
        $leaveRequests = $query->with(['user', 'approver'])
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
        $today = Carbon::now()->format('Y-m-d');
        
        $validated = $request->validate([
            'leave_type' => ['required', Rule::in(['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'other'])],
            'start_date' => ['required', 'date', 'after_or_equal:' . $today],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'max:500'],
        ]);
        
        $user = Auth::user();
        
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $totalDays = $this->calculateBusinessDays($startDate, $endDate);
        
        $leaveBalance = 14.0;
        
        if ($totalDays > $leaveBalance) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient leave balance. You have ' . $leaveBalance . ' days available.'
            ], 400);
        }
        
        $leaveRequest = new LeaveRequest([
            'user_id' => $user->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_days' => $totalDays,
            'balance' => $leaveBalance - $totalDays,
            'requested_date' => Carbon::now(),
            'status' => 'pending',
            'reason' => $validated['reason']
        ]);
        
        $hasOverlap = LeaveRequest::where('user_id', $user->id)
            ->where('status', 'approved')
            ->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                          ->where('end_date', '>=', $endDate);
                    });
            })->exists();
            
        if ($hasOverlap) {
            return response()->json([
                'success' => false,
                'message' => 'You already have approved leave during this period.'
            ], 400);
        }
        
        $approver = User::where('account_type', 'hr')->first();
        
        if ($approver) {
            $leaveRequest->approver_id = $approver->id;
        }
        
        $leaveRequest->save();
        
        $leaveRequest = LeaveRequest::with(['user', 'approver'])->find($leaveRequest->id);
        
        return response()->json([
            'success' => true,
            'message' => 'Leave request submitted successfully',
            'leave_request' => $this->transform($leaveRequest)
        ], 201);
    }
    
    public function cancel($id)
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
        
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending leave requests can be cancelled'
            ], 400);
        }
        
        $leaveRequest->status = 'cancelled';
        $leaveRequest->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Leave request cancelled successfully',
            'leave_request' => $this->transform($leaveRequest)
        ]);
    }
    
    private function transform(LeaveRequest $leaveRequest)
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
    
    private function calculateBusinessDays(Carbon $startDate, Carbon $endDate)
    {
        $days = 0;
        $current = $startDate->copy();
        
        while ($current->lte($endDate)) {
            if ($current->dayOfWeek !== 0 && $current->dayOfWeek !== 6) {
                $days++;
            }
            $current->addDay();
        }
        
        return $days;
    }
}