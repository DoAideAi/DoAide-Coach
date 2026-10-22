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
]
