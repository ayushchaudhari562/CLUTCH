const fs = require('fs');
const path = require('path');

const files = [
  'src/socket/socket.js',
  'src/pages/StudySwap.jsx',
  'src/pages/Profile.jsx',
  'src/pages/Home.jsx',
  'src/pages/CommentSection.jsx',
  'src/pages/Campus-Feed.jsx',
  'src/components/campus-feed/Feed-post.jsx',
  'src/App.jsx',
  'src/api/CommentsMain.jsx',
  'src/api/College.jsx'
];

files.forEach(f => {
  const fullPath = path.join(__dirname, f);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace fetch("/api/...") with fetch(import.meta.env.VITE_API_URL + "/api/...")
  content = content.replace(/fetch\(\"\/api\//g, 'fetch(import.meta.env.VITE_API_URL + "/api/');
  content = content.replace(/fetch\(\'\/api\//g, "fetch(import.meta.env.VITE_API_URL + '/api/");

  // Replace fetch(`/api/...`) with fetch(`${import.meta.env.VITE_API_URL}/api/...`)
  content = content.replace(/fetch\(\`\/api\//g, 'fetch(`${import.meta.env.VITE_API_URL}/api/');

  // Fix socket connection
  content = content.replace(/io\(\"\"/, 'io(import.meta.env.VITE_API_URL');

  // Fix image source URLs
  content = content.replace(/src=\{\`\/uploads/g, 'src={`${import.meta.env.VITE_API_URL}/uploads');

  fs.writeFileSync(fullPath, content);
  console.log('Fixed URL in', f);
});
