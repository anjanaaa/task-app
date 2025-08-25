import { supabase } from './supabase';

describe('Supabase Configuration', () => {
  test('supabase client is initialized', () => {
    expect(supabase).toBeDefined();
    expect(typeof supabase.from).toBe('function');
    expect(typeof supabase.auth).toBe('object');
    expect(typeof supabase.channel).toBe('function');
  });

  test('supabase client has required methods', () => {
    expect(typeof supabase.from).toBe('function');
    expect(typeof supabase.rpc).toBe('function');
    expect(typeof supabase.storage).toBe('object');
    expect(typeof supabase.realtime).toBe('object');
  });

  test('can create table queries', () => {
    const query = supabase.from('tasks');
    expect(query).toBeDefined();
    expect(typeof query.select).toBe('function');
    expect(typeof query.insert).toBe('function');
    expect(typeof query.update).toBe('function');
    expect(typeof query.delete).toBe('function');
  });

  test('can create real-time channels', () => {
    const channel = supabase.channel('test-channel');
    expect(channel).toBeDefined();
    expect(typeof channel.on).toBe('function');
    expect(typeof channel.subscribe).toBe('function');
  });
});
