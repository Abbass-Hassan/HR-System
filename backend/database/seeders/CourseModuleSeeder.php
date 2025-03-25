<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CourseModule;
use App\Models\Course;

class CourseModuleSeeder extends Seeder
{
    public function run()
    {
        // Get course IDs
        $cybersecurityCourse = Course::where('course_name', 'Cybersecurity Fundamentals')->first();
        $projectManagementCourse = Course::where('course_name', 'Project Management Essentials')->first();
        
        if (!$cybersecurityCourse || !$projectManagementCourse) {
            echo "Courses not found. Please run CourseSeeder first.\n";
            return;
        }

        $modules = [
            // Cybersecurity Fundamentals Modules
            [
                'course_id' => $cybersecurityCourse->id,
                'module_name' => 'Understanding Cyber Threats',
                'description' => 'Learn about common cyber threats including malware, phishing, social engineering, and denial of service attacks.',
                'content_type' => 'video',
                'content' => null,
                'content_url' => 'https://training.example.com/cybersecurity/threats-intro.mp4',
                'has_assessment' => true
            ],
            [
                'course_id' => $cybersecurityCourse->id,
                'module_name' => 'Password Security and Authentication',
                'description' => 'Best practices for creating strong passwords, using password managers, and implementing multi-factor authentication.',
                'content_type' => 'text',
                'content' => "# Password Security Best Practices\n\n## Creating Strong Passwords\n- Use at least 12 characters\n- Combine uppercase, lowercase, numbers, and symbols\n- Avoid personal information\n- Don't use dictionary words\n\n## Password Managers\n- Benefits of password managers\n- Top recommended tools\n- Setup and usage guide\n\n## Multi-Factor Authentication\n- What is MFA and why use it\n- Types of authentication factors\n- Setting up MFA on common platforms",
                'content_url' => null,
                'has_assessment' => true
            ],
            [
                'course_id' => $cybersecurityCourse->id,
                'module_name' => 'Secure Web Browsing',
                'description' => 'How to safely browse the web, recognize secure websites, and protect your data during online activities.',
                'content_type' => 'presentation',
                'content' => null,
                'content_url' => 'https://training.example.com/cybersecurity/secure-browsing.pptx',
                'has_assessment' => true
            ],
            [
                'course_id' => $cybersecurityCourse->id,
                'module_name' => 'Data Protection Fundamentals',
                'description' => 'Principles of data protection including encryption, secure file sharing, and proper data disposal.',
                'content_type' => 'interactive',
                'content' => null,
                'content_url' => 'https://training.example.com/cybersecurity/data-protection-simulation.html',
                'has_assessment' => true
            ],
            
            // Project Management Essentials Modules
            [
                'course_id' => $projectManagementCourse->id,
                'module_name' => 'Project Initiation and Planning',
                'description' => 'Learn how to define project scope, create a work breakdown structure, and develop a project plan.',
                'content_type' => 'video',
                'content' => null,
                'content_url' => 'https://training.example.com/project-management/initiation.mp4',
                'has_assessment' => true
            ],
            [
                'course_id' => $projectManagementCourse->id,
                'module_name' => 'Risk Management',
                'description' => 'Techniques for identifying, assessing, and mitigating project risks.',
                'content_type' => 'text',
                'content' => "# Project Risk Management\n\n## Risk Identification\n- Brainstorming techniques\n- Common project risks\n- Risk register creation\n\n## Risk Assessment\n- Probability and impact analysis\n- Risk prioritization\n- Risk assessment matrix\n\n## Risk Mitigation\n- Developing response strategies\n- Contingency planning\n- Risk monitoring throughout project lifecycle",
                'content_url' => null,
                'has_assessment' => true
            ],
            [
                'course_id' => $projectManagementCourse->id,
                'module_name' => 'Project Execution and Monitoring',
                'description' => 'How to effectively execute project tasks and monitor progress against the plan.',
                'content_type' => 'presentation',
                'content' => null,
                'content_url' => 'https://training.example.com/project-management/execution.pptx',
                'has_assessment' => true
            ],
            [
                'course_id' => $projectManagementCourse->id,
                'module_name' => 'Project Closure',
                'description' => 'Proper procedures for closing a project, capturing lessons learned, and celebrating success.',
                'content_type' => 'interactive',
                'content' => null,
                'content_url' => 'https://training.example.com/project-management/project-closure-simulation.html',
                'has_assessment' => true
            ]
        ];

        foreach ($modules as $module) {
            CourseModule::create($module);
        }
    }
}