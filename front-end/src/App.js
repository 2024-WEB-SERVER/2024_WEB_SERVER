import './App.css';
import Home from './components/Home';
import Post from './components/Post'
import Write from './components/Write'
import EditPost from './components/EditPost'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router = createBrowserRouter([
  { path: '/', element: <Home />},
  { path: '/post/:id', element: <Post />},
  { path: '/write', element: <Write />},
  { path: '/edit/:id', element: <EditPost />}
])
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
