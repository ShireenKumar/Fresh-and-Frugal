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
import { UserSignIn } from '@/types';
import { Icons } from '@/components/ui/icons';
import { useUserAuth } from '@/context/userAuthContext';
import { Link, useNavigate } from "react-router-dom";

const initialValue: UserSignIn= {
    email:"",
    password:"",
    confirmPassword: "",
}
interface ISignupProps {

}

 

const Signup: React.FunctionComponent<ISignupProps> = (props) =>{
    const {googleSignIn, signUp} = useUserAuth();
    const navigate  = useNavigate();
    const [userInfo, setUserInfo] = React.useState<UserSignIn>(initialValue)
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
        console.log("The user info is : ", userInfo)
        await signUp(userInfo.email, userInfo.password)
        navigate("/")
    }catch(error){
        console.log(error);
    }
 };

 return (
    <div className="bg-slate-800 w-full h-screen">
      <div className="container mx-auto p-6 flex h-full">
        <div className="flex justify-center items-center w-full">
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
                      value={userInfo.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserInfo({ ...userInfo, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={userInfo.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserInfo({ ...userInfo, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmpassword">Confirm password</Label>
                    <Input
                      id="confirmpassword"
                      type="password"
                      placeholder="Confirm password"
                      value={userInfo.confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserInfo({
                          ...userInfo,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button className="w-full" type="submit">
                    Sign Up
                  </Button>
                  <p className="mt-3 text-sm text-center">
                    Already have an account ? <Link to="/login">Login</Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

    //return <>signup</>
}

export default Signup;