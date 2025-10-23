'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getALSStudents, Student } from '../../../lib/students';
import { supabase } from '../../../lib/supabase';

export default function SubjectScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // --- START: ESSENTIAL CODE (NO CHANGES) ---
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        // Only fetch students after confirming authentication
        fetchStudents();
        // Set up real-time subscription for automatic updates
        const channel = supabase
          .channel('als-updates')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'ALS' }, () => {
            fetchStudents();
          })
          .subscribe();
        return () => {
          supabase.removeChannel(channel);
        };
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchStudents = async () => {
    try {
      const approvedStudents = await getALSStudents();
      if (isMountedRef.current) {
        setStudents(approvedStudents);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      if (isMountedRef.current) {
        alert(`Error: Failed to load students. ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };


  // Filter students based on search query
  const filteredStudents = students
    .sort((a, b) => a.lname.localeCompare(b.lname))
    .filter(student =>
      `${student.lname}, ${student.fname} ${student.mname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  // --- END: ESSENTIAL CODE (NO CHANGES) ---

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - ALS Themed Gradient (Green/Cyan) and Elevated */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 pt-12 pb-8 px-6 shadow-xl rounded-b-3xl">
        <div className="flex items-start mb-6">
          {/* Back Button (using simple arrow HTML entity) */}
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-white/20 transition duration-150 mr-4 self-center"
            aria-label="Go back"
          >
            <span className="text-white text-3xl font-bold">←</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-white text-3xl font-extrabold tracking-tight">
              ALS Students
            </h1>
            <p className="text-emerald-200 text-sm font-medium mt-1">
              Alternative Learning System
            </p>
          </div>
        </div>

        {/* Search Bar - White, Shadowed, and Iconized (No Package) */}
        <div className="relative bg-white rounded-xl shadow-lg focus-within:ring-4 focus-within:ring-cyan-300 transition duration-200">
          {/* Search Icon (using simple text/placeholder) */}
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-bold">
            🔍
          </span>
          <input
            placeholder="Search students (Last Name, First Name...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-gray-800 w-full py-3 pl-10 pr-4 rounded-xl focus:outline-none"
          />
        </div>
      </div>

      {/* Content Area - Clean Background */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">

        {/* Approved Students Card - Structured and Highlighting Strand */}
        <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-cyan-700 mb-4 border-b pb-2 border-gray-200">
            Approved Students List
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              {/* Simple Loading Spinner (using Tailwind classes) */}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mr-3"></div>
              <p className="text-gray-600 font-medium">Loading student data...</p>
            </div>
          ) : students.length > 0 ? (
            <div>
              <p className="text-md font-semibold text-gray-700 mb-4">
                All Students: <span className="text-cyan-600 font-extrabold">({filteredStudents.length} Students)</span>
              </p>
              
              {filteredStudents.length > 0 ? (
                <div className="space-y-3">
                  {filteredStudents.map((student, index) => (
                    <div
                      key={student.lrn}
                      className="flex items-center p-3 bg-emerald-50 hover:bg-emerald-100 transition duration-150 rounded-lg border border-emerald-200 shadow-sm"
                    >
                      <span className="text-cyan-600 text-base font-bold mr-4 w-6 text-center">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {student.lname}, {student.fname} {student.mname}
                        </p>
                        <p className={`text-xs font-semibold ${student.fourPS === 'Yes' ? 'text-green-600' : 'text-red-500'}`}>
                          4Ps Status: {student.fourPS || 'No'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-gray-500 italic">
                  No students matched your search query in ALS.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600 font-medium">
                😔 No approved ALS students yet.
              </p>
            </div>
          )}
        </div>
        <div className="h-10" /> {/* Extra space at the bottom */}
      </div>
    </div>
  );
}
