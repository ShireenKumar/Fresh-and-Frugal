import * as React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { UserLogIn } from '@/types';
import { Icons } from '@/components/ui/icons';
import { useUserAuth } from '@/context/userAuthContext';
import { Link, useNavigate } from "react-router-dom";
interface ILoginProps {

}

const initialValue: UserLogIn= {
    email:"",
    password:"",
}
const Login: React.FunctionComponent<ILoginProps> = (props) =>{
   // return <>log in</>
    const {googleSignIn, logIn} = useUserAuth();
    const navigate  = useNavigate();
    const [userLoginInfo, setUserLoginInfo] = React.useState<UserLogIn>(initialValue)
 const handleGoogleSignIn = async(e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try{
        await googleSignIn();
        navigate("/")
    }catch(error){
        console.log("Error: ", error)
    }

 };
 const handleSubmit = async(e: React.MouseEvent<HTMLFormElement>) =>{
    e.preventDefault();
    try{
        console.log("The user info is : ", userLoginInfo)
        await logIn(userLoginInfo.email, userLoginInfo.password)
        navigate("/")
    }catch(error){
        console.log("Error");
    }
 };
    return (
        <div className="bg-slate-800 w-full h-screen">
        <div className="container mx-auto p-6 flex h-full">
          <div className="flex justify-center items-center w-full">
            {/* <div className = "p-6 w-2/3 hidden lg:block"></div> */}
            <div className="max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm">
              <Card>
                <form onSubmit={handleSubmit}>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center mb-4">
                      Fresh and Frugal
                    </CardTitle>
                    <CardDescription>
                      Enter your email below to create your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid">
                      <Button variant="outline" onClick={handleGoogleSignIn}>
                        <Icons.google className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="username@example.com"
                        value={userLoginInfo.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUserLoginInfo({ ...userLoginInfo, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={userLoginInfo.password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUserLoginInfo({ ...userLoginInfo, password: e.target.value })
                        }
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button className="w-full" type="submit">
                      Login
                    </Button>
                    <p className="mt-3 text-sm text-center">
                      Don't have an account? <Link to="/signup">Sign up</Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
}

export default Login;