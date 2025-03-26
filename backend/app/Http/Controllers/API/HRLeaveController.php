<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class HRLeaveController extends Controller
{
    public function index(Request $request)
    {
        $count = $request->query('count', 10);
        $page = $request->query('page', 1);
        $status = $request->query('status');
        $userId = $request->query('user_id');
        $leaveType = $request->query('leave_type');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        $query = LeaveRequest::with(['user', 'approver']);
        
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
        
        $leaveRequests = LeaveRequest::with(['user', 'approver'])
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
        $leaveRequest = LeaveRequest::with(['user', 'approver'])->find($id);
        
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
        $leaveRequest = LeaveRequest::with('user')->find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }
        
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending leave requests can be approved'
            ], 400);
        }
        
        $leaveRequest->status = 'approved';
        $leaveRequest->approver_id = $hr->id;
        $leaveRequest->approval_date = Carbon::now();
        $leaveRequest->save();
        
        $leaveRequest = LeaveRequest::with(['user', 'approver'])->find($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Leave request approved successfully',
            'leave_request' => $this->transform($leaveRequest)
        ]);
    }
    
    public function reject(Request $request, $id)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);
        
        $hr = Auth::user();
        $leaveRequest = LeaveRequest::with('user')->find($id);
        
        if (!$leaveRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }
        
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending leave requests can be rejected'
            ], 400);
        }
        
        $leaveRequest->status = 'rejected';
        $leaveRequest->approver_id = $hr->id;
        $leaveRequest->approval_date = Carbon::now();
        $leaveRequest->rejection_reason = $request->rejection_reason;
        $leaveRequest->save();

        $leaveRequest = LeaveRequest::with(['user', 'approver'])->find($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Leave request rejected successfully',
            'leave_request' => $this->transform($leaveRequest)
        ]);
    }
    
    public function statistics(Request $request)
    {
        $year = $request->query('year', Carbon::now()->year);
        $month = $request->query('month');
        
        $query = LeaveRequest::whereYear('start_date', $year)
            ->orWhereYear('end_date', $year);
            
        if ($month) {
            $query->where(function($q) use ($month) {
                $q->whereMonth('start_date', $month)
                  ->orWhereMonth('end_date', $month);
            });
        }
        
        $leaveByType = LeaveRequest::whereYear('start_date', $year)
            ->get()
            ->groupBy('leave_type')
            ->map(function($group) {
                return [
                    'count' => $group->count(),
                    'days' => $group->sum('total_days')
                ];
            });
            
        $leaveByStatus = LeaveRequest::whereYear('start_date', $year)
            ->get()
            ->groupBy('status')
            ->map(function($group) {
                return $group->count();
            });
            
        $topLeaveUsers = [];
        $leaveByUser = LeaveRequest::with('user')
            ->whereYear('start_date', $year)
            ->where('status', 'approved')
            ->get()
            ->groupBy('user_id');
            
        foreach ($leaveByUser as $userId => $requests) {
            $user = $requests->first()->user;
            if ($user) {
                $topLeaveUsers[] = [
                    'user_id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'total_days' => $requests->sum('total_days')
                ];
            }
        }
        
        usort($topLeaveUsers, function($a, $b) {
            return $b['total_days'] <=> $a['total_days'];
        });
        $topLeaveUsers = array_slice($topLeaveUsers, 0, 5);
        
        $currentMonth = Carbon::now()->month;
        $currentMonthName = Carbon::now()->format('F');
        $currentMonthLeave = LeaveRequest::whereYear('start_date', $year)
            ->whereMonth('start_date', $currentMonth)
            ->where('status', 'approved')
            ->count();
        
        return response()->json([
            'success' => true,
            'statistics' => [
                'leave_by_type' => $leaveByType,
                'leave_by_status' => $leaveByStatus,
                'top_leave_users' => $topLeaveUsers,
                'current_month' => [
                    'name' => $currentMonthName,
                    'count' => $currentMonthLeave
                ],
                'year' => $year
            ]
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