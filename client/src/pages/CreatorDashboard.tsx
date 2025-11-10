import { useState } from 'react';
import { trpc } from '../lib/trpc';

export default function CreatorDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Productivity',
    price: 0,
    iCloudLink: '',
    creatorName: '',
    creatorEmail: '',
    previewImage: '',
    requiredIOSVersion: 'iOS 16+',
  });

  const [submitted, setSubmitted] = useState(false);

  const submitShortcut = trpc.creator.submitShortcut.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'Productivity',
        price: 0,
        iCloudLink: '',
        creatorName: '',
        creatorEmail: '',
        previewImage: '',
        requiredIOSVersion: 'iOS 16+',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty optional fields
    const submitData: any = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      iCloudLink: formData.iCloudLink,
      creatorName: formData.creatorName,
    };
    
    // Only include optional fields if they have values
    if (formData.creatorEmail) submitData.creatorEmail = formData.creatorEmail;
    if (formData.previewImage) submitData.previewImage = formData.previewImage;
    if (formData.requiredIOSVersion) submitData.requiredIOSVersion = formData.requiredIOSVersion;
    
    submitShortcut.mutate(submitData);
  };

  const categories = [
    'Productivity',
    'Social Media',
    'Health & Fitness',
    'Finance',
    'Entertainment',
    'Utilities',
    'Other',
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Submit Your Shortcut</h1>
        <p className="text-muted-foreground">
          Share your iOS Shortcut with the community. Start with free shortcuts to build your reputation!
        </p>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-500 font-medium">
            ✓ Shortcut submitted successfully! We'll review it and publish it soon.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Shortcut Title *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Daily Weather Report"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description *
          </label>
          <textarea
            required
            rows={6}
            className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe what your shortcut does, how it works, and what makes it useful..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Be detailed! Users want to know exactly what they're getting.
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category *
          </label>
          <select
            required
            className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* iCloud Link */}
        <div>
          <label className="block text-sm font-medium mb-2">
            iCloud Shortcut Link *
          </label>
          <input
            type="url"
            required
            className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://www.icloud.com/shortcuts/..."
            value={formData.iCloudLink}
            onChange={(e) => setFormData({ ...formData, iCloudLink: e.target.value })}
          />
          <p className="text-sm text-muted-foreground mt-1">
            Create your shortcut in the Shortcuts app, tap Share → Copy iCloud Link
          </p>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Price (USD)
          </label>
          <div className="flex items-center gap-2">
            <span className="text-2xl">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-32 px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            💡 Start with <strong>$0 (free)</strong> to build trust and get downloads!
          </p>
        </div>

        {/* Creator Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
              value={formData.creatorName}
              onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Email (optional)
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
              value={formData.creatorEmail}
              onChange={(e) => setFormData({ ...formData, creatorEmail: e.target.value })}
            />
          </div>
        </div>

        {/* Preview Image */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Preview Image URL (optional)
          </label>
          <input
            type="url"
            className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://example.com/image.png"
            value={formData.previewImage}
            onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })}
          />
        </div>

        {/* iOS Version */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Required iOS Version
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-card border border-card-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="iOS 16+"
            value={formData.requiredIOSVersion}
            onChange={(e) => setFormData({ ...formData, requiredIOSVersion: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitShortcut.isLoading}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitShortcut.isLoading ? 'Submitting...' : 'Submit Shortcut for Review'}
          </button>
          {submitShortcut.error && (
            <p className="text-red-500 text-sm mt-2">
              Error: {submitShortcut.error.message}
            </p>
          )}
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-card border border-card-light rounded-lg">
        <h3 className="font-semibold mb-3">📋 Submission Guidelines</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Your shortcut will be reviewed before appearing on the marketplace</li>
          <li>• Make sure your iCloud link is publicly accessible</li>
          <li>• Provide a clear, detailed description</li>
          <li>• Start with free shortcuts to build your reputation</li>
          <li>• Once approved, users can download via the iCloud link</li>
        </ul>
      </div>
    </div>
  );
}




