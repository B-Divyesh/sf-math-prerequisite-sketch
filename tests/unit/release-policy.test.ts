import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

describe('static deployment response policy', () => {
  const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8'));

  test('serves only known application deep links through the SPA shell', () => {
    expect(config.navigationFallback).toBeUndefined();
    const rewrites = Object.fromEntries(config.routes.filter((route: { rewrite?: string }) => route.rewrite).map((route: { route: string; rewrite: string }) => [route.route, route.rewrite]));
    expect(rewrites).toEqual({
      '/': '/index.html',
      '/demo': '/index.html',
      '/sketch': '/index.html',
      '/map': '/index.html',
      '/privacy': '/index.html',
      '/terms': '/index.html',
      '/404': '/index.html'
    });
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  test('gives fingerprinted build assets an immutable one-year policy', () => {
    const assets = config.routes.find((route: { route: string }) => route.route === '/assets/*');
    expect(assets.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
  });

  test('activates service-worker updates and removes prior caches', () => {
    const worker = readFileSync('public/sw.js', 'utf8');
    expect(worker).toContain("const CACHE = 'math-missing-step-v2'");
    expect(worker).toContain('self.skipWaiting()');
    expect(worker).toContain('self.clients.claim()');
    expect(worker).toContain('key !== CACHE');
  });
});
