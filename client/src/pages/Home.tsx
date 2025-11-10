import { trpc } from '../lib/trpc';
import { Link } from 'wouter';

export default function Home() {
  // Try to get featured shortcuts first, fall back to all shortcuts
  const { data: featuredShortcuts, isLoading: featuredLoading } = trpc.shortcuts.list.useQuery({
    featured: true,
    limit: 6,
  });
  
  const { data: allShortcuts, isLoading: allLoading } = trpc.shortcuts.list.useQuery({
    limit: 6,
  }, {
    enabled: !featuredLoading && (!featuredShortcuts || featuredShortcuts.length === 0),
  });
  
  const shortcuts = featuredShortcuts && featuredShortcuts.length > 0 ? featuredShortcuts : allShortcuts;
  const isLoading = featuredLoading || allLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Gradient Orb Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto text-center">
          {/* Logo Badge */}
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-purple shadow-glow-lg animate-pulse-glow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-glow">
            Tap. Task. <span className="text-primary">Done.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The marketplace for iPhone automations. One tap to transform your workflow.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-lg px-8 py-4">
              Browse Shortcuts
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Become a Creator
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
            <div className="px-6">
              <div className="text-4xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Shortcuts</div>
            </div>
            <div className="px-6">
              <div className="text-4xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Users</div>
            </div>
            <div className="px-6">
              <div className="text-4xl font-bold text-primary">1M+</div>
              <div className="text-muted-foreground">Tasks Automated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Shortcuts */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">
              Featured <span className="text-primary">Shortcuts</span>
            </h2>
            <button className="btn-secondary">View All</button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-electric animate-pulse">
                  <div className="h-12 w-12 bg-card-light rounded-lg mb-4" />
                  <div className="h-6 bg-card-light rounded mb-2" />
                  <div className="h-4 bg-card-light rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortcuts?.map((shortcut) => (
                <Link key={shortcut.id} href={`/shortcut/${shortcut.slug}`}>
                  <div className="card-electric cursor-pointer group">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {shortcut.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {shortcut.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="badge-purple">
                        {shortcut.category}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ${(shortcut.price / 100).toFixed(2)}
                      </span>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-purple opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Explore by <span className="text-primary">Category</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Productivity', 'Entertainment', 'Utilities', 'Health', 'Social', 'Education'].map((category) => (
              <button
                key={category}
                className="card-electric text-center py-8 hover:bg-primary/10"
              >
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-semibold">{category}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-purple opacity-10" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">
            Ready to <span className="text-primary">Automate</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who've transformed their iPhone workflow
          </p>
          <button className="btn-primary text-lg px-12 py-5">
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-light py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Browse</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Creators</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Submit</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Earnings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="text-center text-muted-foreground pt-8 border-t border-card-light">
            <p>© 2025 TapTask. One tap to transform your workflow.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}