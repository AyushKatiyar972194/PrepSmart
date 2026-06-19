import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Send, Award, Printer, ChevronRight, User, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

const INTERVIEW_QUESTIONS = {
  frontend: [
    {
      id: 1,
      question: "Explain what the Virtual DOM is and how React uses it to optimize DOM updates.",
      keywords: ["virtual dom", "reconciliation", "diff", "re-render", "update", "real dom"],
      modelAnswer: "React maintains a lightweight in-memory representation of the real DOM called the Virtual DOM. When state changes, a new Virtual DOM tree is created. React compares it with the previous tree (using a diffing algorithm called reconciliation) and updates only the changed subtrees in the real DOM, avoiding expensive full page layout reflows."
    },
    {
      id: 2,
      question: "What is the core difference between state and props in React?",
      keywords: ["state", "prop", "mutable", "immutable", "pass", "parent", "local", "change"],
      modelAnswer: "State represents mutable data managed locally within a component, which triggers a re-render when updated. Props represent immutable properties passed down from a parent component to child components, allowing configuration and data sharing."
    },
    {
      id: 3,
      question: "How does the dependency array in a useEffect hook control its execution lifecycle?",
      keywords: ["dependency", "array", "useeffect", "mount", "render", "change", "re-run"],
      modelAnswer: "The dependency array specifies when the effect should run. If omitted, the effect runs after every single render. If empty ([]), it runs only once on mount. If variables are provided, the effect runs only when one of those variables changes."
    }
  ],
  backend: [
    {
      id: 1,
      question: "What is middleware in Express.js and when would you write custom middleware?",
      keywords: ["middleware", "express", "request", "response", "next", "auth", "logger", "handler"],
      modelAnswer: "Middleware functions have access to the request (req), response (res), and next middleware function (next) in the app lifecycle. You write custom middleware for authentication, parsing payloads, logging requests, or running verification checks before reaching final routes."
    },
    {
      id: 2,
      question: "Compare SQL and NoSQL databases. In what placement project scenarios would you choose which?",
      keywords: ["sql", "nosql", "relational", "schema", "joins", "document", "scale", "mongodb"],
      modelAnswer: "SQL databases are relational with strict schemas and table-joins, ideal for projects needing strict integrity like transactions (e.g. PostgreSQL). NoSQL databases are document or key-value based, schema-less, and scale horizontally, ideal for projects with flexible schemas or rapid scaling (e.g. MongoDB)."
    },
    {
      id: 3,
      question: "Explain the cryptographic difference between salting and hashing when storing user passwords.",
      keywords: ["hash", "salt", "bcrypt", "md5", "secure", "decrypt", "random"],
      modelAnswer: "Hashing converts a password to a fixed-length string using a one-way mathematical function. Salting appends a unique random string (salt) to the password before hashing to defend against pre-computed rainbow table attacks, ensuring identical passwords hash differently."
    }
  ],
  dsa: [
    {
      id: 1,
      question: "What is the time complexity of searching in a balanced Binary Search Tree (BST), and why?",
      keywords: ["bst", "binary search", "log", "height", "complexity", "split", "half"],
      modelAnswer: "In a balanced BST, search takes O(log n) time. Since the tree is balanced, its height is log(n). At each node comparison, you discard half of the subtrees, reducing the search space by half at each step."
    },
    {
      id: 2,
      question: "Describe the structural difference between a Stack and a Queue, and their memory access order.",
      keywords: ["stack", "queue", "lifo", "fifo", "push", "pop", "enqueue", "dequeue"],
      modelAnswer: "A Stack is a Last In First Out (LIFO) structure where insertion and deletion occur at the same end (push/pop). A Queue is a First In First Out (FIFO) structure where insertion occurs at the rear (enqueue) and deletion at the front (dequeue)."
    },
    {
      id: 3,
      question: "How does binary search locate a target item, and what is its primary array requirement?",
      keywords: ["binary search", "sorted", "midpoint", "half", "prerequisite", "index"],
      modelAnswer: "Binary search halves the search range by comparing the target to the array's midpoint. Its primary requirement is that the input array must be sorted. If the midpoint is higher/lower than the target, the search range shifts to the lower/upper half."
    }
  ]
};

export default function MockInterview({ onComplete }) {
  const [category, setCategory] = useState(null);
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState('onboard'); // onboard, chat, results, certificate
  const [questionIdx, setQuestionIdx] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [scores, setScores] = useState([]); // array of individual question scores
  const [evaluationFeedback, setEvaluationFeedback] = useState([]);

  // Auto scroll to chat bottom
  const chatBottomRef = useRef(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isThinking]);

  const handleStart = (cat) => {
    if (!userName.trim()) {
      alert('Please enter your name for the Placement Readiness Certificate.');
      return;
    }
    setCategory(cat);
    setStep('chat');
    setQuestionIdx(0);
    setScores([]);
    setEvaluationFeedback([]);
    
    // Initial Recruiter greeting
    setChatLog([
      {
        sender: 'recruiter',
        text: `Hello ${userName}, thank you for attending today's mock interview. I will be evaluating your knowledge in ${cat.toUpperCase()}. Let's start.`,
        type: 'greeting'
      },
      {
        sender: 'recruiter',
        text: INTERVIEW_QUESTIONS[cat][0].question,
        type: 'question'
      }
    ]);
  };

  const handleAnswerSubmit = () => {
    const cleanAnswer = userResponse.trim();
    if (!cleanAnswer) return;

    // Add user answer to chat log
    const updatedLog = [
      ...chatLog,
      { sender: 'user', text: cleanAnswer }
    ];
    setChatLog(updatedLog);
    setUserResponse('');
    setIsThinking(true);

    // Simulate AI recruiter evaluation
    setTimeout(() => {
      setIsThinking(false);
      const question = INTERVIEW_QUESTIONS[category][questionIdx];
      
      // Keywords parsing algorithm (Advanced JS / array methods)
      const matchedKeywords = question.keywords.filter(keyword => 
        cleanAnswer.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const matchPercentage = Math.round((matchedKeywords.length / question.keywords.length) * 100);
      // Give a base score (e.g. 30%) if they type a reasonable response, up to 100%
      const baseScore = cleanAnswer.length > 30 ? 30 : 10;
      const finalQuestionScore = Math.min(100, Math.round(matchPercentage * 0.7 + baseScore));

      // Compose feedback message
      let feedback = '';
      if (finalQuestionScore >= 80) {
        feedback = "Excellent response! You've hit almost all core concepts and explained them clearly.";
      } else if (finalQuestionScore >= 50) {
        feedback = `Decent explanation. However, to sound more professional, you should have mentioned: "${
          question.keywords.filter(k => !matchedKeywords.includes(k)).slice(0, 2).join(', ')
        }".`;
      } else {
        feedback = "Your answer lacks technical depth. Be sure to reference standard architectural keywords during explanations.";
      }

      setScores(prev => [...prev, finalQuestionScore]);
      setEvaluationFeedback(prev => [...prev, {
        question: question.question,
        score: finalQuestionScore,
        feedback,
        userAnswer: cleanAnswer,
        modelAnswer: question.modelAnswer
      }]);

      const nextIdx = questionIdx + 1;
      const questionsList = INTERVIEW_QUESTIONS[category];

      if (nextIdx < questionsList.length) {
        setQuestionIdx(nextIdx);
        setChatLog(prev => [
          ...prev,
          { sender: 'recruiter', text: `Got it. Evaluation score: ${finalQuestionScore}%. ${feedback}`, type: 'feedback' },
          { sender: 'recruiter', text: questionsList[nextIdx].question, type: 'question' }
        ]);
      } else {
        // Complete interview
        const totalScoreSum = [...scores, finalQuestionScore].reduce((s, x) => s + x, 0);
        const finalAverage = Math.round(totalScoreSum / questionsList.length);
        
        setStep('results');
        if (onComplete) {
          onComplete(finalAverage, questionsList.length);
        }
      }
    }, 1500);
  };

  const getOverallVerdict = (avg) => {
    if (avg >= 80) return { label: 'High Readiness (Tier 1 Fit)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25' };
    if (avg >= 50) return { label: 'Medium Readiness (SDE Generalist)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/25' };
    return { label: 'Critical Review Required', color: 'text-rose-500 bg-rose-500/10 border-rose-500/25' };
  };

  const resetAll = () => {
    setCategory(null);
    setStep('onboard');
    setChatLog([]);
    setScores([]);
    setEvaluationFeedback([]);
  };

  const totalAverage = scores.length > 0 ? Math.round(scores.reduce((s, x) => s + x, 0) / scores.length) : 0;
  const verdict = getOverallVerdict(totalAverage);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Onboarding Input Name & Category */}
      {step === 'onboard' && (
        <div className="glass rounded-3xl p-6 sm:p-8 border shadow-sm max-w-xl mx-auto space-y-6 animate-fadeIn text-indigo-950 dark:text-indigo-100">
          <div className="text-center">
            <div className="inline-flex p-3 bg-gradient-brand text-white rounded-2xl mb-4">
              <Award size={36} />
            </div>
            <h2 className="text-2xl font-black">AI Mock Interview Simulator</h2>
            <p className="text-indigo-400/80 dark:text-indigo-300/85 text-sm mt-1">
              Select a specialized track. Your typed responses will be evaluated against industry keywords. Achieve over 50% to earn your Placement Readiness Certificate!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase mb-1.5 block text-indigo-650 dark:text-indigo-300">Your Full Name</label>
              <input 
                type="text" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter name for Certificate..."
                className="input-premium-apply"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase mb-1.5 block text-indigo-650 dark:text-indigo-300">Choose Track</label>
              <div className="space-y-2">
                {[
                  { id: 'frontend', name: 'Frontend Engineer (React & Web)', desc: 'DOM, components lifecycle, state hooks' },
                  { id: 'backend', name: 'Backend Architect (Node.js & DBs)', desc: 'Express middleware, SQL/NoSQL schemas, password hashing' },
                  { id: 'dsa', name: 'DSA Specialist (Problem Solving)', desc: 'BST time complexities, Stacks/Queues, Binary Search' }
                ].map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handleStart(track.id)}
                    className="w-full text-left p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-pink-500 bg-white/40 dark:bg-indigo-950/20 hover:bg-white dark:hover:bg-indigo-950/50 transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-extrabold text-indigo-950 dark:text-white text-sm">{track.name}</div>
                      <div className="text-xs text-indigo-400/80 dark:text-indigo-300 mt-0.5">{track.desc}</div>
                    </div>
                    <ChevronRight size={18} className="text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-pink-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface Step */}
      {step === 'chat' && (
        <div className="grid lg:grid-cols-3 gap-6 animate-fadeIn">
          {/* Recruiter Details Card */}
          <div className="glass rounded-3xl p-5 sm:p-6 border shadow-sm flex flex-col justify-between items-center text-center dark:text-white">
            <div className="space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mx-auto border-2 border-indigo-500">
                  <User size={40} className="text-indigo-600 dark:text-indigo-300" />
                </div>
                <span className="absolute bottom-0 right-1/2 translate-x-10 w-4.5 h-4.5 bg-emerald-500 border-2 border-white dark:border-indigo-950 rounded-full"></span>
              </div>
              <div>
                <div className="font-black text-lg">Lead SDE Recruiter</div>
                <div className="text-xs text-indigo-400/80 font-bold uppercase mt-0.5">Mock Evaluation</div>
              </div>
              <div className="bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-3.5 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed text-left space-y-1.5">
                <div className="font-bold text-indigo-950 dark:text-white">Rules of Engagement:</div>
                <div>• Type detailed, technical answers.</div>
                <div>• Highlight patterns, libraries, and lifecycle steps.</div>
                <div>• Recruiter evaluates keywords dynamically.</div>
              </div>
            </div>

            <button
              onClick={resetAll}
              className="mt-6 btn-custom btn-ghost text-xs w-full text-indigo-400 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-white bg-transparent border-0 cursor-pointer"
            >
              Quit Interview
            </button>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 glass rounded-3xl border shadow-sm flex flex-col h-[520px] overflow-hidden">
            {/* Header info */}
            <div className="bg-white/90 dark:bg-indigo-950/30 px-6 py-3 border-b border-indigo-100/50 dark:border-indigo-900/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">{category.toUpperCase()} SESSION</span>
              </div>
              <span className="text-xs font-semibold text-indigo-400">Q {questionIdx + 1} of 3</span>
            </div>

            {/* Bubble list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatLog.map((bubble, index) => {
                const isRecruiter = bubble.sender === 'recruiter';
                return (
                  <div key={index} className={`flex ${isRecruiter ? 'justify-start' : 'justify-end'} animate-fadeIn`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      isRecruiter
                        ? 'bg-indigo-50/70 text-indigo-950 border border-indigo-100/30 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-900/30 rounded-tl-none'
                        : 'bg-gradient-brand text-white rounded-tr-none'
                    }`}>
                      {bubble.text}
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/20 text-indigo-500 rounded-2xl rounded-tl-none px-4 py-3 text-xs font-semibold">
                    Recruiter is evaluating response...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input message form */}
            <div className="p-4 bg-white/90 dark:bg-indigo-950/40 border-t border-indigo-100/50 dark:border-indigo-900/30 flex gap-2">
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                disabled={isThinking}
                placeholder="Type your structured answer here (press submit when done)..."
                rows="2"
                className="input-premium-apply text-sm flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAnswerSubmit();
                  }
                }}
              />
              <button
                onClick={handleAnswerSubmit}
                disabled={isThinking || !userResponse.trim()}
                className="btn-custom btn-brand-custom px-4 border-0 cursor-pointer self-end rounded-xl h-11"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Overview Step */}
      {step === 'results' && (
        <div className="glass rounded-3xl p-6 sm:p-8 border shadow-sm max-w-2xl mx-auto space-y-6 animate-fadeIn dark:text-white">
          <div className="text-center">
            <span className="badge-premium-apply mb-3">Evaluation Report</span>
            <h2 className="text-2xl font-black text-indigo-950 dark:text-white">Interview Results</h2>
            <p className="text-indigo-400/80 dark:text-indigo-300 text-sm mt-1">Here is the feedback generated based on your key responses.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-4 text-center">
              <div className="text-xs text-indigo-400 dark:text-indigo-300 font-bold uppercase">Average Score</div>
              <div className="text-4xl font-black text-indigo-500 mt-1">{totalAverage}%</div>
            </div>
            <div className={`border rounded-2xl p-4 text-center flex flex-col justify-center ${verdict.color}`}>
              <div className="text-xs opacity-75 font-bold uppercase">Readiness Tier</div>
              <div className="text-sm font-black mt-1">{verdict.label}</div>
            </div>
          </div>

          {/* Feedback items accordion */}
          <div className="space-y-4">
            {evaluationFeedback.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/40 space-y-2.5">
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-extrabold text-sm text-indigo-950 dark:text-indigo-100">Q{idx + 1}: {item.question}</span>
                  <span className="badge bg-indigo-50/50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
                    {item.score}%
                  </span>
                </div>
                <div className="text-xs leading-relaxed text-indigo-900/80 dark:text-indigo-200/80">
                  <span className="font-bold text-indigo-950 dark:text-white">Your Answer:</span> "{item.userAnswer}"
                </div>
                <div className="text-xs leading-relaxed text-indigo-600 dark:text-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-100/50 dark:border-indigo-900/40">
                  <span className="font-bold text-indigo-900 dark:text-indigo-100">Evaluation Feedback:</span> {item.feedback}
                </div>
                <div className="text-xs leading-relaxed text-indigo-500 dark:text-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/10 p-2.5 rounded-xl border border-indigo-100/20 dark:border-indigo-900/20">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 block mb-1">Model Answer:</span>
                  {item.modelAnswer}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetAll}
              className="flex-1 btn-custom btn-ghost border border-indigo-100 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50 text-sm gap-1.5 cursor-pointer bg-transparent"
            >
              <RefreshCw size={16} /> Retake Test
            </button>
            
            {totalAverage >= 50 && (
              <button
                onClick={() => setStep('certificate')}
                className="flex-1 btn-custom btn-brand-custom text-sm gap-1.5 border-0 cursor-pointer"
              >
                <Sparkles size={16} /> Claim Certificate
              </button>
            )}
          </div>
        </div>
      )}

      {/* Certificate Display Step */}
      {step === 'certificate' && (
        <div className="space-y-6">
          {/* Controls (no-print) */}
          <div className="no-print glass rounded-3xl p-4 border shadow-sm flex items-center justify-between max-w-2xl mx-auto dark:text-white">
            <div className="text-sm text-indigo-950 dark:text-indigo-200">
              <span className="font-bold">Congratulations!</span> You scored an average of <span className="font-extrabold text-indigo-500">{totalAverage}%</span>. Print this certificate for your records.
            </div>
            <div className="flex gap-2">
              <button onClick={resetAll} className="btn-custom btn-ghost text-xs py-2 border border-indigo-100 text-indigo-600 dark:border-indigo-900 dark:text-indigo-300 bg-transparent cursor-pointer">
                Close
              </button>
              <button onClick={() => window.print()} className="btn-custom btn-brand-custom text-xs py-2 border-0 cursor-pointer gap-1">
                <Printer size={14} /> Print
              </button>
            </div>
          </div>

          {/* Certificate sheet wrapper */}
          <div id="resume-preview-section" className="bg-white border-8 border-double border-amber-400 max-w-2xl mx-auto p-12 text-center text-indigo-950 relative shadow-lg min-h-[480px] flex flex-col justify-between rounded-xl">
            {/* Decorative corners */}
            <div className="absolute top-3 left-3 right-3 bottom-3 border border-amber-200 pointer-events-none"></div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold uppercase tracking-widest text-amber-500">Certificate of Completion</h1>
              <div className="h-[2px] w-24 bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto mt-2"></div>
            </div>

            <div className="space-y-6 mt-8">
              <p className="text-sm italic font-medium text-indigo-400">This is proudly presented to</p>
              <h2 className="text-3xl font-black uppercase text-indigo-900 tracking-tight">{userName}</h2>
              
              <div className="max-w-md mx-auto text-xs text-indigo-950/80 leading-relaxed font-normal">
                for demonstrating exceptional knowledge and subject matter expertise during the AI Recruiter Mock Placement evaluation in the specialized track of:
                <div className="font-extrabold text-sm text-indigo-600 uppercase mt-2 bg-indigo-50/50 py-1 rounded border border-indigo-100/30">{category.toUpperCase()} DEVELOPMENT</div>
              </div>
            </div>

            {/* Date and Sign */}
            <div className="flex justify-between items-end mt-12 pt-6 border-t border-indigo-100 px-6">
              <div className="text-left space-y-1">
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Date of Issue</div>
                <div className="text-xs font-bold text-indigo-950">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div className="space-y-2 text-center">
                <span className="font-extrabold italic text-sm text-indigo-950 font-serif">PrepSmart AI</span>
                <div className="h-[1px] w-28 bg-indigo-200 mx-auto"></div>
                <div className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Authorized Evaluator</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
