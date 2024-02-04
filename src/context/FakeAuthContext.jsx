import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initalState = {
  user: null,
  isAuthenticated: false,
};

function reducer(state , action){
    switch(action.type){
        case "login":
            return {...state , user : action.payLoad , isAuthenticated: true}
        case "logout":
            return { ...state, user: null, isAuthenticated: false };
        default : throw new Error("Invalid action")
    }
}

function AuthProvider({children}){

    const [{user , isAuthenticated}, dispatch] = useReducer(reducer , initalState)

    const FAKE_USER = {
      name: "Jack",
      email: "jack@example.com",
      password: "qwerty",
      avatar: "https://i.pravatar.cc/100?u=zz",
    };

    function logIn(email , password){
        if(email === FAKE_USER.email && password === FAKE_USER.password) 
        dispatch({type: "login", payLoad:FAKE_USER})
    }

    function logOut(){
        dispatch({type: "logout"})
    }

    return <AuthContext.Provider value={{logIn , logOut , user , isAuthenticated}}>{children}</AuthContext.Provider>
}
function useAuth(){
    const context = useContext(AuthContext);
    if(context === undefined) throw new Error("autContext was used outside the provider")
    return context
}

export { useAuth, AuthProvider };