// Static SEO guides, rendered to dist/guides by scripts/build-guides.mjs.
// When adding a guide, also add its slug to GUIDES in backend/app/main.py.

export const site = {
  name: 'DoAide Coach',
  url: 'https://coach.doaide.com',
  lang: 'en-IN',
  color: '#1d4ed8',
  umamiId: '9b965d1e-a66d-4a55-adf1-d26c74bc16b3',
  nav: [
    ['/interview', 'Mock interview'],
    ['/guides', 'Guides'],
  ],
  footer:
    'DoAide Coach: free AI interview prep for Indian job seekers. Also from DoAide: <a href="https://resume.doaide.com">free resume builder</a> · <a href="https://tax.doaide.com">salary tax calculator</a>',
  indexTitle: 'Interview Prep Guides for Indian Job Seekers | DoAide Coach',
  indexH1: 'Interview and career guides',
  indexDescription:
    'Practical guides for freshers and experienced professionals in India: HR interview answers, salary negotiation and company-wise interview processes.',
  indexCta: 'Practise a free AI mock interview',
}

export const guides = [
  {
    slug: 'hr-interview-questions-for-freshers',
    title: 'Top 15 HR Interview Questions and Answers for Freshers (India 2026) | DoAide Coach',
    h1: 'Top 15 HR interview questions and answers for freshers in India',
    description:
      'The HR round questions freshers in India get asked most — tell me about yourself, why should we hire you, relocation, salary expectations — with sample answers and what interviewers look for.',
    updated: '2026-10-22',
    intro: `<p>For most freshers, the HR round is the last step between a technical clear and an offer letter — and it is where well-prepared candidates quietly pull ahead. HR interviewers are rarely testing knowledge. They want to know three things: <strong>can you communicate clearly, will you stay, and will you fit in?</strong></p>
<p>Below are the questions that come up again and again in campus and off-campus drives across Indian IT services, product companies, banks and consultancies, with a framework and a sample answer for each.</p>`,
    sections: [
      [
        'tell-me-about-yourself',
        '1. Tell me about yourself',
        `<p>Use <strong>Present → Past → Future</strong> in about 90 seconds: what you’re doing now, two things you’ve done that are relevant, and why this role is the logical next step.</p>
<blockquote>“I’m a final-year B.Tech Computer Science student at XYZ College, graduating in 2026 with an 8.1 CGPA. Over the last year I built a library-management web app in React and Node that our department now uses, and I interned at a Pune startup where I wrote API tests that cut their bug reports by about a third. I enjoy turning requirements into working software, which is why this graduate engineer role at your company appeals to me.”</blockquote>
<p>Avoid reciting your resume line by line, or starting with your hometown and family unless asked.</p>`,
      ],
      [
        'why-hire-you',
        '2. Why should we hire you?',
        `<p>Pick three strengths that map to the job description and give one proof for each. Freshers can draw proof from projects, internships, hackathons, college fests or part-time work.</p>
<blockquote>“You need someone who can learn new tech quickly, work in a team and communicate with clients. I picked up Flutter in three weeks for a hackathon where we placed second, I coordinated a 12-person team for our tech fest, and I presented our final-year project to an external panel.”</blockquote>`,
      ],
      [
        'strengths-weaknesses',
        '3. What are your strengths and weaknesses?',
        `<p>For the weakness, choose something real but not critical to the role, and show what you’re doing about it: “I used to hesitate to ask questions in group settings, so I started volunteering to summarise discussions in project meetings — it forces me to clarify doubts early.” Avoid clichés like “I’m a perfectionist.”</p>`,
      ],
      [
        'relocation-shifts',
        '4. Are you willing to relocate or work in shifts?',
        `<p>Large IT services firms ask this almost always because they staff projects across cities. If you are flexible, say so plainly. If you have a genuine constraint, state it honestly along with what you <em>can</em> do — an offer withdrawn later over a mismatch is worse than a frank answer now.</p>`,
      ],
      [
        'service-bond',
        '5. Are you comfortable with a service agreement?',
        `<p>Some employers ask freshers to sign a service agreement or training bond. Read the terms before the interview and ask HR for clarity on duration and any recovery amount. A calm “Yes, I’ve read the terms and I’m planning to grow here for the long term” is usually what they want to hear.</p>`,
      ],
      [
        'more-questions',
        '6–15. Other questions to prepare',
        `<table>
<thead><tr><th>Question</th><th>What they’re checking</th><th>Tip</th></tr></thead>
<tbody>
<tr><td>Where do you see yourself in 5 years?</td><td>Ambition and retention</td><td>Talk about deeper skills or leading a small team — within the company.</td></tr>
<tr><td>Why do you want to join us?</td><td>Research</td><td>Mention a recent client win, product or result and link it to your interests.</td></tr>
<tr><td>What are your salary expectations?</td><td>Realism</td><td>For campus roles CTC is usually fixed; say you’re comfortable with the standard package. Off-campus, give a researched range.</td></tr>
<tr><td>Tell me about a challenge you faced</td><td>Problem solving</td><td>Use STAR: Situation, Task, Action, Result.</td></tr>
<tr><td>Describe a team conflict</td><td>Maturity</td><td>Show you listened, found common ground and focused on the outcome.</td></tr>
<tr><td>Why is there a gap in your education?</td><td>Honesty</td><td>Be brief and factual, then say what you did in that time.</td></tr>
<tr><td>Do you have other offers?</td><td>Leverage and honesty</td><td>Be truthful; don’t invent offers.</td></tr>
<tr><td>Why this branch / why IT after mechanical?</td><td>Motivation</td><td>Show the concrete steps you took — courses, projects.</td></tr>
<tr><td>What did you learn from your final-year project?</td><td>Depth</td><td>Know your own contribution in detail.</td></tr>
<tr><td>Do you have any questions for us?</td><td>Interest</td><td>Always ask two: training plan for freshers, and what success looks like in the first 90 days.</td></tr>
</tbody></table>`,
      ],
      [
        'practise',
        'How to practise',
        `<p>Reading answers isn’t enough; you need to say them out loud. Record yourself, or use a <a href="/interview">free AI mock interview</a> that asks these HR questions, listens to your answer and scores structure, clarity and relevance. Browse the full <a href="/questions">question bank</a> filtered by company and role.</p>`,
      ],
    ],
    faqs: [
      ['What questions are asked in an HR interview for freshers?', 'The most common are: tell me about yourself, why should we hire you, strengths and weaknesses, willingness to relocate or work shifts, where you see yourself in five years, why this company, and whether you have questions for the interviewer.'],
      ['How long should “tell me about yourself” be?', 'About 60 to 90 seconds. Cover what you are doing now, two relevant achievements, and why this role is your next step.'],
      ['How do I answer salary expectations as a fresher?', 'For campus hiring the package is usually fixed, so say you are comfortable with the standard offer. For off-campus roles, research the typical range for the role and city and give a range.'],
      ['Can I practise HR interviews online for free?', 'Yes. DoAide Coach offers free AI mock interviews that ask common HR and technical questions and give feedback on each answer.'],
    ],
    cta: ['/interview', 'Practise these HR questions with a free AI mock interview'],
  },
  {
    slug: 'how-to-negotiate-salary-india',
    title: 'How to Negotiate Salary After a Job Offer in India (Scripts & CTC Tips) | DoAide Coach',
    h1: 'How to negotiate salary after a job offer in India',
    description:
      'Step-by-step salary negotiation for Indian job offers: understanding CTC vs in-hand, how much hike to ask for, what to say to HR (email and call scripts), and negotiating joining bonus and notice buyout.',
    updated: '2026-10-22',
    intro: `<p>Most Indian candidates accept the first number HR quotes — and many recruiters expect a counter. A calm, researched negotiation rarely costs you the offer and often adds a meaningful amount to your CTC. Here is how to do it well.</p>`,
    sections: [
      [
        'ctc',
        'First, decode the offer: CTC vs in-hand',
        `<p>CTC (cost to company) is everything the employer spends on you, not what reaches your bank account. A typical break-up:</p>
<table>
<thead><tr><th>Component</th><th>In-hand?</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>Basic + HRA + special allowance</td><td>Yes (taxable)</td><td>Your monthly salary before tax and PF.</td></tr>
<tr><td>Employer PF contribution</td><td>No</td><td>Goes to your PF account.</td></tr>
<tr><td>Gratuity</td><td>No</td><td>Usually paid only after 5 years’ service.</td></tr>
<tr><td>Variable / performance bonus</td><td>Maybe</td><td>Ask what percentage was actually paid out last year.</td></tr>
<tr><td>Joining bonus</td><td>One-time</td><td>Often has a clawback if you leave within a year.</td></tr>
<tr><td>ESOPs / RSUs</td><td>Not cash</td><td>Ask about the vesting schedule.</td></tr>
<tr><td>Insurance, meal cards</td><td>No / partial</td><td>Benefits, not salary.</td></tr>
</tbody></table>
<p>Compare offers on <strong>fixed pay</strong> and estimate your in-hand after tax with a <a href="https://tax.doaide.com">salary tax calculator</a>.</p>`,
      ],
      [
        'research',
        'Research your number',
        `<ul>
<li>Check salary ranges for the role, experience level and city on public salary-report sites and by asking peers.</li>
<li>Know your current fixed pay and what a typical switch hike looks like in your field. Ask for a percentage on <em>fixed</em> pay, not on total CTC.</li>
<li>Decide three numbers before you talk: your <strong>target</strong>, your <strong>walk-away</strong>, and an <strong>anchor</strong> slightly above the target.</li>
</ul>`,
      ],
      [
        'scripts',
        'What to say: call and email scripts',
        `<p><strong>On the call when HR shares the number</strong></p>
<blockquote>“Thank you, I’m really excited about the role and the team. Based on the scope and what I’m seeing in the market for similar roles in Bengaluru, I was expecting a fixed component closer to ₹18 LPA. Is there flexibility to get closer to that?”</blockquote>
<p><strong>By email</strong></p>
<blockquote>Hi Anjali, thank you for the offer for the Senior Analyst role — I’m keen to join. Having reviewed the break-up, I’d like to request a revision of the fixed pay to ₹14.5 LPA, in line with my current fixed pay of ₹11.8 LPA and the responsibilities we discussed. I’m happy to discuss on a call. Best, Rahul</blockquote>
<p><strong>When you have a competing offer</strong></p>
<blockquote>“I have an offer at ₹16 LPA fixed, but your company is my first choice because of the product. If you can match the fixed pay, I’m ready to accept this week.”</blockquote>
<p>Only mention a competing offer you actually have — recruiters may ask for the letter.</p>`,
      ],
      [
        'beyond-salary',
        'If the fixed pay won’t move',
        `<ul>
<li><strong>Joining bonus</strong> — especially to compensate for a bonus you forfeit by leaving.</li>
<li><strong>Notice period buyout</strong> — ask the new employer to reimburse it.</li>
<li><strong>Earlier appraisal</strong> — a salary review at 6 months instead of 12, in writing.</li>
<li><strong>Role or title</strong>, remote days, relocation support, learning budget.</li>
</ul>`,
      ],
      [
        'mistakes',
        'Mistakes to avoid',
        `<ul>
<li>Giving your expected number before you understand the role’s scope.</li>
<li>Negotiating on total CTC when most of the increase is variable or ESOPs.</li>
<li>Accepting verbally, then reopening the negotiation.</li>
<li>Ultimatums you won’t follow through on.</li>
</ul>
<p>Generate a negotiation script for your own numbers with the <a href="/salary">free salary negotiation tool</a>.</p>`,
      ],
    ],
    faqs: [
      ['Is it okay to negotiate salary after a job offer in India?', 'Yes. Recruiters generally expect a polite, researched counter, and a reasonable request rarely leads to an offer being withdrawn.'],
      ['How much hike should I ask for when switching jobs?', 'It depends on your field, demand for your skills and your current pay. Research market ranges for the role and city, and ask for an increase on fixed pay rather than total CTC.'],
      ['What is the difference between CTC and in-hand salary?', 'CTC includes employer PF, gratuity, variable pay and benefits. In-hand salary is the monthly amount you receive after tax, PF and other deductions.'],
      ['Can I negotiate a joining bonus instead of salary?', 'Yes. If the fixed pay is capped, a joining bonus, notice-period buyout or an early salary review are common alternatives.'],
    ],
    cta: ['/salary', 'Get a salary negotiation script for your offer'],
  },
  {
    slug: 'tcs-infosys-wipro-interview-process',
    title: 'TCS, Infosys and Wipro Interview Process for Freshers 2026: Rounds & Prep | DoAide Coach',
    h1: 'TCS, Infosys and Wipro interview process for freshers (2026)',
    description:
      'How fresher hiring typically works at TCS, Infosys and Wipro: online assessment, technical interview and HR round, the questions commonly reported, and a 2-week preparation plan.',
    updated: '2026-10-22',
    intro: `<p>TCS, Infosys and Wipro hire tens of thousands of freshers every year, through campus drives and national off-campus tests. The exact names and formats of their hiring programmes change from year to year, so always check the official careers page for the current drive — but the overall shape of the process has stayed consistent. This guide walks through it and how to prepare.</p>`,
    sections: [
      [
        'overall',
        'The common shape of the process',
        `<ol>
<li><strong>Online assessment</strong> — aptitude (quantitative, logical reasoning, verbal), often with a coding section. Higher scores can qualify you for higher-paying role tracks.</li>
<li><strong>Technical interview</strong> — your projects, one programming language in depth, OOP, DBMS/SQL, basic data structures, sometimes OS and networking.</li>
<li><strong>Managerial / HR interview</strong> — communication, relocation, shifts, service agreement, documents.</li>
</ol>
<p>For freshers, rounds 2 and 3 are sometimes combined into one panel.</p>`,
      ],
      [
        'tcs',
        'TCS',
        `<p>TCS has run its national qualifier test (NQT) for freshers, with results used to place candidates into different role tracks with different packages. The test typically covers numerical, verbal and reasoning ability plus programming logic and hands-on coding. Interviews then probe your final-year project, your strongest language and fundamentals.</p>
<p><strong>Commonly reported questions:</strong> difference between C and Java / Java and Python; OOP pillars with examples; normalisation and joins in SQL; reverse a string or check a palindrome; “Are you willing to relocate anywhere in India?”</p>`,
      ],
      [
        'infosys',
        'Infosys',
        `<p>Infosys hires freshers into several tracks, from systems engineer roles to higher “specialist” or “power programmer” style tracks that require stronger coding. The online test mixes reasoning, maths, verbal ability and pseudocode/coding; higher tracks have harder coding problems.</p>
<p><strong>Commonly reported questions:</strong> explain your project architecture; SQL queries on a sample table; what is polymorphism; DSA questions on arrays and strings for higher tracks; “Why Infosys?”</p>`,
      ],
      [
        'wipro',
        'Wipro',
        `<p>Wipro’s fresher drives typically start with an online assessment covering aptitude, an essay or written communication section, and coding. Interviews focus on fundamentals and your projects, followed by an HR discussion that often covers the service agreement and shift flexibility.</p>
<p><strong>Commonly reported questions:</strong> write a program for Fibonacci or prime numbers; difference between process and thread; primary vs foreign key; “Tell me about yourself”; “Are you comfortable with night shifts?”</p>`,
      ],
      [
        'plan',
        'A 2-week preparation plan',
        `<table>
<thead><tr><th>Days</th><th>Focus</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>Aptitude: percentages, ratios, time & work, number series, syllogisms. One timed mock per day.</td></tr>
<tr><td>5–8</td><td>Coding: 2–3 easy/medium problems daily on strings, arrays and loops in your main language.</td></tr>
<tr><td>9–11</td><td>Fundamentals: OOP, DBMS & SQL, OS basics. Re-learn your own project end to end.</td></tr>
<tr><td>12–14</td><td>Interviews: practise <a href="/guides/hr-interview-questions-for-freshers">HR answers</a> and technical explanations out loud with <a href="/interview">AI mock interviews</a>.</td></tr>
</tbody></table>`,
      ],
      [
        'documents',
        'Documents and final checks',
        `<p>Keep mark sheets, ID proof, passport photos and any backlog-clearance certificates ready, and make sure your resume matches what you filled in the application. Build a clean one-page resume with the <a href="https://resume.doaide.com">free resume builder</a>, then check it against the job description with the <a href="/resume">resume scorer</a>.</p>`,
      ],
    ],
    faqs: [
      ['How many rounds are there in TCS, Infosys and Wipro fresher interviews?', 'Typically three stages: an online assessment, a technical interview and an HR or managerial interview. For freshers the last two are sometimes combined.'],
      ['Which programming language should I use?', 'Use the language you know best, usually C, C++, Java or Python. Interviewers care more about clear logic and fundamentals than the specific language.'],
      ['Do TCS, Infosys and Wipro ask DSA questions?', 'Basic data structures and coding problems are common. Harder DSA questions are more likely for the higher-paying role tracks.'],
      ['Where can I find company-wise interview questions?', 'DoAide Coach has a free question bank you can filter by company, role and difficulty, and AI mock interviews to practise answers.'],
    ],
    cta: ['/questions', 'Browse company-wise interview questions'],
  },
  {
    slug: 'tell-me-about-yourself-answer',
    title: 'How to Answer "Tell Me About Yourself" (Freshers & Experienced, with Samples) | DoAide Coach',
    h1: 'How to answer “Tell me about yourself” in an interview',
    description:
      'A simple present-past-future formula for “Tell me about yourself”, with sample answers for freshers, IT professionals and career switchers in India, plus the mistakes that cost candidates the first impression.',
    updated: '2026-10-22',
    intro: `<p>“Tell me about yourself” opens almost every interview in India — campus drives, lateral hires, HR rounds and managerial rounds alike. It looks like an icebreaker, but interviewers use it to judge how clearly you communicate and whether you understand what the job needs.</p>
<p>The good news: it is the one question you can fully prepare in advance. This guide gives you a structure, three sample answers and a checklist.</p>`,
    sections: [
      [
        'formula',
        'The formula: present, past, future',
        `<ol>
<li><strong>Present (1-2 sentences):</strong> who you are right now — final-year student, or your current role and years of experience.</li>
<li><strong>Past (2-3 sentences):</strong> the skills and one specific proof point — a project, internship or achievement, ideally with a number.</li>
<li><strong>Future (1-2 sentences):</strong> why this role at this company is the natural next step.</li>
</ol>
<p>Aim for 60 to 90 seconds — about 130 to 190 words. Then stop and let the interviewer pick a thread. If you want a first draft from your own details, the <a href="/tell-me-about-yourself">free “Tell me about yourself” writer</a> builds one in this structure.</p>`,
      ],
      [
        'fresher',
        'Sample answer for a fresher',
        `<blockquote>“I’m Priya, a final-year B.Tech Computer Science student at VIT, graduating in 2026. I enjoy building practical software — my main project is a library app in React and Node.js that about 300 students in my department use to reserve books. Last summer I interned at a Pune startup, where I wrote automated API tests. I’m applying for the Systems Engineer role at Infosys because I want to work on large client projects and learn how enterprise software is delivered.”</blockquote>
<p>Why it works: it is specific (one project, one number), relevant to the role, and short.</p>`,
      ],
      [
        'experienced',
        'Sample answer for an experienced professional',
        `<blockquote>“I’m Arjun. I’ve spent four years at HDFC Bank, currently as an MIS Executive in the retail lending team. I own the weekly branch performance reports, and last year I moved them from manual Excel to Power BI, which cut preparation time by about 40%. That project got me deeply into SQL and data modelling. I’m now looking for a Data Analyst role where analysis is the core of the job rather than a side task, which is why this position stood out.”</blockquote>`,
      ],
      [
        'switcher',
        'Sample answer for a career switcher',
        `<blockquote>“I’m Neha. For three years I’ve been in customer support at a SaaS company, and for the last year I’ve also been the team’s go-to person for the product’s analytics dashboards. I completed a Google UX certificate and redesigned our help-centre flow as a side project, which reduced repeat tickets on billing questions. I’m moving into product design because I want to fix the problems I’ve been hearing about from customers every day.”</blockquote>
<p>For a switch, connect the old role to the new one so the move sounds planned, not random.</p>`,
      ],
      [
        'mistakes',
        'Mistakes to avoid',
        `<ul>
<li><strong>Reading out your resume.</strong> They have it. Pick the two or three points that matter for this job.</li>
<li><strong>Starting with family and hometown.</strong> “My father is a…” is common in Indian interviews and rarely helps. Add personal details only if asked.</li>
<li><strong>Going over two minutes.</strong> Long answers signal poor prioritisation.</li>
<li><strong>Being vague.</strong> “I am hardworking and a team player” is forgettable. One concrete example beats five adjectives.</li>
<li><strong>Memorising word for word.</strong> Learn the structure and key points; say it naturally.</li>
</ul>`,
      ],
    ],
    faqs: [
      ['How long should my answer to “Tell me about yourself” be?', 'Between 60 and 90 seconds, which is about 130 to 190 words when spoken at a calm pace.'],
      ['Should I mention my family background?', 'Usually no. Unless the interviewer asks, focus on your education, skills, experience and why you want the role.'],
      ['Can I use the same answer for every interview?', 'Keep the same structure, but change the last part — why this role and company — and pick the proof point most relevant to each job.'],
      ['Is “Introduce yourself” the same question?', 'Yes. “Introduce yourself”, “Walk me through your resume” and “Tell me about yourself” all expect the same short present-past-future answer.'],
    ],
    cta: ['/tell-me-about-yourself', 'Write your “Tell me about yourself” answer free'],
  },
  {
    slug: 'ats-resume-keywords-india',
    title: 'ATS Resume Keywords: How to Get Past Naukri and LinkedIn Filters (India 2026) | DoAide Coach',
    h1: 'ATS resume keywords: how to get your resume past the filters',
    description:
      'How applicant tracking systems used by Indian employers and job portals read your resume, how to pick keywords from a job description, formatting that breaks parsing, and a free resume-vs-JD score.',
    updated: '2026-10-22',
    intro: `<p>When you apply through a careers page, Naukri or LinkedIn, your resume is often parsed and searched by software before a recruiter opens it. Recruiters search and filter by skills, titles and experience, so a resume that is missing the right words can be skipped even when you are qualified.</p>
<p>This guide explains what these systems look at and how to tailor your resume to a job description without stuffing it.</p>`,
    sections: [
      [
        'how-ats',
        'What an ATS actually does',
        `<ul>
<li><strong>Parses</strong> your resume into fields: name, contact, titles, employers, dates, education and skills.</li>
<li><strong>Lets recruiters search</strong> those fields, for example “Java AND Spring Boot, 3-6 years, Bengaluru”.</li>
<li><strong>Ranks or filters</strong> applicants against the job’s requirements in some systems.</li>
</ul>
<p>It does not “reject” you for a fancy design by itself — but a resume that parses badly may show up with empty fields and never match a search.</p>`,
      ],
      [
        'keywords',
        'Finding the right keywords in a job description',
        `<ol>
<li>Copy the job description and highlight <strong>hard skills</strong> (Python, SAP FICO, Tally, Salesforce), <strong>tools</strong>, <strong>certifications</strong> and the <strong>exact job title</strong>.</li>
<li>Note which ones appear more than once or under “must have” — those matter most.</li>
<li>For each keyword you genuinely have, make sure it appears in your skills section <em>and</em> in a bullet that shows you using it.</li>
<li>Match the employer’s wording: if they say “Power BI”, don’t only write “BI dashboards”.</li>
</ol>
<p>The <a href="/resume">free resume scorer</a> does this comparison for you: paste your resume and the job description to see matched and missing keywords and an ATS checklist.</p>`,
      ],
      [
        'format',
        'Formatting that parses well',
        `<table>
<thead><tr><th>Do</th><th>Avoid</th></tr></thead>
<tbody>
<tr><td>Single column, standard headings (Experience, Education, Skills)</td><td>Two-column layouts with text boxes</td></tr>
<tr><td>Text-based PDF or DOCX</td><td>Scanned images or a resume as a photo</td></tr>
<tr><td>Dates as “Jun 2023 – Present”</td><td>Skill bars and star ratings</td></tr>
<tr><td>Contact details in the body</td><td>Important details only in the header/footer</td></tr>
</tbody></table>`,
      ],
      [
        'stuffing',
        'Why keyword stuffing backfires',
        `<p>Pasting the whole job description in white text, or listing 60 skills, may get you past a search — and then a recruiter reads it. Keep every keyword truthful and backed by a bullet point. Interviewers in India commonly pick a skill from your resume and ask you to explain a project where you used it.</p>`,
      ],
    ],
    faqs: [
      ['Do Naukri and LinkedIn use ATS keyword matching?', 'Recruiters on job portals search and filter candidates by skills, titles, experience and location, so the same keyword advice applies to your profile and uploaded resume.'],
      ['Is a PDF resume ATS-friendly?', 'A text-based PDF exported from Word or Google Docs parses well. A scanned PDF or an image does not.'],
      ['How many keywords should my resume have?', 'There is no magic number. Cover the must-have skills from the job description that you genuinely have, each backed by experience.'],
      ['What is a good resume match score?', 'On the DoAide Coach scorer, 75 and above means a strong match. Between 50 and 75, add the missing must-have keywords you genuinely have; below 50, tailor your resume before applying.'],
    ],
    cta: ['/resume', 'Score your resume against a job description'],
  },
  {
    slug: 'ai-mock-interview-practice-free',
    title: 'AI Mock Interview Practice Free: Rehearse Before the Real Thing (2026) | DoAide Coach',
    h1: 'AI mock interview practice, free: rehearse before the real thing',
    description:
      'How free AI mock interview practice works, why rehearsing out loud beats reading answers, and a 7-day practice plan for Indian freshers and experienced candidates — no login, no payment.',
    updated: '2026-10-22',
    intro: `<p>Most candidates in India prepare for interviews by reading: question lists, "top answers" blogs, YouTube videos. Then the real interview starts, the mind goes blank, and a perfectly knowledgeable candidate rambles through "tell me about yourself". The gap is not knowledge — it is <strong>rehearsal</strong>. Speaking answers out loud, under light pressure, with feedback.</p>
<p>That used to require a friend, a mentor or a paid coaching class. An <strong>AI mock interview</strong> gives you the same rehearsal free, any time of day, with no judgement and no scheduling. This guide explains how AI mock interviews work, what they can and cannot do, and a one-week practice plan that noticeably improves performance.</p>`,
    sections: [
      [
        'what-it-is',
        'What an AI mock interview actually does',
        `<p>An AI mock interview simulates the question-answer loop of a real interview:</p>
<ul>
<li><strong>It asks real questions</strong> — HR, behavioural, situational and role-based — the way an interviewer would, one at a time.</li>
<li><strong>You answer in your own words</strong>, ideally out loud, as you would across the table.</li>
<li><strong>It evaluates your answer</strong>: structure, relevance, specificity, confidence markers — and gives instant feedback with a better version.</li>
<li><strong>It adapts.</strong> Follow-up questions probe the weak parts of your answer, just like a good interviewer.</li>
</ul>
<p>On <a href="/interview">DoAide Coach</a> this is free and needs no login: choose your role and experience level, and the interview starts. Practise HR rounds, behavioural rounds or role-specific questions, with a <a href="/star-method">STAR answer generator</a> when you get stuck structuring a story.</p>`,
      ],
      [
        'why-it-works',
        'Why rehearsing out loud beats reading answers',
        `<ul>
<li><strong>Retrieval practice.</strong> Reading an answer feels like knowing it; producing it from memory is what the interview demands. Practice the production, not the recognition.</li>
<li><strong>Fluency is trainable.</strong> The first time you say "my biggest strength is..." out loud, you stumble. The fifth time, you do not. Interviewers read that fluency as confidence and clarity.</li>
<li><strong>You discover your filler habits.</strong> "Basically", "like", "you know", trailing off mid-sentence — you cannot fix what you have never heard yourself do.</li>
<li><strong>Pressure inoculation.</strong> Even mild simulated pressure (a timer, an unexpected follow-up) reduces the shock of the real thing. The <a href="/interview">mock interview</a> includes an optional timer for exactly this reason.</li>
<li><strong>Feedback loops are tight.</strong> In a coaching class you get feedback on two answers a week. With AI you can get feedback on twenty answers in an evening.</li>
</ul>`,
      ],
      [
        'practice-plan',
        'A 7-day AI mock interview practice plan',
        `<ol>
<li><strong>Day 1 — Baseline.</strong> Do one full <a href="/interview">mock interview</a> cold. Do not prepare. Note your score and the questions that hurt.</li>
<li><strong>Day 2 — Your story.</strong> Fix "tell me about yourself" first; it sets the tone of every interview. Use the <a href="/tell-me-about-yourself">answer writer</a>, then rehearse it aloud until the 60-90 second version is automatic.</li>
<li><strong>Day 3 — Behavioural stories.</strong> Prepare 4-5 STAR stories (conflict, failure, leadership, deadline, initiative) with the <a href="/star-method">STAR generator</a>. One strong story can answer many questions.</li>
<li><strong>Day 4 — Role questions.</strong> Run a role-specific round from the <a href="/questions">question bank</a> for your profile (developer, analyst, sales, HR...).</li>
<li><strong>Day 5 — Weak spots.</strong> Repeat only the questions you scored lowest on. Improvement here is fastest.</li>
<li><strong>Day 6 — Full dress rehearsal.</strong> Complete interview, timer on, sitting as you would on camera. Compare the score with Day 1.</li>
<li><strong>Day 7 — Logistics round.</strong> Prepare salary discussion with our <a href="/guides/how-to-negotiate-salary-india">negotiation guide</a> and the <a href="/salary">salary tool</a>, and your questions for the interviewer.</li>
</ol>`,
      ],
      [
        'limits',
        'What AI practice cannot do (and how to cover it)',
        `<p>Be honest about the limits. An AI mock interview cannot replicate panel dynamics, a stressed interviewer having a bad day, or the small talk that builds rapport. It also cannot verify deep technical skill the way a live coding round does.</p>
<p>Cover those separately: one live mock with a friend or senior for the human element, and standard technical prep for your stack. Use AI practice for what it does best — unlimited, judgement-free rehearsal of the verbal 80% of every interview. Freshers should pair this with our <a href="/guides/hr-interview-questions-for-freshers">HR questions for freshers</a> guide; service-company applicants should read the <a href="/guides/tcs-infosys-wipro-interview-process">TCS/Infosys/Wipro process guide</a>.</p>`,
      ],
    ],
    faqs: [
      ['Is AI mock interview practice really free on DoAide Coach?', 'Yes. The mock interview, question bank, STAR generator and feedback are free and work in the browser without creating an account.'],
      ['How many mock interviews should I do before the real one?', 'Three to five focused sessions produce a visible improvement for most candidates. One cold baseline, two or three targeted at weak answers, and one full dress rehearsal the day before.'],
      ['Does AI interview practice work for freshers?', 'Especially well. Freshers rarely have access to seniors or paid coaching, and the questions freshers face (strengths, relocation, why this company) are highly rehearsable. Start with the HR round and build confidence.'],
      ['Can I practise in Hindi or Hinglish?', 'You can answer in the language you are comfortable with, but if your target interview is in English, practise in English — fluency under pressure is exactly the skill being trained.'],
      ['Will interviewers know I practised with AI?', 'They will only notice that you answer in clear, structured, specific sentences. Rehearsal is what every strong candidate does; AI just makes it free and unlimited.'],
    ],
    cta: ['/interview', 'Start a free AI mock interview now'],
  },
  {
    slug: 'top-interview-questions-india-2026',
    title: 'Top Interview Questions in India 2026: HR, Behavioural & Role-Based (With Answers) | DoAide Coach',
    h1: 'Top interview questions in India 2026 — and how to answer them',
    description:
      'The interview questions Indian candidates face most in 2026 — HR, behavioural, situational and role-based — with answer frameworks, examples and the mistakes that cost offers.',
    updated: '2026-10-22',
    intro: `<p>Interviews in India follow patterns. Whether you are a fresher facing a campus HR round or an experienced engineer in a product-company loop, most questions come from a predictable core — and interviewers are not testing whether you have heard the question before, but whether your answer is <strong>structured, specific and honest</strong>.</p>
<p>This guide covers the questions asked most across Indian interviews in 2026, grouped by round, with a framework for each. Rehearse them out loud in a <a href="/interview">free AI mock interview</a> rather than just reading — that is the difference between knowing an answer and delivering it.</p>`,
    sections: [
      [
        'hr-round',
        'The HR round: 10 questions you will almost certainly face',
        `<ol>
<li><strong>Tell me about yourself.</strong> 60-90 seconds: present → past → why this role. Build yours with the <a href="/tell-me-about-yourself">answer writer</a>.</li>
<li><strong>Why do you want to join us?</strong> One specific fact about the company + one honest link to your goals. Generic praise is a red flag.</li>
<li><strong>What are your strengths?</strong> Two strengths, each with a 15-second example. Claimed without evidence, strengths count for nothing.</li>
<li><strong>What is your biggest weakness?</strong> A real, non-fatal weakness + what you are doing about it. "I am a perfectionist" has been dead for years.</li>
<li><strong>Where do you see yourself in 5 years?</strong> Ambition inside the company's realistic path, not a specific designation.</li>
<li><strong>Why are you leaving your current job?</strong> Forward-looking reasons (growth, scope, learning). Never badmouth the current employer.</li>
<li><strong>What are your salary expectations?</strong> A researched range, not a number pulled from hope. Prepare with the <a href="/guides/how-to-negotiate-salary-india">salary negotiation guide</a>.</li>
<li><strong>Are you open to relocation / night shifts?</strong> Decide before the interview; a confident yes or a conditional, honest answer both beat visible hesitation.</li>
<li><strong>Explain the gap in your resume.</strong> Brief, factual, ending with what you did during it (upskilling, family responsibility, freelancing).</li>
<li><strong>Do you have any questions for us?</strong> Always have two: one about the role's first 90 days, one about the team. "No questions" reads as no interest.</li>
</ol>
<p>Freshers: the campus variants of these are covered in depth in <a href="/guides/hr-interview-questions-for-freshers">HR interview questions for freshers</a>.</p>`,
      ],
      [
        'behavioural',
        'Behavioural and situational questions: the STAR five',
        `<p>Behavioural questions ("tell me about a time when...") dominate mid-level interviews in 2026, and situational ones ("what would you do if...") are their forward-looking twin. Five prepared stories cover almost all of them:</p>
<ul>
<li><strong>Conflict:</strong> a disagreement with a colleague or manager, resolved professionally.</li>
<li><strong>Failure:</strong> a genuine mistake, what it cost, what changed afterwards.</li>
<li><strong>Deadline/pressure:</strong> delivering under constraint, and the trade-offs you chose.</li>
<li><strong>Leadership/initiative:</strong> a time you acted beyond your role without being asked.</li>
<li><strong>Learning:</strong> picking up a skill or domain quickly because the work demanded it.</li>
</ul>
<p>Structure each with STAR — Situation, Task, Action, Result — in about 90 seconds, with a number in the Result wherever possible ("reduced processing time 30%", "recovered ₹2 lakh of pending collections"). The <a href="/star-method">STAR answer generator</a> turns a rough memory into a structured story you can rehearse.</p>`,
      ],
      [
        'role-based',
        'Role-based questions in 2026: what has changed',
        `<p>Beyond HR and behavioural rounds, expect role-specific screens — and in 2026 two shifts are visible across Indian hiring:</p>
<ul>
<li><strong>AI tool fluency is now a standard question.</strong> "How do you use AI tools in your work?" appears in developer, analyst, marketing and content interviews alike. Have a concrete, honest answer: which tools, for what, and where you still apply your own judgement.</li>
<li><strong>Depth beats breadth.</strong> Interviewers increasingly pick one project from your resume and drill: why this design, what failed, what would you change. One project you can defend for 15 minutes is worth five you can only describe for one.</li>
</ul>
<p>Practise role-specific sets — developer, data analyst, sales, HR, customer support and more — in the <a href="/questions">question bank</a>, and make sure the keywords on your resume match what you can actually defend (see <a href="/guides/ats-resume-keywords-india">ATS resume keywords</a>).</p>`,
      ],
      [
        'mistakes',
        'The five mistakes that cost offers',
        `<ol>
<li><strong>Memorised-sounding answers.</strong> Interviewers hear the same recited lines daily. Rehearse ideas and structure, not scripts.</li>
<li><strong>No numbers.</strong> "Improved performance" vs "cut load time from 4s to 1.2s" — specificity is credibility.</li>
<li><strong>Badmouthing an employer.</strong> However justified, it transfers the negativity to you.</li>
<li><strong>Not asking anything.</strong> Questions signal seriousness; silence signals a backup option.</li>
<li><strong>Zero rehearsal.</strong> Reading guides (including this one) without speaking the answers aloud. Fix that today with a <a href="/interview">free mock interview</a> — the first one takes 15 minutes.</li>
</ol>`,
      ],
    ],
    faqs: [
      ['What are the most common interview questions in India in 2026?', 'Tell me about yourself, why should we hire you, strengths and weaknesses, salary expectations, reason for leaving, and behavioural questions like describing a conflict or failure. Role-based rounds increasingly add questions about how you use AI tools in your work.'],
      ['How do I answer "tell me about yourself"?', 'Use a 60-90 second present-past-future structure: your current role or studies, the experience that led here, and why this role fits your goals. End on the role, not your hobbies.'],
      ['What is the STAR method?', 'Situation, Task, Action, Result — a structure for behavioural answers. Describe the context briefly, your specific responsibility, the actions you personally took, and a measurable outcome.'],
      ['How long should interview answers be?', 'HR answers: 30-90 seconds. Behavioural stories: about 90 seconds. If the interviewer wants more, they will ask follow-ups — leaving room for them is good interviewing.'],
      ['How should freshers prepare differently from experienced candidates?', 'Freshers should lead with projects, internships and learning speed since there is no work history to probe, and prepare the campus-HR staples (relocation, bond, shift flexibility). Experienced candidates should prepare to defend resume claims in depth and to discuss salary with researched numbers.'],
    ],
    cta: ['/interview', 'Practise these questions in a free mock interview'],
  },
  {
    slug: 'complete-interview-preparation-guide-2026',
    title: 'Complete Interview Preparation Guide for 2026 — Step by Step | DoAide Coach',
    h1: 'Complete interview preparation guide for 2026',
    description:
      'A step-by-step plan to prepare for job interviews in India in 2026: timeline, common questions, STAR method, salary negotiation, virtual interviews and follow-up.',
    updated: '2026-10-23',
    intro: `<p>Whether you are a fresher stepping into your first placement season or an experienced professional switching roles, interview preparation follows the same disciplined path: <strong>research → practise → execute → follow up</strong>. This guide gives you a concrete timeline and checklist so nothing falls through the cracks.</p>`,
    sections: [
      [
        'timeline',
        'Preparation timeline — from 2 weeks to interview day',
        `<table>
<thead><tr><th>When</th><th>What to do</th></tr></thead>
<tbody>
<tr><td><strong>Day 1-3</strong></td><td>Research the company: products, competitors, recent news, Glassdoor reviews. Read the job description line by line and note which skills you can prove.</td></tr>
<tr><td><strong>Day 4-5</strong></td><td>Prepare 5-6 STAR stories covering teamwork, leadership, conflict, failure, initiative and a technical challenge. Write them down, then reduce to bullet points.</td></tr>
<tr><td><strong>Day 6-8</strong></td><td>Practise mock interviews. Use <a href="/interview">DoAide Coach's AI mock interview</a> for instant feedback. Record yourself to check pacing and filler words.</td></tr>
<tr><td><strong>Day 9-10</strong></td><td>Deep-dive into role-specific prep: system design for engineers, case studies for consultants, market sizing for PMs, regulatory knowledge for finance.</td></tr>
<tr><td><strong>Day 11-12</strong></td><td>Research salary range (AmbitionBox, Glassdoor, Levels.fyi for tech). Decide your ideal and walk-away number.</td></tr>
<tr><td><strong>Day 13</strong></td><td>Final mock: simulate the full loop — HR, technical, behavioral — back to back. Time each answer.</td></tr>
<tr><td><strong>Day 14 (Eve)</strong></td><td>Print resume, lay out outfit, confirm logistics, sleep 7-8 hours.</td></tr>
</tbody></table>`,
      ],
      [
        'common-questions',
        'The 10 questions you will almost certainly face',
        `<ol>
<li><strong>Tell me about yourself.</strong> 60-90 seconds, present → past → future. End on why this role fits.</li>
<li><strong>Why this company?</strong> Name something specific: a product you use, a value you share, or a recent initiative.</li>
<li><strong>What are your strengths?</strong> Pick 2-3 that match the JD, give a quick proof point for each.</li>
<li><strong>What is your biggest weakness?</strong> Name a real one, then explain what you are doing to fix it.</li>
<li><strong>Where do you see yourself in 5 years?</strong> Show ambition aligned with the company, not "in your chair".</li>
<li><strong>Why are you leaving your current role?</strong> Focus on growth, learning or mission — never badmouth.</li>
<li><strong>Tell me about a time you failed.</strong> STAR with genuine failure, emphasise what you learned and changed.</li>
<li><strong>How do you handle pressure?</strong> Give a concrete example: deadline, scope change, production incident.</li>
<li><strong>What is your expected salary?</strong> Give a researched range, not a single number. Ask about total comp.</li>
<li><strong>Do you have questions for us?</strong> Always. Ask about team structure, success metrics for the role, or growth paths.</li>
</ol>
<p>Practise all ten in a <a href="/interview">free AI mock interview</a> — the AI rates your answer and suggests a model response.</p>`,
      ],
      [
        'star-method',
        'STAR method — structure every behavioral answer',
        `<p>The <strong>STAR method</strong> turns a rambling story into a crisp, persuasive answer:</p>
<ol>
<li><strong>Situation:</strong> Set the scene in 1-2 sentences. Where were you, what was happening?</li>
<li><strong>Task:</strong> What was your specific responsibility? Not the team's — yours.</li>
<li><strong>Action:</strong> What did you do? Be detailed and personal: "I" not "we".</li>
<li><strong>Result:</strong> Quantify the outcome. Revenue, time saved, NPS, user growth — numbers stick.</li>
</ol>
<p>Prepare 5-6 STAR stories that cover leadership, teamwork, conflict, failure, initiative and a technical win. You will reuse the same stories across multiple questions.</p>
<p>Need help structuring your STAR answers? Try the <a href="/star-method">STAR method answer generator</a>.</p>`,
      ],
      [
        'salary-negotiation',
        'Salary negotiation — how to get what you deserve',
        `<ul>
<li><strong>Research first.</strong> Check AmbitionBox, Glassdoor, and Levels.fyi (for tech). Know the 25th, 50th and 75th percentile for your role and location.</li>
<li><strong>Delay the number.</strong> If asked in the HR screen, say "I'd like to understand the full role before discussing numbers."</li>
<li><strong>Give a range, not a point.</strong> Set the bottom of your range at your ideal number.</li>
<li><strong>Negotiate total comp.</strong> Base, bonus, RSUs, joining bonus, relocation, work-from-home allowance — everything is negotiable.</li>
<li><strong>Get it in writing.</strong> A verbal "yes" is not an offer. Wait for the offer letter before resigning.</li>
<li><strong>Be polite and firm.</strong> Negotiation is expected. No one rescinds an offer because you asked for more.</li>
</ul>
<p>Use the <a href="/salary">salary calculator</a> to see your in-hand pay after taxes and deductions.</p>`,
      ],
      [
        'virtual-interviews',
        'Virtual interview best practices',
        `<ul>
<li>Test camera, mic and internet 30 minutes before the call.</li>
<li>Use a wired connection if possible — Wi-Fi drops at the worst moment.</li>
<li>Sit facing a window for natural light. A ring light is a cheap backup.</li>
<li>Close all other tabs and apps. Notifications are distracting.</li>
<li>Look at the camera, not the screen, when speaking.</li>
<li>Keep a notepad for questions — typing sounds come through the mic.</li>
<li>Dress formally from head to toe. You might need to stand up.</li>
<li>Have a phone number ready to switch to audio if video fails.</li>
</ul>`,
      ],
      [
        'follow-up',
        'After the interview — follow up and reflect',
        `<ol>
<li>Send a thank-you email within 24 hours. Reference something specific the interviewer said.</li>
<li>Note every question you were asked and how you answered. This is your best study material for the next round or the next company.</li>
<li>If you haven't heard back in 7 days, send a polite follow-up: one sentence asking for an update.</li>
<li>Continue applying. Even if this interview went perfectly, a parallel pipeline reduces anxiety and gives you leverage.</li>
</ol>`,
      ],
    ],
    faqs: [
      ['How long should I prepare for an interview?', 'Two weeks of focused prep is ideal. If you have less time, prioritise: research the company (1 day), prepare STAR stories (1 day), and do at least one mock interview (1 hour).'],
      ['How many mock interviews should I do?', 'At least 3. One to get comfortable, one to refine, and one simulating the real format. More is better if time allows.'],
      ['Should I memorise answers?', 'No. Memorised answers sound robotic and fall apart with follow-up questions. Prepare bullet points and practise speaking naturally around them.'],
      ['How do I handle a question I do not know the answer to?', 'Say honestly that you do not know, then explain how you would find out. Interviewers value honesty and problem-solving more than pretending.'],
      ['Is it okay to ask about salary in the first round?', 'It depends on the company. If HR brings it up, answer with a researched range. Otherwise, wait until the company expresses interest.'],
      ['What if I get rejected?', 'Ask for feedback (many companies give it if you ask), study your notes, and improve for the next one. Most successful candidates faced several rejections before landing the right offer.'],
    ],
    cta: ['/interview', 'Start a free AI mock interview now'],
  },
]
