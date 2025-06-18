import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function FreelancerSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl">you’re in!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            your freelancer account has been created and you are now logged in
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/account")}>
              go to account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
