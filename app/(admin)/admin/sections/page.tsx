"use client";

import { useEffect, useState } from "react";
import EnhancedSectionEditor from "@/components/admin/EnhancedSectionEditor";
import DraggableSectionRow from "@/components/admin/DraggableSectionRow";
import { Eye, EyeOff, Trash2, Edit, Loader2, Plus, ArrowUp, ArrowDown, RefreshCw, Eye as EyeIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Section {
  id: string;
  name: string;
  type: string;
  section_type?: string;
  order: number;
  is_active: boolean;
  is_draggable?: boolean;
  is_editable?: boolean;
  section_content?: any[];
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [orderValues, setOrderValues] = useState<Record<string, number>>({});
  const [reordering, setReordering] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newSection, setNewSection] = useState({
    name: "",
    type: "text",
    order: 0,
  });
  const [sectionStats, setSectionStats] = useState<Record<string, { videos: number; images: number }>>({});
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<"youtube" | "content_blocks">("youtube");
  const { showToast, ToastComponent } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");
      console.log("🔍 Fetching sections from:", `${apiUrl}/api/sections`);
      
      const [sectionsRes, videosRes, imagesRes] = await Promise.all([
        fetch(`${apiUrl}/api/sections`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }),
        fetch(`${apiUrl}/api/videos`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }).catch(() => ({ ok: false, json: async () => [] })),
        fetch(`${apiUrl}/api/images`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }).catch(() => ({ ok: false, json: async () => [] })),
      ]);

      if (!sectionsRes.ok) {
        const errorText = await sectionsRes.text();
        throw new Error(`Failed to fetch sections: ${sectionsRes.status} ${sectionsRes.statusText}. ${errorText}`);
      }

      const sectionsData = await sectionsRes.json();
      const videosData = videosRes.ok ? await videosRes.json() : [];
      const imagesData = imagesRes.ok ? await imagesRes.json() : [];

      console.log("✅ Sections fetched:", sectionsData);
      const sortedSections = (sectionsData || []).sort((a: Section, b: Section) => (a.order || 0) - (b.order || 0));
      setSections(sortedSections);
      
      // Calculate stats for each section
      const stats: Record<string, { videos: number; images: number }> = {};
      sortedSections.forEach((section: Section) => {
        stats[section.id] = {
          videos: videosData.filter((v: any) => v.section_id === section.id).length,
          images: imagesData.filter((i: any) => i.section_id === section.id).length,
        };
      });
      setSectionStats(stats);
      
      // Initialize order values
      const initialOrderValues: Record<string, number> = {};
      sortedSections.forEach((section: Section) => {
        initialOrderValues[section.id] = section.order || 0;
      });
      setOrderValues(initialOrderValues);
    } catch (error: any) {
      console.error("❌ Error fetching sections:", error);
      // Show user-friendly error message
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        console.error("💡 Backend might not be running. Make sure NestJS backend is running on port 3001.");
      }
      setSections([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: Section) => {
    fetchSectionDetails(section.id);
  };

  const fetchSectionDetails = async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      console.log("🔍 Fetching section details:", `${apiUrl}/api/sections/${id}`);
      
      const response = await fetch(`${apiUrl}/api/sections/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch section details: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Section details fetched:", data);
      console.log("📝 Section content:", data.section_content);
      console.log("📝 Section content length:", data.section_content?.length || 0);
      
      // Ensure section_content is an array
      if (data && !data.section_content) {
        console.warn("⚠️ Section has no section_content property, setting to empty array");
        data.section_content = [];
      }
      
      setSelectedSection(data);
    } catch (error: any) {
      console.error("❌ Error fetching section details:", error);
      alert(`Failed to load section details: ${error.message || "Unknown error"}`);
    }
  };

  const handleToggleActive = async (section: Section) => {
    if (toggling) return;
    
    setToggling(section.id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}/api/sections/${section.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_active: !section.is_active,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to update section");
      }

      showToast(
        `Section ${!section.is_active ? "shown" : "hidden"} successfully`,
        "success"
      );
      fetchSections();
    } catch (error: any) {
      console.error("Error toggling section:", error);
      showToast(error.message || "Failed to update section", "error");
    } finally {
      setToggling(null);
    }
  };

  const handleCreate = async () => {
    if (!newSection.name.trim()) {
      showToast("Section name is required", "error");
      return;
    }

    setCreating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Get max order to set new section order (use sorted sections to get correct max)
      const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
      const maxOrder = sortedSections.length > 0 
        ? Math.max(...sortedSections.map(s => s.order || 0)) 
        : 0;

      // Only allow creating YouTube sections
      const sectionType = newSection.type === 'youtube' ? 'youtube' : 'youtube';
      
      const response = await fetch(`${apiUrl}/api/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newSection.name.trim(),
          type: 'youtube', // Always create as youtube type
          section_type: 'youtube', // Set section_type
          order: maxOrder + 1, // Always use max + 1 for new sections
          is_active: true,
          is_draggable: true,
          is_editable: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to create section");
      }

      showToast("Section created successfully", "success");
      setNewSection({ name: "", type: "text", order: 0 });
      setShowAddForm(false);
      // Refresh sections to show new order
      await fetchSections();
    } catch (error: any) {
      console.error("Error creating section:", error);
      showToast(error.message || "Failed to create section", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateOrder = async (section: Section, newOrder: number) => {
    if (updatingOrder === section.id) return;
    
    setUpdatingOrder(section.id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}/api/sections/${section.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order: newOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to update order");
      }

      showToast("Order updated successfully", "success");
      fetchSections();
    } catch (error: any) {
      console.error("Error updating order:", error);
      showToast(error.message || "Failed to update order", "error");
      // Revert order value on error
      setOrderValues({ ...orderValues, [section.id]: section.order });
    } finally {
      setUpdatingOrder(null);
      setEditingOrder(null);
    }
  };

  const handleOrderChange = (section: Section, value: string) => {
    const numValue = parseInt(value) || 0;
    setOrderValues({ ...orderValues, [section.id]: numValue });
  };

  const handleOrderBlur = (section: Section) => {
    const newOrder = orderValues[section.id] ?? section.order;
    if (newOrder !== section.order) {
      handleUpdateOrder(section, newOrder);
    } else {
      setEditingOrder(null);
    }
  };

  const handleOrderKeyDown = (e: React.KeyboardEvent, section: Section) => {
    if (e.key === "Enter") {
      handleOrderBlur(section);
    } else if (e.key === "Escape") {
      setOrderValues({ ...orderValues, [section.id]: section.order });
      setEditingOrder(null);
    }
  };

  const handleMoveUp = async (section: Section) => {
    const currentIndex = sections.findIndex(s => s.id === section.id);
    if (currentIndex <= 0 || updatingOrder) return;
    
    const prevSection = sections[currentIndex - 1];
    const newOrder = prevSection.order;
    const prevNewOrder = section.order;
    
    setUpdatingOrder(section.id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update both sections in parallel
      const [response1, response2] = await Promise.all([
        fetch(`${apiUrl}/api/sections/${section.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: newOrder }),
        }),
        fetch(`${apiUrl}/api/sections/${prevSection.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: prevNewOrder }),
        }),
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error("Failed to update order");
      }

      showToast("Order updated successfully", "success");
      fetchSections();
    } catch (error: any) {
      console.error("Error moving section:", error);
      showToast(error.message || "Failed to update order", "error");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Only allow dragging YouTube sections
    const activeSection = sections.find((s) => s.id === active.id);
    const overSection = sections.find((s) => s.id === over.id);
    
    if (!activeSection || !overSection) {
      return;
    }

    // Check if both sections are draggable (YouTube sections)
    if (!activeSection.is_draggable || !overSection.is_draggable) {
      return;
    }

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update UI
    const newSections = arrayMove(sections, oldIndex, newIndex);
    setSections(newSections);

    // Update orders in database
    setUpdatingOrder(active.id as string);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update all affected sections with new orders
      const updatePromises = newSections.map((section, index) =>
        fetch(`${apiUrl}/api/sections/${section.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order: index + 1,
          }),
        })
      );

      const responses = await Promise.all(updatePromises);
      const allOk = responses.every((r) => r.ok);

      if (!allOk) {
        throw new Error("Failed to update some sections");
      }

      showToast("Sections reordered successfully", "success");
      fetchSections(); // Refresh to get updated data
    } catch (error: any) {
      console.error("Error reordering sections:", error);
      showToast(error.message || "Failed to reorder sections", "error");
      fetchSections(); // Revert on error
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleReorderAll = async () => {
    if (reordering) return;
    
    const confirmed = window.confirm(
      "คุณต้องการจัดเรียง order ใหม่ทั้งหมดให้ต่อเนื่องกัน (1, 2, 3, 4, ...) หรือไม่?"
    );
    
    if (!confirmed) return;
    
    setReordering(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Sort sections by current order
      const sortedSections = [...sections].sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Update all sections with sequential order (1, 2, 3, ...)
      const updatePromises = sortedSections.map((section, index) => 
        fetch(`${apiUrl}/api/sections/${section.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order: index + 1, // Start from 1
          }),
        })
      );

      const responses = await Promise.all(updatePromises);
      const allOk = responses.every(r => r.ok);
      
      if (!allOk) {
        throw new Error("Failed to reorder some sections");
      }

      showToast("Order reordered successfully (1, 2, 3, ...)", "success");
      fetchSections();
    } catch (error: any) {
      console.error("Error reordering sections:", error);
      showToast(error.message || "Failed to reorder sections", "error");
    } finally {
      setReordering(false);
    }
  };

  const handleMoveDown = async (section: Section) => {
    const currentIndex = sections.findIndex(s => s.id === section.id);
    if (currentIndex >= sections.length - 1 || updatingOrder) return;
    
    const nextSection = sections[currentIndex + 1];
    const newOrder = nextSection.order;
    const nextNewOrder = section.order;
    
    setUpdatingOrder(section.id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update both sections in parallel
      const [response1, response2] = await Promise.all([
        fetch(`${apiUrl}/api/sections/${section.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: newOrder }),
        }),
        fetch(`${apiUrl}/api/sections/${nextSection.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: nextNewOrder }),
        }),
      ]);

      if (!response1.ok || !response2.ok) {
        throw new Error("Failed to update order");
      }

      showToast("Order updated successfully", "success");
      fetchSections();
    } catch (error: any) {
      console.error("Error moving section:", error);
      showToast(error.message || "Failed to update order", "error");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleDelete = async (section: Section) => {
    if (deleting) return;
    
    // Prevent deletion of Content Blocks
    if (section.section_type === 'content_block') {
      showToast("Content Blocks cannot be deleted. They are fixed sections.", "error");
      return;
    }

    // Prevent deletion of Fixed Sections, Hero, and Footer
    if (section.section_type === 'fixed' || section.section_type === 'hero' || section.section_type === 'footer') {
      showToast("This section type cannot be deleted.", "error");
      return;
    }
    
    const confirmed = window.confirm(
      `Are you sure you want to delete "${section.name}"?\n\nThis will permanently delete the section and all its content. This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(section.id);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiUrl}/api/sections/${section.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || "Failed to delete section");
      }

      showToast("Section deleted successfully", "success");
      fetchSections();
    } catch (error: any) {
      console.error("Error deleting section:", error);
      showToast(error.message || "Failed to delete section", "error");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading sections...</p>
        </div>
      </div>
    );
  }

  if (selectedSection) {
    return (
      <EnhancedSectionEditor
        section={selectedSection}
        onBack={() => setSelectedSection(null)}
        onSave={fetchSections}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sections Management
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            title="Toggle preview"
          >
            <EyeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{showPreview ? "Hide" : "Show"} Preview</span>
          </button>
          {activeTab === "youtube" && (
            <>
              <button
                onClick={handleReorderAll}
                disabled={reordering}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="จัดเรียง order ใหม่ทั้งหมดให้ต่อเนื่องกัน (1, 2, 3, ...)"
              >
                {reordering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">Reorder All</span>
              </button>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Add YouTube Section
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("youtube")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "youtube"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            YouTube Sections
            <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {sections.filter((s) => s.section_type === 'youtube' || (s.type === 'youtube' && !s.section_type)).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("content_blocks")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "content_blocks"
                ? "border-primary-500 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Content Blocks
            <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {sections.filter((s) => s.section_type === 'content_block').length}
            </span>
          </button>
        </nav>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Preview: Section Order ({activeTab === "youtube" ? "YouTube Sections" : "Content Blocks"})
          </h2>
          <div className="space-y-2">
            {sections
              .filter((s) => {
                if (activeTab === "youtube") {
                  return s.is_active && (s.section_type === 'youtube' || (s.type === 'youtube' && !s.section_type));
                } else {
                  return s.is_active && s.section_type === 'content_block';
                }
              })
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {section.order}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {section.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {section.section_type || section.type} • {sectionStats[section.id]?.videos || 0} videos • {sectionStats[section.id]?.images || 0} images
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {section.is_active ? (
                      <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            {sections.filter((s) => {
              if (activeTab === "youtube") {
                return s.is_active && (s.section_type === 'youtube' || (s.type === 'youtube' && !s.section_type));
              } else {
                return s.is_active && s.section_type === 'content_block';
              }
            }).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No {activeTab === "youtube" ? "YouTube" : "Content Block"} sections
              </p>
            )}
          </div>
        </div>
      )}

      {showAddForm && activeTab === "youtube" && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Create New YouTube Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Section Name
              </label>
              <input
                type="text"
                value={newSection.name}
                onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                placeholder="e.g., Product Demo, Tutorial, etc."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> This will create a YouTube section that can be reordered and edited. 
                You can add YouTube videos, images, title, and description to this section.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreate}
                disabled={creating || !newSection.name.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "Creating..." : "Create YouTube Section"}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewSection({ name: "", type: "youtube", order: 0 });
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "content_blocks" && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Content Blocks:</strong> These are fixed sections that can be edited but cannot be created or deleted. 
            The 5 content blocks are: Use Cases, Social Proof, Pricing, Feature Comparison, and Upgrade Your Plan.
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12">
                  Drag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {(() => {
                // Filter sections based on active tab
                const filteredSections = sections.filter((s) => {
                  if (activeTab === "youtube") {
                    return s.section_type === 'youtube' || (s.type === 'youtube' && !s.section_type);
                  } else {
                    return s.section_type === 'content_block';
                  }
                });

                if (filteredSections.length === 0) {
                  return (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-gray-500 dark:text-gray-400">
                            No {activeTab === "youtube" ? "YouTube" : "Content Block"} sections found
                          </p>
                          {activeTab === "youtube" && (
                            <p className="text-sm text-gray-400 dark:text-gray-500">
                              Click "Add YouTube Section" to create one
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }

                // Only enable drag-and-drop for YouTube sections
                const draggableSections = activeTab === "youtube" 
                  ? filteredSections.filter((s) => s.is_draggable !== false)
                  : [];

                return (
                  <SortableContext
                    items={draggableSections.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredSections.map((section) => (
                      <DraggableSectionRow
                        key={section.id}
                        section={section}
                        onEdit={handleEdit}
                        onToggleActive={handleToggleActive}
                        onDelete={handleDelete}
                        toggling={toggling}
                        deleting={deleting}
                        videosCount={sectionStats[section.id]?.videos || 0}
                        imagesCount={sectionStats[section.id]?.images || 0}
                      />
                    ))}
                  </SortableContext>
                );
              })()}
            </tbody>
          </table>
        </DndContext>
      </div>
      {ToastComponent}
    </div>
  );
}

