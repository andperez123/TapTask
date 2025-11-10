import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { Link, useLocation } from 'wouter';

export default function Browse() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const categoryFromUrl = urlParams.get('category') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update category when URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);
  
  const { data: shortcuts, isLoading } = trpc.shortcuts.list.useQuery({
    category: selectedCategory || undefined,
  });

  const categories = [
    { name: 'All', value: '' },
    { name: 'Productivity', value: 'Productivity', icon: '⚡' },
    { name: 'Social Media', value: 'Social Media', icon: '📱' },
    { name: 'Health & Fitness', value: 'Health & Fitness', icon: '💪' },
    { name: 'Finance', value: 'Finance', icon: '💰' },
    { name: 'Entertainment', value: 'Entertainment', icon: '🎮' },
    { name: 'Utilities', value: 'Utilities', icon: '🔧' },
    { name: 'Other', value: 'Other', icon: '📦' },
  ];

  // Filter shortcuts by search query
  const filteredShortcuts = shortcuts?.filter(shortcut => {
    const matchesSearch = searchQuery === '' || 
      shortcut.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.tags?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-card/30 to-transparent">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Browse <span className="text-primary">Shortcuts</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Discover powerful iOS automations to transform your workflow
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search shortcuts by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-12 bg-card border border-card-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-4 border-b border-card-light sticky top-[73px] bg-background/95 backdrop-blur-lg z-40">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.value
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-card hover:bg-card-light text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.icon && <span>{category.icon}</span>}
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {selectedCategory ? `${selectedCategory} Shortcuts` : 'All Shortcuts'}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? 'Loading...' : `${filteredShortcuts.length} shortcut${filteredShortcuts.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
            
            {/* Sort Options (Future Enhancement) */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="px-3 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option>Most Popular</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card-electric animate-pulse">
                  <div className="h-12 w-12 bg-card-light rounded-lg mb-4" />
                  <div className="h-6 bg-card-light rounded mb-2" />
                  <div className="h-4 bg-card-light rounded w-3/4 mb-4" />
                  <div className="h-4 bg-card-light rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredShortcuts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No shortcuts found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'No shortcuts available in this category yet.'}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Shortcuts Grid */}
          {!isLoading && filteredShortcuts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredShortcuts.map((shortcut) => (
                <Link key={shortcut.id} href={`/shortcut/${shortcut.slug}`}>
                  <div className="card-electric cursor-pointer group h-full flex flex-col">
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
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                      {shortcut.description}
                    </p>

                    {/* Tags */}
                    {shortcut.tags && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {shortcut.tags.split(',').slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-card-light rounded text-muted-foreground">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="badge-purple text-xs">
                          {shortcut.category}
                        </span>
                        {shortcut.featured === 1 && (
                          <span className="text-xs">⭐</span>
                        )}
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {shortcut.price === 0 ? 'FREE' : `$${(shortcut.price / 100).toFixed(2)}`}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-card-light text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>{shortcut.downloads || 0}</span>
                      </div>
                      {shortcut.requiredIOSVersion && (
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>{shortcut.requiredIOSVersion}</span>
                        </div>
                      )}
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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-card/30 border-t border-card-light">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You Need?
          </h2>
          <p className="text-muted-foreground mb-6">
            Create and share your own iOS shortcuts with the community
          </p>
          <Link href="/creator">
            <button className="btn-primary text-lg px-8 py-3">
              Become a Creator
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

