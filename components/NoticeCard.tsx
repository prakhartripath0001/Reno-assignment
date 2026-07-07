import React, { useState } from 'react';
import Link from 'next/link';

interface NoticeCardProps {
  notice: {
    id: string;
    title: string;
    body: string;
    category: string;
    priority: string;
    publishDate: string;
    image?: string | null;
  };
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'EXAM': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'EVENT': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function NoticeCard({ notice, onDelete }: NoticeCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="flex flex-col rounded-xl shadow border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      {notice.image && (
        <img 
          src={notice.image} 
          alt={notice.title} 
          className="w-full h-48 object-cover border-b border-gray-200 dark:border-gray-700" 
        />
      )}
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {notice.priority === 'URGENT' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white shadow-sm">
              URGENT
            </span>
          )}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(notice.category)}`}>
            {notice.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {notice.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
          {notice.body}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {new Date(notice.publishDate).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
          <div className="flex gap-3">
            <Link 
              href={`/edit/${notice.id}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Edit
            </Link>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 transform transition-all">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone. This will permanently delete this notice.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  onDelete(notice.id);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
