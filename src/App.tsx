import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { RepoModal } from './components/RepoModal'
import { EmptyState } from './components/EmptyState'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryDetailPage } from './pages/CategoryDetailPage'
import { ContributePage } from './pages/ContributePage'
import { GuidelinesPage } from './pages/GuidelinesPage'
import { ThemeProvider } from './hooks/ThemeProvider'
import { Icon } from './components/Icon'
import repositoriesData from './data/repositories.json'
import type { Repository } from './types'

const repositories = repositoriesData.repositories as Repository[]

function NotFoundPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <EmptyState
        icon="compass"
        title="Page not found"
        message="The page you are looking for doesn't exist. Head back home or explore the repository directory."
        action={
          <Link to="/" className="btn-primary inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 text-xs font-semibold">
            <Icon name="home" size={15} /> Back to home
          </Link>
        }
      />
    </div>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function AppShell() {
  const [modalRepo, setModalRepo] = useState<Repository | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#alternatives-grid"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-xs)] focus:bg-[var(--color-text-secondary)] focus:px-4 focus:py-2.5 focus:text-xs focus:font-semibold focus:text-black focus:ring-2 focus:ring-[var(--color-text-primary)]"
      >
        Skip to alternatives
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage repositories={repositories} onOpen={setModalRepo} />} />
          <Route path="/explore" element={<ExplorePage repositories={repositories} />} />
          <Route path="/categories" element={<CategoriesPage repositories={repositories} />} />
          <Route path="/categories/:slug" element={<CategoryDetailPage repositories={repositories} />} />
          <Route path="/contribute" element={<ContributePage repositories={repositories} />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <RepoModal repo={modalRepo} onClose={() => setModalRepo(null)} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
