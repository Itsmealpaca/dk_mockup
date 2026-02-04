import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import SearchResults from './SearchResults.tsx'
import ProductDetail from './ProductDetail.tsx'
import NeighborhoodSearchResults from './NeighborhoodSearchResults.tsx'
import NeighborhoodPostDetail from './NeighborhoodPostDetail.tsx'
import MeetingSearchResults from './MeetingSearchResults.tsx'
import MeetingDetail from './MeetingDetail.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/dk_mockup">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/main" element={<App />} />
        <Route path="/search/:sortId" element={<SearchResults />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/neighborhood/:categoryId" element={<NeighborhoodSearchResults />} />
        <Route path="/neighborhood/post/:id" element={<NeighborhoodPostDetail />} />
        <Route path="/meeting/search/:categoryId" element={<MeetingSearchResults />} />
        <Route path="/meeting/detail/:id" element={<MeetingDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
