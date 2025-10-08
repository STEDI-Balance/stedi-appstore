import React, { createContext, useEffect, useState } from "react";



const UserContext = createContext({
  user: null,
  setUser: () => {},
});

const UserContextProvider = ({ children, sessionToken, userName }) => {

  const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
                const response = await fetch(`https://dev.stedi.me/user/${userName}`, {
                    headers: {
                        "suresteps.session.token": sessionToken
                    }
                });
                
                if (response.ok) {
                    const data = await response.text();
                    const parsedData = JSON.parse(data);
                    setUser(parsedData);
                } 
            } catch (error) {
                console.log('error fetching user data', error);
            }
        };

       if(!user && userName && sessionToken) {
           fetchUserData();
       }
    }, [sessionToken, userName]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );


};

export { UserContext, UserContextProvider };