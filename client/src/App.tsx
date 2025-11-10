import { Route, Switch, Link, useLocation } from 'wouter';
import { Suspense, lazy } from 'react';
import { Analytics } from '@vercel/analytics/react';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Browse = lazy(() => import('./pages/Browse'));
const ShortcutDetail = lazy(() => import('./pages/ShortcutDetail'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Library = lazy(() => import('./pages/Library'));

function Navigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-card-light">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-purple flex items-center justify-center shadow-glow">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xl font-bold">TapTask</span>
            </a>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className={`font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
                Home
              </a>
            </Link>
            <Link href="/browse">
              <a className={`font-medium transition-colors ${
                isActive('/browse') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
                Browse
              </a>
            </Link>
            <Link href="/creator">
              <a className={`font-medium transition-colors ${
                isActive('/creator') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
                Creator
              </a>
            </Link>
            <Link href="/library">
              <a className={`font-medium transition-colors ${
                isActive('/library') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
                Library
              </a>
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/library">
              <button className="btn-secondary text-sm py-2 px-4 hidden sm:block">
                Sign In
              </button>
            </Link>
            <Link href="/creator">
              <button className="btn-primary text-sm py-2 px-4">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/browse" component={Browse} />
          <Route path="/shortcut/:slug" component={ShortcutDetail} />
          <Route path="/creator" component={CreatorDashboard} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/library" component={Library} />
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">404</div>
                <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
                <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn-primary">
                  Back to Home
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </Suspense>
      
      <Analytics />
    </div>
  );
}

export default App;