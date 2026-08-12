import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useAuth } from "@/common/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

export function SignupForm({
  ...props
}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { signup } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup({username, email, password});
      navigate("/dashboard");
    } catch(err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <div className="h-5 my-4 mx-5">
        {error && <span className="text-red-500 text-sm ml-5">{error}</span>}
      </div>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" type="text" placeholder="John Doe" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <FieldGroup>
              <Field className="mt-5">
                <Button type="submit" className="mb-2">Create Account</Button>
                <FieldDescription className="text-center my-5">
                  Already have an account? <Link to="/login" className="text-cyan-500">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
