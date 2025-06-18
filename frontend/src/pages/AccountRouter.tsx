import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../components/ui/button";

export default function AccountRouter() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="hover:shadow-lg">
          <CardHeader>
            <CardTitle>freelancer account</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/account/freelancer-login">
              <Button>go to freelancer</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg">
          <CardHeader>
            <CardTitle>customer account</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link to="/account/customer-login">
              <Button>go to customer</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
