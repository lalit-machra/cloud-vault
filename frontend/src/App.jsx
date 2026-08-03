import { Link } from "react-router-dom"

function App() {
  return (
    <>
      <h1>Welcome to Cloud Vault</h1>
      <Link to="/login" className="text-blue-500 block">login</Link>
      <Link to="/signup" className="text-green-500 block">signup</Link>
    </>
  )
}

export default App
