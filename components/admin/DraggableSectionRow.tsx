"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, Trash2, Edit, Loader2, GripVertical } from "lucide-react";

interface Section {
  id: string;
  name: string;
  type: string;
  section_type?: string;
  order: number;
  is_active: boolean;
  is_draggable?: boolean;
  is_editable?: boolean;
}

interface DraggableSectionRowProps {
  section: Section;
  onEdit: (section: Section) => void;
  onToggleActive: (section: Section) => void;
  onDelete: (section: Section) => void;
  toggling: string | null;
  deleting: string | null;
  videosCount?: number;
  imagesCount?: number;
  forceDraggable?: boolean; // Force enable dragging even if is_draggable is false
}

export default function DraggableSectionRow({
  section,
  onEdit,
  onToggleActive,
  onDelete,
  toggling,
  deleting,
  videosCount = 0,
  imagesCount = 0,
  forceDraggable = false,
}: DraggableSectionRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 ${
        isDragging ? "shadow-lg z-50" : ""
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        {(forceDraggable || section.is_draggable !== false) ? (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        ) : (
          <div className="text-gray-300 dark:text-gray-600">
            <GripVertical className="h-5 w-5" />
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        {section.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {section.section_type || section.type}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{section.order}</span>
          <span className="text-xs text-gray-400">
            ({videosCount} videos, {imagesCount} images)
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            section.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
          }`}
        >
          {section.is_active ? "Visible" : "Hidden"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(section)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-primary-500 dark:hover:border-primary-400 transition-all"
            title="Edit section"
          >
            <Edit className="h-4 w-4" />
          </button>
          {/* Hide delete button for Content Blocks, Fixed Sections, Hero, and Footer */}
          {section.section_type !== 'content_block' && 
           section.section_type !== 'fixed' && 
           section.section_type !== 'hero' && 
           section.section_type !== 'footer' && (
            <button
              onClick={() => onDelete(section)}
              disabled={deleting === section.id}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-500 dark:hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Delete section"
            >
              {deleting === section.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

