import { supabase } from './supabase';

export interface AppUser {
  full_name: string;
  email: string;
  password: string;
  status: 'Pending' | 'Approved';
}

export const addUser = async (user: Omit<AppUser, 'status'>): Promise<AppUser> => {
  const { data, error } = await supabase
    .from('AppUsers')
    .insert({
      full_name: user.full_name,
      email: user.email,
      password: user.password,
      status: 'Pending'
    })
    .select('full_name, email, password, status')
    .single();

  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email: string): Promise<AppUser | null> => {
  const { data, error } = await supabase
    .from('AppUsers')
    .select('full_name, email, password, status')
    .eq('email', email)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
};

export const updateUserStatus = async (email: string, status: 'Pending' | 'Approved'): Promise<void> => {
  const { error } = await supabase
    .from('AppUsers')
    .update({ status })
    .eq('email', email);
  if (error) throw error;
};

export const getUserById = async (id: string): Promise<AppUser | null> => {
  const { data, error } = await supabase
    .from('AppUsers')
    .select('full_name, email, password, status')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data;
};

export const resetPassword = async (email: string, newPassword: string): Promise<void> => {
  // Check if user exists
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  // Update password and set status to Pending for re-approval
  const { error } = await supabase
    .from('AppUsers')
    .update({
      password: newPassword,
      status: 'Pending'
    })
    .eq('email', email);

  if (error) throw error;
};