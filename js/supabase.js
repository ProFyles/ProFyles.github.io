// ==========================================
// SUPABASE CLIENT
// ==========================================

const SUPABASE_URL = "https://rxbqpfmpsouyzkfzajuu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_9zsP3_Kr1-1kqtWrakUMCw_Uw-XLDRq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);