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

export const router = createBrowserRouter([
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
