"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Video,
  Image as ImageIcon,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BarChart3,
  Home,
  CreditCard,
  Eye,
  Settings,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    sections: 0,
    youtubeSections: 0,
    contentBlocks: 0,
    pricingPlans: 0,
    videos: 0,
    images: 0,
    activeSections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = localStorage.getItem("admin_token");

      console.log("🔍 Fetching dashboard stats from:", apiUrl);

      const [sectionsRes, pricingRes, videosRes, imagesRes] = await Promise.all([
        fetch(`${apiUrl}/api/sections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(err => {
          console.error("❌ Failed to fetch sections:", err);
          return { ok: false, status: 0, json: async () => [] };
        }),
        fetch(`${apiUrl}/api/pricing`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(err => {
          console.error("❌ Failed to fetch pricing:", err);
          return { ok: false, status: 0, json: async () => [] };
        }),
        fetch(`${apiUrl}/api/videos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(err => {
          console.error("❌ Failed to fetch videos:", err);
          return { ok: false, status: 0, json: async () => [] };
        }),
        fetch(`${apiUrl}/api/images`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(err => {
          console.error("❌ Failed to fetch images:", err);
          return { ok: false, status: 0, json: async () => [] };
        }),
      ]);

      const sections = sectionsRes.ok ? await sectionsRes.json() : [];
      const pricing = pricingRes.ok ? await pricingRes.json() : [];
      const videos = videosRes.ok ? await videosRes.json() : [];
      const images = imagesRes.ok ? await imagesRes.json() : [];

      // Calculate detailed stats
      const youtubeSections = sections.filter((s: any) => s.section_type === 'youtube' || (s.type === 'youtube' && !s.section_type)).length;
      const contentBlocks = sections.filter((s: any) => s.section_type === 'content_block').length;
      const activeSections = sections.filter((s: any) => s.is_active).length;

      setStats({
        sections: sections.length || 0,
        youtubeSections,
        contentBlocks,
        pricingPlans: pricing.length || 0,
        videos: videos.length || 0,
        images: images.length || 0,
        activeSections,
      });

      // Check if all requests failed
      if (!sectionsRes.ok && !pricingRes.ok && !videosRes.ok && !imagesRes.ok) {
        console.warn("⚠️ All API requests failed. Make sure the backend is running on port 3001.");
      }
    } catch (error: any) {
      console.error("❌ Error fetching stats:", error);
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        console.error("💡 Backend might not be running. Start it with: cd backend && npm run start:dev");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Active Sections",
      value: stats.activeSections,
      subtitle: `of ${stats.sections} total`,
      icon: FileText,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      href: "/admin/sections",
    },
    {
      label: "YouTube Sections",
      value: stats.youtubeSections,
      subtitle: "Draggable sections",
      icon: Video,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      href: "/admin/sections",
    },
    {
      label: "Content Blocks",
      value: stats.contentBlocks,
      subtitle: "Fixed blocks",
      icon: Settings,
      color: "indigo",
      bgGradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      href: "/admin/sections",
    },
    {
      label: "Pricing Plans",
      value: stats.pricingPlans,
      subtitle: "Active plans",
      icon: DollarSign,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      href: "/admin/pricing",
    },
    {
      label: "Videos",
      value: stats.videos,
      subtitle: "YouTube videos",
      icon: Video,
      color: "red",
      bgGradient: "from-red-500 to-red-600",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      href: "/admin/videos",
    },
    {
      label: "Images",
      value: stats.images,
      subtitle: "Uploaded images",
      icon: ImageIcon,
      color: "orange",
      bgGradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      href: "/admin/images",
    },
  ];

  const quickActions = [
    {
      title: "Hero Section",
      description: "Edit hero section (title, image, CTAs)",
      href: "/admin/hero",
      icon: Home,
      iconBg: "bg-primary-100 dark:bg-primary-900/30",
      iconColor: "text-primary-600 dark:text-primary-400",
      priority: "high",
    },
    {
      title: "Sections Management",
      description: "Manage YouTube sections & Content blocks",
      href: "/admin/sections",
      icon: FileText,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      priority: "high",
    },
    {
      title: "Pricing Plans",
      description: "Update pricing plans and features",
      href: "/admin/pricing",
      icon: DollarSign,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      priority: "medium",
    },
    {
      title: "Footer",
      description: "Edit footer (logo, description, links)",
      href: "/admin/footer",
      icon: CreditCard,
      iconBg: "bg-gray-100 dark:bg-gray-900/30",
      iconColor: "text-gray-600 dark:text-gray-400",
      priority: "medium",
    },
    {
      title: "View Frontend",
      description: "Preview your landing page",
      href: "/",
      icon: Eye,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      priority: "low",
      external: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your content.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const CardWrapper = card.href ? Link : 'div';
          const cardProps = card.href ? { href: card.href } : {};
          
          return (
            <CardWrapper
              key={card.label}
              {...cardProps}
              className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                card.href ? 'cursor-pointer' : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Gradient Accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.bgGradient}`}></div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.iconBg}`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  {card.href && (
                    <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {card.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </CardWrapper>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Quick Actions
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Manage your content quickly and efficiently
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* High Priority Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Essential Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions
                .filter((action) => action.priority === "high")
                .map((action, index) => {
                  const Icon = action.icon;
                  const LinkComponent = action.external ? "a" : Link;
                  const linkProps = action.external 
                    ? { href: action.href, target: "_blank", rel: "noopener noreferrer" }
                    : { href: action.href };
                  
                  return (
                    <LinkComponent
                      key={action.href}
                      {...linkProps}
                      className="group relative p-5 border-2 border-primary-200 dark:border-primary-800 rounded-lg hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg ${action.iconBg}`}>
                          <Icon className={`w-6 h-6 ${action.iconColor}`} />
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-transform group-hover:translate-x-1" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </LinkComponent>
                  );
                })}
            </div>
          </div>

          {/* Other Actions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Other Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions
                .filter((action) => action.priority !== "high")
                .map((action, index) => {
                  const Icon = action.icon;
                  const LinkComponent = action.external ? "a" : Link;
                  const linkProps = action.external 
                    ? { href: action.href, target: "_blank", rel: "noopener noreferrer" }
                    : { href: action.href };
                  
                  return (
                    <LinkComponent
                      key={action.href}
                      {...linkProps}
                      className="group relative p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2 rounded-lg ${action.iconBg}`}>
                          <Icon className={`w-5 h-5 ${action.iconColor}`} />
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-transform group-hover:translate-x-1" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {action.description}
                      </p>
                    </LinkComponent>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

