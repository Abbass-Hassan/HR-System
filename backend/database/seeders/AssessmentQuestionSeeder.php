<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssessmentQuestion;
use App\Models\ModuleAssessment;
use App\Models\CourseModule;

class AssessmentQuestionSeeder extends Seeder
{
    public function run()
    {
        // Get module names for mapping to questions
        $moduleAssessments = ModuleAssessment::with('module')->get();
        
        foreach ($moduleAssessments as $assessment) {
            $moduleName = $assessment->module->module_name;
            $questions = $this->getQuestionsForModule($moduleName);
            
            foreach ($questions as $question) {
                AssessmentQuestion::create([
                    'assessment_id' => $assessment->id,
                    'question_text' => $question['question_text'],
                    'question_type' => $question['question_type'],
                    'options' => $question['options'],
                    'correct_answer' => $question['correct_answer'],
                    'points' => $question['points']
                ]);
            }
        }
    }
    
    private function getQuestionsForModule($moduleName)
    {
        $questions = [
            'Understanding Cyber Threats' => [
                [
                    'question_text' => 'Which of the following is NOT a common type of malware?',
                    'question_type' => 'multiple_choice',
                    'options' => ['Virus', 'Worm', 'Trojan', 'Firewall'],
                    'correct_answer' => 'Firewall',
                    'points' => 2
                ],
                [
                    'question_text' => 'What is phishing?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'A technique to strengthen passwords',
                        'An attempt to acquire sensitive information by disguising as a trustworthy entity',
                        'A type of network protection',
                        'A secure way to share files'
                    ],
                    'correct_answer' => 'An attempt to acquire sensitive information by disguising as a trustworthy entity',
                    'points' => 2
                ],
                [
                    'question_text' => 'True or False: Social engineering attacks rely primarily on technical vulnerabilities rather than human psychology.',
                    'question_type' => 'true_false',
                    'options' => ['True', 'False'],
                    'correct_answer' => 'False',
                    'points' => 1
                ],
                [
                    'question_text' => 'What is the primary goal of a Denial of Service (DoS) attack?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'To steal sensitive data',
                        'To gain unauthorized access',
                        'To make a system or network unavailable',
                        'To encrypt data for ransom'
                    ],
                    'correct_answer' => 'To make a system or network unavailable',
                    'points' => 2
                ],
                [
                    'question_text' => 'List three indicators that an email might be a phishing attempt.',
                    'question_type' => 'short_answer',
                    'options' => null,
                    'correct_answer' => 'Spelling errors, urgent language, suspicious sender address',
                    'points' => 3
                ]
            ],
            
            'Password Security and Authentication' => [
                [
                    'question_text' => 'Which of the following passwords is the strongest?',
                    'question_type' => 'multiple_choice',
                    'options' => ['password123', 'P@ssw0rd', 'Tr6!fL9*zQw2', 'MyBirthday2000'],
                    'correct_answer' => 'Tr6!fL9*zQw2',
                    'points' => 2
                ],
                [
                    'question_text' => 'What is multi-factor authentication?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'Using multiple passwords for the same account',
                        'Requiring multiple security questions',
                        'Using two or more verification methods to access an account',
                        'Changing your password regularly'
                    ],
                    'correct_answer' => 'Using two or more verification methods to access an account',
                    'points' => 2
                ],
                [
                    'question_text' => 'True or False: It is secure to use the same password for multiple accounts as long as it is complex.',
                    'question_type' => 'true_false',
                    'options' => ['True', 'False'],
                    'correct_answer' => 'False',
                    'points' => 1
                ],
                [
                    'question_text' => 'What is the primary benefit of a password manager?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'It automatically changes your passwords monthly',
                        'It allows you to use simple passwords',
                        'It stores and generates strong, unique passwords for each account',
                        'It prevents websites from using passwords'
                    ],
                    'correct_answer' => 'It stores and generates strong, unique passwords for each account',
                    'points' => 2
                ],
                [
                    'question_text' => 'Name three common types of authentication factors.',
                    'question_type' => 'short_answer',
                    'options' => null,
                    'correct_answer' => 'Something you know, something you have, something you are',
                    'points' => 3
                ]
            ],
            
            // Questions for other modules would go here
            'Project Initiation and Planning' => [
                [
                    'question_text' => 'What is the first step in project planning?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'Creating a budget',
                        'Defining project scope',
                        'Assembling the team',
                        'Setting the schedule'
                    ],
                    'correct_answer' => 'Defining project scope',
                    'points' => 2
                ],
                [
                    'question_text' => 'What is a Work Breakdown Structure (WBS)?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'A team organizational chart',
                        'A hierarchical decomposition of the total scope of work',
                        'A schedule of employee work hours',
                        'A list of project stakeholders'
                    ],
                    'correct_answer' => 'A hierarchical decomposition of the total scope of work',
                    'points' => 2
                ],
                [
                    'question_text' => 'True or False: The project charter is typically created after the detailed project plan.',
                    'question_type' => 'true_false',
                    'options' => ['True', 'False'],
                    'correct_answer' => 'False',
                    'points' => 1
                ],
                [
                    'question_text' => 'Which of the following is NOT typically included in a project plan?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'Schedule baseline',
                        'Resource assignments',
                        'Employee performance reviews',
                        'Risk management plan'
                    ],
                    'correct_answer' => 'Employee performance reviews',
                    'points' => 2
                ],
                [
                    'question_text' => 'List three key stakeholders typically involved in project initiation.',
                    'question_type' => 'short_answer',
                    'options' => null,
                    'correct_answer' => 'Project sponsor, project manager, key team members',
                    'points' => 3
                ]
            ],
            
            'Risk Management' => [
                [
                    'question_text' => 'What is a risk register?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'A document listing project team members who are at risk',
                        'A document that records identified risks, their analysis, and response plans',
                        'A financial reserve for unexpected costs',
                        'A safety procedure manual'
                    ],
                    'correct_answer' => 'A document that records identified risks, their analysis, and response plans',
                    'points' => 2
                ],
                [
                    'question_text' => 'In risk assessment, what does probability refer to?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'The likelihood a risk will occur',
                        'The severity of impact if a risk occurs',
                        'The overall importance of a risk',
                        'The time frame in which a risk might occur'
                    ],
                    'correct_answer' => 'The likelihood a risk will occur',
                    'points' => 2
                ],
                [
                    'question_text' => 'True or False: Once a project begins, the risk register cannot be updated.',
                    'question_type' => 'true_false',
                    'options' => ['True', 'False'],
                    'correct_answer' => 'False',
                    'points' => 1
                ],
                [
                    'question_text' => 'Which of the following is NOT a common risk response strategy?',
                    'question_type' => 'multiple_choice',
                    'options' => [
                        'Avoid',
                        'Transfer',
                        'Mitigate',
                        'Celebrate'
                    ],
                    'correct_answer' => 'Celebrate',
                    'points' => 2
                ],
                [
                    'question_text' => 'Describe the difference between a risk and an issue in project management.',
                    'question_type' => 'short_answer',
                    'options' => null,
                    'correct_answer' => 'A risk is a potential future event, while an issue is a current problem that needs to be addressed',
                    'points' => 3
                ]
            ]
        ];
        
        // Return questions for the requested module, or empty array if none found
        return $questions[$moduleName] ?? [];
    }
}