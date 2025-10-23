import { supabase } from './supabase';

export interface Student {
  lrn: string;
  lname: string;
  fname: string;
  mname: string;
  strand?: string;
  enrollment_status: 'Pending' | 'Enrolled';
  fourPS?: string;
}

export const getStudents = async (track?: string): Promise<Student[]> => {
  let query = supabase.from('NewStudents').select('lrn, lname, fname, mname, strand, enrollment_status, fourPS').eq('enrollment_status', 'Enrolled');
  if (track) {
    query = query.eq('strand', track);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getPendingStudents = async (track?: string): Promise<Student[]> => {
  let query = supabase.from('NewStudents').select('lrn, lname, fname, mname, strand, enrollment_status').eq('enrollment_status', 'Pending');
  if (track) {
    query = query.eq('strand', track);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const approveStudent = async (lrn: string): Promise<void> => {
  const { error } = await supabase
    .from('NewStudents')
    .update({ enrollment_status: 'Enrolled' })
    .eq('lrn', lrn);
  if (error) throw error;
};

export const updateStudent = async (lrn: string, updates: Partial<Omit<Student, 'lrn'>>): Promise<void> => {
  const { error } = await supabase
    .from('NewStudents')
    .update(updates)
    .eq('lrn', lrn);
  if (error) throw error;
};

export const addStudent = async (student: Omit<Student, 'lrn' | 'enrollment_status'>): Promise<Student> => {
  const { data, error } = await supabase
    .from('NewStudents')
    .insert([{ ...student, enrollment_status: 'Pending' }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteStudent = async (lrn: string): Promise<void> => {
  const { error } = await supabase.from('NewStudents').delete().eq('lrn', lrn);
  if (error) throw error;
};

export const getAllStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase.from('NewStudents').select('lrn, lname, fname, mname, strand, enrollment_status, fourPS');
  if (error) throw error;
  return data || [];
};

/**
 * Fetches enrolled ALS students from the ALS table.
 * Note: ALS students are stored in a separate table from regular students.
 */
export const getALSStudents = async (): Promise<Student[]> => {
  try {
    const { data, error } = await supabase.from('ALS').select('lrn, lname, fname, mname, enrollment_status, fourPS').eq('enrollment_status', 'Enrolled');
    console.log('ALS Students query result:', { data, error });
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    // Map the data to include strand as 'ALS' since it's not in the table
    const studentsWithStrand = (data || []).map(student => ({
      ...student,
      strand: 'ALS'
    }));
    return studentsWithStrand;
  } catch (err) {
    console.error('getALSStudents error:', err);
    throw err;
  }
};

export const approveALSStudent = async (lrn: string): Promise<void> => {
  const { error } = await supabase
    .from('ALS')
    .update({ enrollment_status: 'Enrolled' })
    .eq('lrn', lrn);
  if (error) throw error;
};

export const updateALSStudent = async (lrn: string, updates: Partial<Omit<Student, 'lrn'>>): Promise<void> => {
  const { error } = await supabase
    .from('ALS')
    .update(updates)
    .eq('lrn', lrn);
  if (error) throw error;
};