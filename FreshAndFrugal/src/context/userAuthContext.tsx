import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

interface IUserAuthProviderProps{
    children: React.ReactNode
}

type AuthContextData = {
    user: User | null;
    logIn:typeof logIn;
    signUp: typeof signUp;
    logOut: typeof logOut;
    googleSignIn: typeof googleSignIn;
};

const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
    return signOut(auth);
}; 

const googleSignIn = () =>{
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth,googleAuthProvider);
};

export const userAuthContext = createContext<AuthContextData>({
    user: null,
    logIn,
    signUp,
    logOut,
    googleSignIn,

})


export const userAuthProvider: React.FunctionComponent <IUserAuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if(user){
                console.log("user logged in and state is :", user)
                setUser(user);
            }
            return () => {
                unsubscribe();
            }
        })
    })
    const value: AuthContextData = {
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
    }
    return(<userAuthContext.Provider value = {value}>{children}</userAuthContext.Provider>);
};

export const userUserAuth = () => {
    return useContext(userAuthContext);
};