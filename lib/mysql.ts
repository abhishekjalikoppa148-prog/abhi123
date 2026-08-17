/**
 * Legacy MySQL connector file — MIGRATED TO SUPABASE POSTGRESQL.
 * All functions now safely delegate to the Supabase database access layer.
 */
export * from './supabase/db';
export { supabaseAdmin } from './supabase/admin';
