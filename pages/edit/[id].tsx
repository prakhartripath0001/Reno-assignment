import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import NoticeForm from '../../components/NoticeForm';
import Link from 'next/link';

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchNotice = async () => {
      try {
        // Fetch all and find by ID, or we can fetch directly if we had a GET /api/notices/:id
        // Since we only have GET /api/notices according to spec, we filter from there.
        const { data } = await axios.get('/api/notices');
        const notice = data.find((n: any) => n.id === id);
        
        if (notice) {
          setInitialData(notice);
        } else {
          alert('Notice not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to fetch notice:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      await axios.put(`/api/notices/${id}`, data);
      router.push('/');
    } catch (error) {
      console.error('Failed to update notice:', error);
      alert('Failed to update notice. Check the console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans py-10">
      <Head>
        <title>Edit Notice - Notice Board</title>
      </Head>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
            &larr; Back to Notice Board
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Edit Notice</h1>
        </div>

        {initialData && (
          <NoticeForm initialData={initialData} onSubmit={handleSubmit} />
        )}
      </main>
    </div>
  );
}
