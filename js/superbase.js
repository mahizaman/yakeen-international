// ============================================
//   YAKEEN INTERNATIONAL — SUPABASE CONFIG
// ============================================

const SUPABASE_URL = 'https://wjhbqhrzwopnmizlumyg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaGJxaHJ6d29wbm1pemx1bXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxODQyMDksImV4cCI6MjA5NDc2MDIwOX0.nPWyaBwX3cnioOYcXkVNLR_31AUeDjevphrtH87srgk';

// Initialize Supabase client
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
//   VACANCIES
// ============================================

// Get ALL vacancies (for vacancies page)
window.getVacancies = async function () {
  const { data, error } = await db
    .from('vacancies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('getVacancies error:', error); return []; }
  return data;
};

// Get FEATURED vacancies (for homepage — latest 3)
window.getFeaturedVacancies = async function () {
  const { data, error } = await db
    .from('vacancies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) { console.error('getFeaturedVacancies error:', error); return []; }
  return data;
};

// Admin: Add vacancy
window.addVacancy = async function (vacancy) {
  const { data, error } = await db
    .from('vacancies')
    .insert([vacancy])
    .select();

  if (error) throw error;
  return data;
};

// Admin: Update vacancy
window.updateVacancy = async function (id, updates) {
  const { data, error } = await db
    .from('vacancies')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};

// Admin: Delete vacancy
window.deleteVacancy = async function (id) {
  const { error } = await db
    .from('vacancies')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// ============================================
//   VISA TRACKING
// ============================================

// Public: Check visa status by passport number
window.getVisaStatus = async function (passportNumber) {
  const { data, error } = await db
    .from('visa_tracking')
    .select('*')
    .eq('passport_number', passportNumber.toUpperCase())
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // not found
    console.error('getVisaStatus error:', error);
    return null;
  }
  return data;
};

// Admin: Get all visa records
window.getAllVisaRecords = async function () {
  const { data, error } = await db
    .from('visa_tracking')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) { console.error('getAllVisaRecords error:', error); return []; }
  return data;
};

// Admin: Add visa record
window.addVisaRecord = async function (record) {
  // Normalize passport number to uppercase
  record.passport_number = record.passport_number.toUpperCase();

  const { data, error } = await db
    .from('visa_tracking')
    .insert([record])
    .select();

  if (error) throw error;
  return data;
};

// Admin: Update visa status
window.updateVisaStatus = async function (id, status) {
  const { data, error } = await db
    .from('visa_tracking')
    .update({ current_status: status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data;
};

// Admin: Delete visa record
window.deleteVisaRecord = async function (id) {
  const { error } = await db
    .from('visa_tracking')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// ============================================
//   GALLERY
// ============================================

// Get all gallery photos
window.getGallery = async function () {
  const { data, error } = await db
    .from('gallery')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('getGallery error:', error); return []; }
  return data;
};

// Admin: Add photo
window.addGalleryPhoto = async function (photo) {
  const { data, error } = await db
    .from('gallery')
    .insert([photo])
    .select();

  if (error) throw error;
  return data;
};

// Admin: Delete photo
window.deleteGalleryPhoto = async function (id) {
  const { error } = await db
    .from('gallery')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// ============================================
//   TESTIMONIALS
// ============================================

// Get all testimonials
window.getTestimonials = async function () {
  const { data, error } = await db
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('getTestimonials error:', error); return []; }
  return data;
};

// Get featured testimonials (latest 3 for homepage)
window.getFeaturedTestimonials = async function () {
  const { data, error } = await db
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) { console.error('getFeaturedTestimonials error:', error); return []; }
  return data;
};

// Admin: Add testimonial
window.addTestimonial = async function (testimonial) {
  const { data, error } = await db
    .from('testimonials')
    .insert([testimonial])
    .select();

  if (error) throw error;
  return data;
};

// Admin: Delete testimonial
window.deleteTestimonial = async function (id) {
  const { error } = await db
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

// ============================================
//   ADMIN AUTH
// ============================================

// Admin login
window.adminLogin = async function (email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

// Admin logout
window.adminLogout = async function () {
  const { error } = await db.auth.signOut();
  if (error) throw error;
  return true;
};

// Get current session
window.getSession = async function () {
  const { data } = await db.auth.getSession();
  return data.session;
};

// Check if admin is logged in — redirect to login if not
window.requireAuth = async function () {
  const session = await window.getSession();
  if (!session) {
    window.location.href = '../admin/login.html';
    return false;
  }
  return true;
};

// Listen for auth state changes
db.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // If on admin page, redirect to login
    if (window.location.pathname.includes('/admin/')) {
      window.location.href = '../admin/login.html';
    }
  }
});

console.log('✅ Supabase connected — Yakeen International');