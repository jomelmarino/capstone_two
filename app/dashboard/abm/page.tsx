'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStudents, Student } from '../../../lib/students';

export default function SubjectScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // --- START: ESSENTIAL CODE (NO CHANGES) ---
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const approvedStudents = await getStudents();
      setStudents(approvedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error: Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const groupedStudents = students
    .sort((a, b) => a.lname.localeCompare(b.lname))
    .reduce((acc, student) => {
      const strand = student.strand || 'Unknown';
      if (!acc[strand]) acc[strand] = [];
      acc[strand].push(student);
      return acc;
    }, {} as Record<string, Student[]>);

  // Filter students based on search query
  const filteredStudents = groupedStudents['ABM']
    ? groupedStudents['ABM'].filter(student =>
        `${student.lname}, ${student.fname} ${student.mname}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];
  // --- END: ESSENTIAL CODE (NO CHANGES) ---

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - ABM Themed Gradient (Gold/Orange) and Elevated */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 pt-12 pb-8 px-6 shadow-xl rounded-b-3xl">
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
              ABM Students
            </h1>
            <p className="text-yellow-200 text-sm font-medium mt-1">
              Accountancy, Business and Management Strand
            </p>
          </div>
        </div>

        {/* Search Bar - White, Shadowed, and Iconized (No Package) */}
        <div className="relative bg-white rounded-xl shadow-lg focus-within:ring-4 focus-within:ring-orange-300 transition duration-200">
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
          <h2 className="text-2xl font-bold text-orange-700 mb-4 border-b pb-2 border-gray-200">
            Approved Students List
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              {/* Simple Loading Spinner (using Tailwind classes) */}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mr-3"></div>
              <p className="text-gray-600 font-medium">Loading student data...</p>
            </div>
          ) : groupedStudents['ABM'] && groupedStudents['ABM'].length > 0 ? (
            <div>
              <p className="text-md font-semibold text-gray-700 mb-4">
                Strand: <span className="text-orange-600 font-extrabold">ABM ({filteredStudents.length} Students)</span>
              </p>
              
              {filteredStudents.length > 0 ? (
                <div className="space-y-3">
                  {filteredStudents.map((student, index) => (
                    <div
                      key={student.lrn}
                      className="flex items-center p-3 bg-yellow-50 hover:bg-yellow-100 transition duration-150 rounded-lg border border-yellow-200 shadow-sm"
                    >
                      <span className="text-orange-500 text-base font-bold mr-4 w-6 text-center">
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
                  No students matched your search query in ABM.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600 font-medium">
                😔 No approved ABM students yet.
              </p>
            </div>
          )}
        </div>
        <div className="h-10" /> {/* Extra space at the bottom */}
      </div>
    </div>
  );
}