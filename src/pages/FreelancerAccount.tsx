import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";

export default function FreelancerAccount() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getDoc(doc(db, "users", uid)).then(docSnap => {
      if (docSnap.exists()) setProfile(docSnap.data());
    });
  }, []);

  if (!profile) return <p>loading...</p>;

  return (
    <div className="p-8">
      <h1>welcome, {profile.fullName}</h1>
      <p>email: {auth.currentUser?.email}</p>
      <p>phone number: {profile.phone}</p>
      {/* и дальше остальная вкладка “Profile” и “Booking History” */}
    </div>
  );
}