import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function CustomerLogin() {
  const [email, setEmail]= useState("");
  const [password, setPw]= useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/account/freelancer");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <div>
        <Label htmlFor="email">email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPw(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "signing in…" : "sign In"}
      </Button>
    </form>
  );
}