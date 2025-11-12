import { useState } from 'react';
import { trpc } from '../lib/trpc';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Edit, Save } from 'lucide-react';

export default function AdminDashboard() {
  const [editingShortcut, setEditingShortcut] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: shortcuts, isLoading, refetch } = trpc.admin.allShortcuts.useQuery();
  
  const { data: shortcutToEdit } = trpc.admin.getShortcutById.useQuery(
    { id: editingShortcut! },
    { enabled: editingShortcut !== null }
  );

  const updateMutation = trpc.admin.updateShortcut.useMutation({
    onSuccess: () => {
      refetch();
      setIsDialogOpen(false);
      setEditingShortcut(null);
    },
  });

  const handleEdit = (id: number) => {
    setEditingShortcut(id);
    setIsDialogOpen(true);
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingShortcut || !shortcutToEdit) return;

    const formData = new FormData(e.currentTarget);
    const updates: any = {
      id: editingShortcut,
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      tags: (formData.get('tags') as string) || null,
      price: parseInt(formData.get('price') as string),
      iCloudLink: formData.get('iCloudLink') as string,
      purchaseLink: (formData.get('purchaseLink') as string) || null,
      previewImage: (formData.get('previewImage') as string) || null,
      previewMedia: (formData.get('previewMedia') as string) || null,
      creatorName: formData.get('creatorName') as string,
      creatorAvatar: (formData.get('creatorAvatar') as string) || null,
      status: formData.get('status') as 'pending' | 'approved' | 'rejected',
      featured: formData.has('featured') ? 1 : 0,
      trending: formData.has('trending') ? 1 : 0,
      requiredIOSVersion: (formData.get('requiredIOSVersion') as string) || null,
    };

    updateMutation.mutate(updates);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/40';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading shortcuts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage shortcuts and edit their details</p>
        </div>

        <div className="card-electric">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-card-light">
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Price</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Featured</th>
                  <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shortcuts?.map((shortcut) => (
                  <tr key={shortcut.id} className="border-b border-card-light hover:bg-card-light/50 transition-colors">
                    <td className="p-4">{shortcut.id}</td>
                    <td className="p-4">
                      <div className="font-medium">{shortcut.title}</div>
                      <div className="text-sm text-muted-foreground">{shortcut.slug}</div>
                    </td>
                    <td className="p-4">{shortcut.category}</td>
                    <td className="p-4">
                      ${(shortcut.price / 100).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(shortcut.status)}`}>
                        {shortcut.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {shortcut.featured === 1 ? (
                        <span className="badge-purple">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(shortcut.id)}
                        className="btn-secondary px-4 py-2 text-sm flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border-2 border-card-light rounded-lg shadow-glow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto z-50 p-6">
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-2xl font-bold">Edit Shortcut</Dialog.Title>
                <Dialog.Close className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-6 h-6" />
                </Dialog.Close>
              </div>

              {shortcutToEdit && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={shortcutToEdit.title}
                        className="input-electric w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Slug</label>
                      <input
                        type="text"
                        name="slug"
                        defaultValue={shortcutToEdit.slug}
                        className="input-electric w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={shortcutToEdit.description}
                      className="input-electric w-full min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <input
                        type="text"
                        name="category"
                        defaultValue={shortcutToEdit.category}
                        className="input-electric w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (in cents)</label>
                      <input
                        type="number"
                        name="price"
                        defaultValue={shortcutToEdit.price}
                        className="input-electric w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">iCloud Link</label>
                    <input
                      type="url"
                      name="iCloudLink"
                      defaultValue={shortcutToEdit.iCloudLink}
                      className="input-electric w-full"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">The direct iCloud Shortcuts link</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Link (optional)</label>
                    <input
                      type="url"
                      name="purchaseLink"
                      defaultValue={shortcutToEdit.purchaseLink || ''}
                      className="input-electric w-full"
                      placeholder="https://gumroad.com/l/..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">External purchase link (Gumroad, Lemon Squeezy, etc.)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Creator Name</label>
                      <input
                        type="text"
                        name="creatorName"
                        defaultValue={shortcutToEdit.creatorName}
                        className="input-electric w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        name="status"
                        defaultValue={shortcutToEdit.status}
                        className="input-electric w-full"
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview Image URL</label>
                      <input
                        type="url"
                        name="previewImage"
                        defaultValue={shortcutToEdit.previewImage || ''}
                        className="input-electric w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview Media URL</label>
                      <input
                        type="url"
                        name="previewMedia"
                        defaultValue={shortcutToEdit.previewMedia || ''}
                        className="input-electric w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Creator Avatar URL</label>
                      <input
                        type="url"
                        name="creatorAvatar"
                        defaultValue={shortcutToEdit.creatorAvatar || ''}
                        className="input-electric w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Required iOS Version</label>
                      <input
                        type="text"
                        name="requiredIOSVersion"
                        defaultValue={shortcutToEdit.requiredIOSVersion || ''}
                        className="input-electric w-full"
                        placeholder="iOS 15.0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={shortcutToEdit.tags || ''}
                      className="input-electric w-full"
                      placeholder="productivity, automation, workflow"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="featured"
                          value="1"
                          defaultChecked={shortcutToEdit.featured === 1}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Featured</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="trending"
                          value="1"
                          defaultChecked={shortcutToEdit.trending === 1}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Trending</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-card-light">
                    <Dialog.Close className="btn-secondary px-6 py-2">
                      Cancel
                    </Dialog.Close>
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
