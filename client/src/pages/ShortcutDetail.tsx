import { useRoute } from 'wouter';
import { trpc } from '../lib/trpc';
import { useState } from 'react';

export default function ShortcutDetail() {
  const [, params] = useRoute('/shortcut/:slug');
  const slug = params?.slug || '';
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const { data: shortcut, isLoading } = trpc.shortcuts.getBySlug.useQuery({ slug });

  const checkoutMutation = trpc.payment.createCheckoutSession.useMutation();

  const handleDownloadFree = () => {
    if (shortcut?.iCloudLink) {
      // Open iCloud link directly - iOS will prompt to add shortcut
      window.open(shortcut.iCloudLink, '_blank');
      
      // Show success message
      alert('🎉 Shortcut link opened! Tap "Add Shortcut" in the Shortcuts app to install.');
    }
  };

  const handlePurchase = async () => {
    // If free, just download
    if (shortcut.price === 0) {
      handleDownloadFree();
      return;
    }

    // Otherwise, go through Stripe checkout
    setIsPurchasing(true);
    try {
      const result = await checkoutMutation.mutateAsync({
        shortcutId: shortcut.id,
      });
      
      if (result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading shortcut...</p>
        </div>
      </div>
    );
  }

  if (!shortcut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-4">Shortcut Not Found</h1>
          <p className="text-muted-foreground mb-8">This shortcut doesn't exist or has been removed.</p>
          <a href="/" className="btn-primary">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <a href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse
        </a>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 px-4">
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-30 blur-3xl" />
        
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Preview */}
            <div>
              <div className="card-electric p-12 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 mb-6 rounded-2xl bg-primary/20 text-primary">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="badge-purple mb-4">
                  {shortcut.category}
                </div>
                {shortcut.featured === 1 && (
                  <div className="inline-block px-3 py-1 rounded-full bg-accent-success/20 text-accent-success text-sm font-medium mb-4 ml-2">
                    ⭐ Featured
                  </div>
                )}
              </div>
            </div>

            {/* Right: Details */}
            <div>
              <h1 className="text-5xl font-bold mb-4">
                {shortcut.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm">👤</span>
                  </div>
                  <span className="text-muted-foreground">
                    by <span className="text-foreground font-medium">{shortcut.creatorName}</span>
                  </span>
                </div>
              </div>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {shortcut.description}
              </p>

              {/* Stats */}
              <div className="flex gap-6 mb-8">
                <div>
                  <div className="text-2xl font-bold text-primary">{shortcut.downloads || 0}</div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{shortcut.purchases || 0}</div>
                  <div className="text-sm text-muted-foreground">Purchases</div>
                </div>
                {shortcut.requiredIOSVersion && (
                  <div>
                    <div className="text-2xl font-bold text-primary">iOS {shortcut.requiredIOSVersion}+</div>
                    <div className="text-sm text-muted-foreground">Required</div>
                  </div>
                )}
              </div>

              {/* Price & CTA */}
              <div className="card-electric p-6 bg-card-light">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="text-4xl font-bold text-primary">
                      ${(shortcut.price / 100).toFixed(2)}
                    </div>
                  </div>
                  {shortcut.price === 0 && (
                    <div className="badge-purple">FREE</div>
                  )}
                </div>
                
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPurchasing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : shortcut.price === 0 ? (
                    '⬇️ Download Free Shortcut'
                  ) : (
                    '💳 Buy Now with Apple Pay'
                  )}
                </button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Instant download • Secure checkout • 30-day refund
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">What's <span className="text-primary">Included</span></h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-electric">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Instant Setup</h3>
              <p className="text-muted-foreground">One tap to install. Works immediately on your iPhone.</p>
            </div>
            
            <div className="card-electric">
              <div className="text-3xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-2">Free Updates</h3>
              <p className="text-muted-foreground">Get all future improvements and bug fixes at no cost.</p>
            </div>
            
            <div className="card-electric">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Creator Support</h3>
              <p className="text-muted-foreground">Direct help from the creator if you need assistance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How to <span className="text-primary">Get Started</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Purchase</h3>
              <p className="text-muted-foreground">Secure checkout with Apple Pay or card</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Download</h3>
              <p className="text-muted-foreground">Get instant iCloud link to your shortcut</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Automate</h3>
              <p className="text-muted-foreground">Start using your new automation immediately</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}