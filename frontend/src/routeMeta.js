// Title, description and canonical path for every app route in the sitemap.
//
// Read twice: by each page's <Seo>, and by scripts/prerender-routes.mjs, which
// writes dist/<route>/index.html with these tags already in the head. Crawlers
// and link unfurlers that skip JavaScript otherwise saw the homepage's title
// and canonical on every route. Plain data: the build script imports it.
export const ROUTE_META = {
  '/': {
    title: 'DoAide Coach: AI Interview Prep & Career Coaching for India',
    description:
      'Practise AI mock interviews, score your resume against Indian job descriptions, browse company-wise interview questions and get salary negotiation scripts. Free, no login.',
    path: '/',
  },
  '/interview': {
    title: 'AI Mock Interview Practice for Indian Jobs | DoAide Coach',
    description:
      'Practise role and company-specific mock interviews with AI. Get instant ratings, improvement tips and model answers for TCS, Infosys, Amazon, HDFC and more.',
    path: '/interview',
  },
  '/resume': {
    title: 'Free Resume Scorer for Indian Job Descriptions | DoAide Coach',
    description:
      'Paste your resume and a job description to get an ATS match score, missing keywords and specific improvement suggestions. Free, no login.',
    path: '/resume',
  },
  '/questions': {
    title: 'Interview Question Bank by Company & Role (India) | DoAide Coach',
    description:
      'Browse behavioral, technical and HR interview questions for TCS, Infosys, Wipro, Amazon, Flipkart, HDFC Bank and more, with tips on how to answer.',
    path: '/questions',
  },
  '/salary': {
    title: 'Salary Negotiation Script Generator for India | DoAide Coach',
    description:
      'Enter your current CTC, offer, city and experience to get a counter-offer number, a word-for-word negotiation script and an email template.',
    path: '/salary',
  },
  '/dashboard': {
    title: 'Interview Practice Progress Dashboard | DoAide Coach',
    description:
      'Track your mock interview scores, resume matches and practice streak over time. Free, and saved privately in your browser.',
    path: '/dashboard',
  },
  '/tell-me-about-yourself': {
    title: 'Tell Me About Yourself Answer Generator for Freshers & Experienced | DoAide Coach',
    description:
      "Write a confident 'Tell me about yourself' answer for your interview in 1 minute. Free AI tool for Indian freshers and experienced candidates. No login.",
    path: '/tell-me-about-yourself',
  },
  '/star-method': {
    title: 'STAR Method Answer Generator for Interviews | DoAide Coach',
    description:
      'Turn your rough story into a polished STAR interview answer (Situation, Task, Action, Result) in one minute. Free AI tool for behavioral interviews. No login.',
    path: '/star-method',
  },
  '/coach-vs-interviewbit': {
    title: 'DoAide Coach vs InterviewBit (2026): Which Interview Prep Tool Do You Need?',
    description:
      'Honest comparison of DoAide Coach and InterviewBit for interview preparation in India: AI mock interviews, behavioral and HR rounds, DSA practice, salary negotiation, pricing and login requirements.',
    path: '/coach-vs-interviewbit',
  },
  '/industry-questions': {
    title: 'Industry-Specific Interview Questions — IT, Finance, Healthcare | DoAide Coach',
    description:
      'Practise interview questions tailored to your industry: IT & software engineering, finance & banking, and healthcare. With difficulty levels and AI mock interview links.',
    path: '/industry-questions',
  },
  '/resume-questions': {
    title: 'Resume to Interview Questions — Get Likely Questions | DoAide Coach',
    description:
      'Paste your resume and get likely interview questions based on your skills, experience and job titles. 100% private — runs in your browser, nothing uploaded.',
    path: '/resume-questions',
  },
  '/tips': {
    title: 'Interview Tips & Checklist — Complete Preparation Guide | DoAide Coach',
    description:
      'Everything you need before, during and after an interview: checklists, body language tips, virtual setup, common mistakes, and more. Track your progress.',
    path: '/tips',
  },
}
