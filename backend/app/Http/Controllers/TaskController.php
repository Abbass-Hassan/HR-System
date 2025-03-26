<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    function getTasks(Request $request){
        $user = Auth::user();
        if ($user->account_type === 'manager') {
            $tasks = Task::where('assigned_by', $user->id)->with(['assignedBy', 'assignedTo'])->get();
        } else {
            $tasks = Task::where('assigned_to', $user->id)->with(['assignedBy', 'assignedTo'])->get();
        }
        return response()->json([
            'success' => true,
            'data' => $tasks
        ]);
    }

    public function addOrUpdateTask(Request $request, $id = "null"){
        if ($id === null) {
            $task = new Task;
            $message = "Task added successfully";
        } else {
            $task = Task::find($id);
            if (!$task) {
                return response()->json([
                    "success" => false,
                    "message" => "Task not found"
                ]);
            }
            $message = "Task updated successfully";
        }

        $task->title = $request['title'];
        $task->description = $request["description"];
        $task->due_date = $request["due_date"];
        $task->assigned_by = $request->user()->id;
        $task->assigned_to = $request["assigned_to"];
        $task->save();

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $task
        ]);
    }

    // Renamed method and parameter for consistency with route
    public function updateStatus(Request $request, $taskId)
    {
        $task = Task::find($taskId);
        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }
        $task->status = $request->input('status');
        $task->save();

        return response()->json([
            'success' => true,
            'message' => 'Task status updated successfully',
            'data' => $task
        ]);
    }

    public function deleteTask($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ]);
        }

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }

    public function addFeedback(Request $request, $taskId)
    {
        $task = Task::find($taskId);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ]);
        }

        $task->feedback = $request["feedback"];
        $task->feedback_provided = true;
        $task->save();

        return response()->json([
            'success' => true,
            'message' => 'Feedback added successfully',
            'data' => $task
        ]);
    }

    public function viewFeedback($taskId)
    {
        $task = Task::with(['assignedTo', 'assignedBy'])->find($taskId);

        if (!$task) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ]);
        }

        return response()->json(['success' => true, 'data' => $task]);
    }
}
