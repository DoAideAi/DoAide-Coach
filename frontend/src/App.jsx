import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import { Spinner } from './components/ui'
import Home from './pages/Home'

// Home is the landing page and ships in the main bundle; each tool loads on demand.
const PAGES = {
  interview: () => import('./pages/Interview'),
  resume: () => import('./pages/Resume'),
  questions: () => import('./pages/Questions'),
  salary: () => import('./pages/Salary'),
  dashboard: () => import('./pages/Dashboard'),
  intro: () => import('./pages/Intro'),
  star: () => import('./pages/Star'),
  vsInterviewBit: () => import('./pages/VsInterviewBit'),
  industryQuestions: () => import('./pages/IndustryQuestions'),
  resumeQuestions: () => import('./pages/ResumeQuestions'),
  tips: () => import('./pages/Tips'),
  notFound: () => import('./pages/NotFound'),
}
const Interview = lazy(PAGES.interview)
const Resume = lazy(PAGES.resume)
const Questions = lazy(PAGES.questions)
const Salary = lazy(PAGES.salary)
const Dashboard = lazy(PAGES.dashboard)
const Intro = lazy(PAGES.intro)
const Star = lazy(PAGES.star)
const VsInterviewBit = lazy(PAGES.vsInterviewBit)
const IndustryQuestions = lazy(PAGES.industryQuestions)
const ResumeQuestions = lazy(PAGES.resumeQuestions)
const Tips = lazy(PAGES.tips)
const NotFound = lazy(PAGES.notFound)

export const preloadPages = () => Promise.all(Object.values(PAGES).map((load) => load()))

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-ink-soft">
      <Spinner label="Loading…" />
    </div>
  )
}

export default function App() {
  // Warm the other tools once the first screen is up so navigation feels instant.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000))
    idle(() => preloadPages().catch(() => {}))
  }, [])

  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="interview" element={<Suspense fallback={<PageLoader />}><Interview /></Suspense>} />
          <Route path="resume" element={<Suspense fallback={<PageLoader />}><Resume /></Suspense>} />
          <Route path="questions" element={<Suspense fallback={<PageLoader />}><Questions /></Suspense>} />
          <Route path="salary" element={<Suspense fallback={<PageLoader />}><Salary /></Suspense>} />
          <Route path="dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="tell-me-about-yourself" element={<Suspense fallback={<PageLoader />}><Intro /></Suspense>} />
          <Route path="star-method" element={<Suspense fallback={<PageLoader />}><Star /></Suspense>} />
          <Route path="coach-vs-interviewbit" element={<Suspense fallback={<PageLoader />}><VsInterviewBit /></Suspense>} />
          <Route path="industry-questions" element={<Suspense fallback={<PageLoader />}><IndustryQuestions /></Suspense>} />
          <Route path="resume-questions" element={<Suspense fallback={<PageLoader />}><ResumeQuestions /></Suspense>} />
          <Route path="tips" element={<Suspense fallback={<PageLoader />}><Tips /></Suspense>} />
          <Route path="*" element={<Suspense fallback={<PageLoader />}><NotFound /></Suspense>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}
