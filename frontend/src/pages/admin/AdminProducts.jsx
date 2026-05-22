import { useState, useEffect, useRef, useMemo } from 'react';
import { Plus, Edit2, Trash2, Loader2, X, Upload, Link as LinkIcon, Search } from 'lucide-react';
import { apiClient, apiUpload } from '../../api/client';
import { formatPrice } from '../../utils/formatters';

const emptyForm = {
  name: '',
  category: '',
  price: '',
  original_price: '',
  description: '',
  sizes: '',
  image: '',
  in_stock: true,
  tags: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [galleryUrls, setGalleryUrls] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const primaryFileInputRef = useRef(null);

  const [existingGallery, setExistingGallery] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiClient('/products/');
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiClient('/categories/');
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setGalleryUrls([]);
    setNewUrl('');
    setNewFiles([]);
    setPrimaryImageFile(null);
    setExistingGallery([]);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      original_price: product.original_price || '',
      description: product.description || '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      image: product.image || product.primary_image_url || '',
      in_stock: product.in_stock ?? true,
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
    });
    setGalleryUrls([]);
    setNewUrl('');
    setNewFiles([]);
    setPrimaryImageFile(null);
    setExistingGallery(Array.isArray(product.gallery) ? product.gallery : []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addUrl = () => {
    const trimmed = newUrl.trim();
    if (trimmed && !galleryUrls.includes(trimmed)) {
      setGalleryUrls(prev => [...prev, trimmed]);
      setNewUrl('');
    }
  };

  const removeUrl = (url) => {
    setGalleryUrls(prev => prev.filter(u => u !== url));
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    setNewFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const buildFormData = (allGalleryUrls) => {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('category', form.category);
    fd.append('price', String(parseFloat(form.price)));
    if (form.original_price) fd.append('original_price', String(parseFloat(form.original_price)));
    fd.append('description', form.description);
    fd.append('in_stock', form.in_stock ? 'true' : 'false');
    if (form.image) fd.append('image', form.image);
    if (primaryImageFile) fd.append('image_upload', primaryImageFile);
    fd.append('sizes', JSON.stringify(form.sizes.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
    fd.append('gallery_image_urls', JSON.stringify(allGalleryUrls));
    newFiles.forEach(file => fd.append('gallery_files', file));
    return fd;
  };

  const formatApiError = (err) => {
    if (!err || typeof err !== 'object') return 'Error saving product.';
    const messages = Object.entries(err).flatMap(([key, val]) => {
      const label = Array.isArray(val) ? val.join(', ') : String(val);
      return [`${key}: ${label}`];
    });
    return messages.length ? messages.join('\n') : 'Error saving product.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price) {
      alert('Name, Category, and Price are required.');
      return;
    }

    setSaving(true);
    try {
      const hasUploads = Boolean(primaryImageFile) || newFiles.length > 0;
      const allGalleryUrls = [...existingGallery, ...galleryUrls];

      if (hasUploads) {
        const fd = buildFormData(allGalleryUrls);
        if (editing) {
          await apiUpload(`/products/${editing.id}/`, fd, { method: 'PUT' });
        } else {
          await apiUpload('/products/', fd);
        }
      } else {
        const body = {
          name: form.name,
          category: form.category,
          price: parseFloat(form.price),
          original_price: form.original_price ? parseFloat(form.original_price) : null,
          description: form.description,
          sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
          image: form.image || null,
          in_stock: form.in_stock,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        };
        if (allGalleryUrls.length > 0) {
          body.gallery_image_urls = allGalleryUrls;
        }

        if (editing) {
          await apiClient(`/products/${editing.id}/`, { method: 'PUT', body });
        } else {
          await apiClient('/products/', { method: 'POST', body });
        }
      }

      closeModal();
      await fetchProducts();
    } catch (err) {
      console.error("Failed to save product", err);
      alert(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiClient(`/products/${id}/`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      alert("Error deleting product");
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (categoryFilter) {
      filtered = filtered.filter(p =>
        (p.category_name?.toLowerCase() === categoryFilter.toLowerCase()) ||
        (p.category?.toLowerCase() === categoryFilter.toLowerCase())
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [products, searchQuery, categoryFilter]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E8879A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Products</h1>
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white border border-[#F0E0E5] text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40 transition-all"
          >
            <option value="">All Categories</option>
            {['men', 'women', 'kids'].map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#BCBCBC] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-56 pl-9 pr-4 py-2 rounded-xl bg-white border border-[#F0E0E5] text-sm text-[#1C1C1C] placeholder:text-[#BCBCBC] focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40 transition-all"
            />
          </div>
          <button
            onClick={openAdd}
            className="bg-[#E8879A] text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-[#D4687C] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#F5C6D0]/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#F5C6D0]/30 text-xs uppercase tracking-wider text-[#6B6B6B]">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5C6D0]/30">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {(product.image || product.primary_image_url) && (
                          <img src={product.image || product.primary_image_url} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-[#1C1C1C] truncate max-w-[160px] block">{product.name}</span>
                        {product.gallery && product.gallery.length > 1 && (
                          <div className="flex items-center gap-1 mt-1.5">
                            {product.gallery.slice(0, 4).map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt=""
                                className="w-5 h-5 rounded object-cover border border-[#F0E0E5]"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ))}
                            {product.gallery.length > 4 && (
                              <span className="text-[10px] text-[#6B6B6B] font-medium">+{product.gallery.length - 4}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#6B6B6B]">{product.category_name || product.category || '-'}</td>
                  <td className="p-4 text-sm text-[#1C1C1C] font-medium">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.in_stock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 text-[#6B6B6B] hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-[#6B6B6B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#6B6B6B]">
                    {searchQuery ? `No products matching "${searchQuery}".` : 'No products found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[#F5C6D0]/30">
              <h2 className="text-lg font-bold text-[#1C1C1C]">
                {editing ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Category *</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    name="original_price"
                    value={form.original_price}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    value={form.sizes}
                    onChange={handleChange}
                    placeholder="e.g. 36, 37, 38, 39"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. trending, new"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-1">Primary Image</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="CDN / external image URL (optional)"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                    />
                    <button
                      type="button"
                      onClick={() => primaryFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-[#FDE8EE] text-[#E8879A] text-sm font-medium hover:bg-[#F5C6D0] transition-colors flex items-center gap-1 whitespace-nowrap"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                    <input
                      ref={primaryFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => setPrimaryImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </div>
                  {(form.image || primaryImageFile) && (
                    <div className="flex items-center gap-2">
                      {primaryImageFile ? (
                        <img
                          src={URL.createObjectURL(primaryImageFile)}
                          alt="Primary preview"
                          className="w-16 h-16 rounded-lg object-cover border border-[#F0E0E5]"
                        />
                      ) : form.image ? (
                        <img src={form.image} alt="Primary" className="w-16 h-16 rounded-lg object-cover border border-[#F0E0E5]" />
                      ) : null}
                      {primaryImageFile && (
                        <button
                          type="button"
                          onClick={() => setPrimaryImageFile(null)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Remove upload
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images Section */}
              <div className="col-span-2 pt-2 border-t border-[#F5C6D0]/30">
                <label className="block text-sm font-medium text-[#1C1C1C] mb-2">Gallery Images</label>

                {/* Existing gallery from product */}
                {existingGallery.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {existingGallery.map((url, i) => (
                      <div key={`existing-${i}`} className="relative group">
                        <img
                          src={url}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover border border-[#F0E0E5]"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setExistingGallery(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New URLs */}
                {galleryUrls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {galleryUrls.map((url, i) => (
                      <div key={`url-${i}`} className="relative group">
                        <img src={url} alt="" className="w-16 h-16 rounded-lg object-cover border border-[#F0E0E5]" onError={(e) => { e.target.style.display = 'none'; }} />
                        <span className="absolute bottom-0 left-0 right-0 text-[8px] bg-black/60 text-white truncate px-1 rounded-b-lg">URL</span>
                        <button
                          type="button"
                          onClick={() => removeUrl(url)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New file uploads */}
                {newFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {newFiles.map((file, i) => (
                      <div key={`file-${i}`} className="relative group">
                        <div className="w-16 h-16 rounded-lg border border-[#F0E0E5] flex items-center justify-center bg-gray-50 text-[8px] text-[#6B6B6B] text-center p-1 overflow-hidden">
                          {file.name}
                        </div>
                        <span className="absolute bottom-0 left-0 right-0 text-[8px] bg-black/60 text-white truncate px-1 rounded-b-lg">File</span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add image controls */}
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Image URL..."
                      className="flex-1 px-4 py-2 rounded-xl border border-[#E0D0D5] text-sm focus:outline-none focus:ring-2 focus:ring-[#E8879A]/40"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
                    />
                    <button
                      type="button"
                      onClick={addUrl}
                      className="px-3 py-2 rounded-xl border border-[#E0D0D5] text-sm text-[#6B6B6B] hover:bg-gray-50 transition-colors flex items-center gap-1"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Add URL
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-[#FDE8EE] text-[#E8879A] text-sm font-medium hover:bg-[#F5C6D0] transition-colors flex items-center gap-1"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFilesSelected}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="in_stock"
                  name="in_stock"
                  checked={form.in_stock}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-[#E8879A]"
                />
                <label htmlFor="in_stock" className="text-sm font-medium text-[#1C1C1C]">In Stock</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-xl border border-[#E0D0D5] text-sm font-medium text-[#6B6B6B] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#E8879A] text-white text-sm font-medium hover:bg-[#D4687C] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
