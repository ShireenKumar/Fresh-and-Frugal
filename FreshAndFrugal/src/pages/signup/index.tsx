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
import { userUserAuth } from '@/context/userAuthContext';
import { Link, useNavigate } from "react-router-dom";

const initialValue: UserSignIn= {
    email:"",
    password:"",
    confirmPassword: "",
}
interface ISignupProps {

}

 

const Signup: React.FunctionComponent<ISignupProps> = (props) =>{
    const {googleSignIn, signUp} = userUserAuth();
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
        console.log("Error");
    }
 };

    return ( 
    <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline">
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Github
            </Button>
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
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create account</Button>
        </CardFooter>
      </Card>)
    //return <>signup</>
}

export default Signup;