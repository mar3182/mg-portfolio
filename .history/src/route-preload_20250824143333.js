// Preload (prefetch) functions for lazy route chunks.
// Each returns the dynamic import promise so callers can trigger network fetch early (e.g., on hover).
export const preloadHome = () => import('./pages/Home')
export const preloadProjects = () => import('./pages/Projects')
export const preloadProjectDetail = () => import('./pages/ProjectDetail')
export const preloadContact = () => import('./pages/Contact')
export const preloadNotFound = () => import('./pages/NotFound')
