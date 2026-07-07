import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';

const NoticeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  category: z.enum(["EXAM", "EVENT", "GENERAL"]),
  priority: z.enum(["NORMAL", "URGENT"]),
  publishDate: z.string().min(1, "Date is required"),
  image: z.string().optional()
});

type NoticeFormData = z.infer<typeof NoticeSchema>;

interface NoticeFormProps {
  initialData?: NoticeFormData & { id?: string };
  onSubmit: (data: NoticeFormData) => Promise<void>;
}

export default function NoticeForm({ initialData, onSubmit }: NoticeFormProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<NoticeFormData>({
    resolver: zodResolver(NoticeSchema),
    defaultValues: {
      title: initialData?.title || "",
      body: initialData?.body || "",
      category: initialData?.category || "GENERAL",
      priority: initialData?.priority || "NORMAL",
      publishDate: initialData?.publishDate ? new Date(initialData.publishDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      image: initialData?.image || ""
    }
  });

  const currentImage = watch('image');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // We assume an unsigned preset "notice_board_preset" and a demo cloud "demo".
      // Users can modify these based on their real Cloudinary settings.
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'ml_default');
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.secure_url) {
        setValue('image', data.secure_url);
      } else {
        alert('Image upload failed. If you haven\'t set up Cloudinary credentials in .env, upload will fail.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
        <input 
          {...register("title")} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
          placeholder="Enter notice title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body</label>
        <textarea 
          {...register("body")} 
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
          placeholder="Enter notice content..."
        />
        {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
          <select 
            {...register("category")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
          >
            <option value="GENERAL">General</option>
            <option value="EVENT">Event</option>
            <option value="EXAM">Exam</option>
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select 
            {...register("priority")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
          >
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
          </select>
          {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publish Date</label>
        <input 
          type="date"
          {...register("publishDate")} 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white transition-colors"
        />
        {errors.publishDate && <p className="mt-1 text-sm text-red-600">{errors.publishDate.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image (Optional)</label>
        
        {currentImage && (
          <div className="mb-3 relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-40 w-full sm:w-64 bg-gray-50">
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={() => setValue('image', '')}
              className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-md text-xs shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <label className="flex-shrink-0 cursor-pointer px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus-within:ring-2 focus-within:ring-indigo-500">
            <span>{isUploading ? 'Uploading...' : 'Choose Image'}</span>
            <input 
              type="file" 
              accept="image/*" 
              className="sr-only" 
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </label>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Select an image to upload directly to Cloudinary
          </span>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-all"
        >
          {isSubmitting ? 'Saving...' : 'Submit'}
        </button>
      </div>

    </form>
  );
}
