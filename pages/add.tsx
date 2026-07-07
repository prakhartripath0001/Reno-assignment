import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import NoticeForm from '../components/NoticeForm';
import Link from 'next/link';

export default function AddNotice() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await axios.post('/api/notices', data);
      router.push('/');
    } catch (error) {
      console.error('Failed to create notice:', error);
      alert('Failed to create notice. Check the console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans py-10">
      <Head>
        <title>Add Notice - Notice Board</title>
      </Head>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
            &larr; Back to Notice Board
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Add Notice</h1>
        </div>

        <NoticeForm onSubmit={handleSubmit} />
      </main>
    </div>
  );
}
