
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function CustomerAccount() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        navigate("/account/customer-login");
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "customers", uid));
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Профиль не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Добро пожаловать, {profile.fullName}!
          </h1>
          <Button onClick={handleLogout} variant="outline">
            Выйти
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о профиле</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Телефон</p>
                <p className="font-medium">{profile.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Местоположение</p>
                <p className="font-medium">{profile.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Бюджет</p>
                <p className="font-medium">€{profile.budget}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Запрошенные услуги</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.selectedImprovements?.map((service: string) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {profile.photos && profile.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Загруженные фото</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.photos.map((photo: any, index: number) => (
                    <img
                      key={index}
                      src={photo.url}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>История заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Здесь будут отображаться ваши текущие и завершенные заказы.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
