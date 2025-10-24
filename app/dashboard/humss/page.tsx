'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStudents, Student } from '../../../lib/students';
import { supabase } from '../../../lib/supabase';

export default function SubjectScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
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
    .filter(student => student.lname && student.fname && student.mname)
    .sort((a, b) => (a.lname || '').localeCompare(b.lname || ''))
    .reduce((acc, student) => {
      const strand = student.strand || 'Unknown';
      if (!acc[strand]) acc[strand] = [];
      acc[strand].push(student);
      return acc;
    }, {} as Record<string, Student[]>);

  // Filter students based on search query
  const filteredStudents = groupedStudents['HUMSS']
    ? groupedStudents['HUMSS'].filter(student =>
        `${student.lname}, ${student.fname} ${student.mname}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with gradient and elevated feel */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-12 pb-8 px-6 shadow-xl rounded-b-3xl">
        <div className="flex items-start mb-6">
          {/* Back Button (using simple arrow HTML entity) */}
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-white/10 transition duration-150 mr-4 self-center"
            aria-label="Go back"
          >
            <span className="text-white text-2xl font-bold">←</span>
          </button>
          <div className="flex flex-col">
            <h1 className="text-white text-3xl font-extrabold tracking-tight">
              HUMSS Students
            </h1>
            <p className="text-blue-200 text-sm font-medium mt-1">
              Humanities and Social Sciences Strand
            </p>
          </div>
        </div>
        {/* Search Bar - White and prominent */}
        <div className="relative bg-white rounded-xl shadow-lg focus-within:ring-2 focus-within:ring-blue-300 transition duration-200">
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
      {/* Content Area - White background for clean look */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Approved Students Card */}
        <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2 border-gray-200">
            Approved Students List
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              {/* Simple Loading Spinner (using Tailwind classes) */}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
              <p className="text-gray-600">Loading student data...</p>
            </div>
          ) : groupedStudents['HUMSS'] && groupedStudents['HUMSS'].length > 0 ? (
            <div>
              <p className="text-md font-semibold text-gray-700 mb-3">
                Strand: <span className="text-blue-600">HUMSS ({filteredStudents.length} Students)</span>
              </p>
              {filteredStudents.length > 0 ? (
                <div className="space-y-3">
                  {filteredStudents.map((student, index) => (
                    <div
                      key={student.lrn}
                      className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 transition duration-150 rounded-lg border border-blue-200 shadow-sm"
                    >
                      <span className="text-blue-500 text-sm font-bold mr-4 w-6 text-center">
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
                  No students matched your search query.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600 font-medium">
                😔 No approved HUMSS students yet.
              </p>
            </div>
          )}
        </div>
        <div className="h-10" /> {/* Extra space at the bottom */}
      </div>
    </div>
  );
}