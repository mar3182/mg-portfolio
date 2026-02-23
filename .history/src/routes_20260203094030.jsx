import React, { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './AppLayout'

// Route-based code splitting
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const Agency = lazy(() => import('./pages/Agency'))
const Expertise = lazy(() => import('./pages/Expertise'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Demo pages
const CinematicDemo = lazy(() => import('./pages/CinematicDemo'))

// Concept pages (experimental designs)
const AwardHero = lazy(() => import('./concepts/award-hero/AwardHeroPage'))
const LivingPortrait = lazy(() => import('./concepts/living-portrait/LivingPortraitPage'))
const LivingPortraitV2 = lazy(() => import('./concepts/living-portrait/LivingPortraitV2'))
const LivingPortraitV3 = lazy(() => import('./concepts/living-portrait/LivingPortraitV3'))
const LivingPortraitV4 = lazy(() => import('./concepts/living-portrait/LivingPortraitV4'))
const LivingPortraitV5 = lazy(() => import('./concepts/living-portrait/LivingPortraitV5'))
const LivingPortraitV6 = lazy(() => import('./concepts/living-portrait/LivingPortraitV6'))
const AkaruStylePage = lazy(() => import('./concepts/living-portrait/AkaruStylePage'))

export const router = createBrowserRouter([
  // Standalone demo pages (no layout wrapper)
  { path: 'cinematic-demo', element: <CinematicDemo /> },
  
  // Award-winning concept pages
  { path: 'concepts/award-hero', element: <AwardHero /> },
  { path: 'concepts/living-portrait', element: <LivingPortrait /> },
  { path: 'concepts/living-portrait-v2', element: <LivingPortraitV2 /> },
  { path: 'concepts/living-portrait-v3', element: <LivingPortraitV3 /> },
  { path: 'concepts/living-portrait-v4', element: <LivingPortraitV4 /> },
  { path: 'living-portrait', element: <LivingPortraitV4 /> },
  { path: 'living-portrait-v5', element: <LivingPortraitV5 /> },
  { path: 'living-portrait-v6', element: <LivingPortraitV6 /> },
  { path: 'akaru-style', element: <AkaruStylePage /> },
  
  {
    element: <AppLayout />, // shared layout with header/menu
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'expertise', element: <Expertise /> },
      { path: 'agency', element: <Agency /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
