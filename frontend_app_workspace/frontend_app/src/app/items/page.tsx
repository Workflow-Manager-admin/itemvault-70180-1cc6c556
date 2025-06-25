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
      className="flex flex-col gap-2 border p-4 bg-gray-50 rounded"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ title, description });
      }}
    >
      <input
        className="border px-2 py-1 rounded"
        type="text"
        required
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border px-2 py-1 rounded"
        required
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-primary text-white py-1 px-4 rounded hover:bg-opacity-90"
        >
          Save
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 py-1 px-4 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
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
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold mb-0">Your Items</h2>
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={() => setCreating(true)}
          >
            + New Item
          </button>
        </div>
        {creating && (
          <ItemForm
            onSave={handleCreate}
            onCancel={() => setCreating(false)}
          />
        )}
        {loading ? (
          <div>Loading items...</div>
        ) : items.length === 0 ? (
          <div>No items found.</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((item) =>
              editingId === item.id ? (
                <li key={item.id} className="border p-3 rounded bg-gray-50">
                  <ItemForm
                    initialData={item}
                    onSave={(data) => handleUpdate(item.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                </li>
              ) : (
                <li key={item.id} className="border p-3 rounded flex flex-col bg-white shadow">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-accent text-white px-2 py-1 rounded text-sm"
                        onClick={() => setEditingId(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-secondary text-white px-2 py-1 rounded text-sm"
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
    </ProtectedRoute>
  );
}
