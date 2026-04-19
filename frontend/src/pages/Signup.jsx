import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import useStore from '../store/useStore';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      
      const userRole = role === 'User' ? 'Freelancer' : 'Admin';
      
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: user.email,
        role: userRole,
        createdAt: new Date().toISOString()
      });
      
      setUser({
        _id: user.uid,
        name: name,
        email: user.email,
        role: userRole,
        token: await user.getIdToken()
      });
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      
      const userRole = role === 'User' ? 'Freelancer' : 'Admin';
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      let finalRole = userRole;
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          role: userRole,
          createdAt: new Date().toISOString()
        });
      } else {
        finalRole = userDoc.data().role || 'Freelancer';
      }

      setUser({
        _id: user.uid,
        name: user.displayName,
        email: user.email,
        role: finalRole,
        token: await user.getIdToken()
      });
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Google Signup failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-3xl border border-border shadow-xl shadow-primary/5">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg shadow-primary/30">
            F
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">FreelanceHub</span>
        </div>
        
        <h2 className="text-2xl font-semibold text-center text-foreground mb-2">Create an account</h2>
        <p className="text-center text-muted-foreground mb-8">Join to manage your freelance business</p>
        
        {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl mb-6 text-center">{error}</div>}

        <button 
          type="button"
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full bg-card border border-border hover:bg-muted text-foreground py-2.5 rounded-xl font-medium shadow-sm flex items-center justify-center gap-3 transition-all mb-6 disabled:opacity-70"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-foreground mb-1.5">I am a</label>
             <div className="flex gap-4">
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" name="role" value="User" checked={role === 'User'} onChange={(e) => setRole(e.target.value)} className="text-primary focus:ring-primary h-4 w-4" />
                 <span className="text-sm text-foreground">Freelancer</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                 <input type="radio" name="role" value="Admin" checked={role === 'Admin'} onChange={(e) => setRole(e.target.value)} className="text-primary focus:ring-primary h-4 w-4" />
                 <span className="text-sm text-foreground">Client / Admin</span>
               </label>
             </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-medium shadow-md shadow-primary/20 flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-70"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
