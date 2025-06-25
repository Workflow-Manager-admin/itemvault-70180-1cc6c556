"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../utils/api";
import { toast } from "react-toastify";

interface Item {
  id: number;
  title: string;
  description: string;
}

function ItemForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Partial<Item>;
  onSave: (data: { title: string; description: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");

  return (
    <form
      className="flex flex-col gap-2 border p-5 bg-white rounded-xl shadow transition-all max-w-lg"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, description });
      }}
    >
      <label className="font-medium text-sm mt-2 mb-0 text-primary" htmlFor="title">Title</label>
      <input
        id="title"
        className="border rounded px-3 py-2 focus:outline-primary bg-[var(--background)]"
        type="text"
        required
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <label className="font-medium text-sm mt-2 mb-0 text-primary" htmlFor="desc">Description</label>
      <textarea
        id="desc"
        className="border rounded px-3 py-2 focus:outline-primary bg-[var(--background)]"
        required
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="btn-primary"
        >
          Save
        </button>
        <button
          type="button"
          className="btn-secondary-light"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      <style jsx>{`
        .btn-primary {
          background: var(--primary);
          color: #fff;
          padding: 0.5rem 1.5rem;
          font-weight: 500;
          border-radius: 0.5rem;
          outline: none;
          border: none;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: #2564cf;
        }
        .btn-secondary-light {
          background: #e8eaed;
          color: #232323;
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        .btn-secondary-light:hover {
          background: #d3d6db;
        }
      `}</style>
    </form>
  );
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetchItems();
      setItems(res.data);
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } }; message?: string };
      toast.error("Error fetching items: " + (error?.response?.data?.detail || error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (data: { title: string; description: string }) => {
    try {
      await createItem(data);
      toast.success("Item created!");
      setCreating(false);
      fetchAll();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || "Could not create item.");
    }
  };

  const handleUpdate = async (id: number, data: { title: string; description: string }) => {
    try {
      await updateItem(id, data);
      toast.success("Item updated!");
      setEditingId(null);
      fetchAll();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || "Could not update item.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await deleteItem(id);
      toast.info("Item deleted.");
      fetchAll();
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || "Could not delete item.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full max-w-2xl mx-auto py-2">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-8 gap-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-primary">Your Items</h2>
          <button
            className="btn-primary flex-shrink-0 w-full xs:w-auto"
            onClick={() => setCreating(true)}
          >
            <span className="inline-block align-middle mr-1 text-xl leading-none font-bold">＋</span>New Item
          </button>
        </div>
        {creating && (
          <ItemForm
            onSave={handleCreate}
            onCancel={() => setCreating(false)}
          />
        )}
        {loading ? (
          <div className="mt-12 text-lg text-center text-foreground/80 animate-pulse font-medium">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="my-14 text-center text-foreground/60">No items found.<br/><span className="text-sm opacity-80">Click &ldquo;New Item&rdquo; to create one.</span></div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {items.map((item) =>
              editingId === item.id ? (
                <li key={item.id} className="col-span-full">
                  <ItemForm
                    initialData={item}
                    onSave={(data) => handleUpdate(item.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
                <li
                  key={item.id}
                  className="bg-white rounded-xl border shadow-sm p-4 flex flex-col items-start gap-2 hover:shadow-md transition-shadow relative group"
                  style={{ minHeight: 110 }}
                >
                  <div className="flex justify-between w-full gap-3">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground/90 mb-0">{item.title}</h3>
                      <p className="text-foreground/60 text-sm mt-0">{item.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        className="btn-accent"
                        title="Edit"
                        onClick={() => setEditingId(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary"
                        title="Delete item"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </div>
      <style jsx>{`
        .btn-primary {
          background: var(--primary);
          color: #fff;
          padding: 0.55rem 1.4rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          transition: background 0.18s;
        }
        .btn-primary:hover {
          background: #195fc1;
        }
        .btn-accent {
          background: var(--accent);
          color: #fff;
          padding: 0.3rem 1.1rem;
          border: none;
          border-radius: 0.4rem;
          font-weight: 500;
          transition: background 0.19s;
          font-size: 0.96rem;
        }
        .btn-accent:hover {
          background: #248345;
        }
        .btn-secondary {
          background: var(--secondary);
          color: #232323;
          padding: 0.3rem 0.9rem;
          border: none;
          border-radius: 0.4rem;
          font-weight: 500;
          transition: background 0.18s;
          font-size: 0.96rem;
        }
        .btn-secondary:hover {
          background: #f8be22;
          color: #181818;
        }
      `}</style>
    </ProtectedRoute>
  );
}
