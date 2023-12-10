import React, { ReactNode, createContext, useState } from 'react';

interface MyComponentProps {
	children: ReactNode;
}

export type UserData = {
	name: string;
	email: string;
	phone: number;
};

type UserContextType = {
	updateUserData: ({}: UserData) => void;
	userData: UserData;
	isAuthenticated: boolean;
	toggleAuthentication: (isLogin: boolean) => void;
};

export const UserContext = createContext<UserContextType>({
	updateUserData: () => {},
	userData: { name: '', email: '', phone: 0 },
	toggleAuthentication: () => {},
	isAuthenticated: false,
});

const UserProvider: React.FC<MyComponentProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [userData, setUserData] = useState<UserData>({
		name: '',
		email: '',
		phone: 0,
	});

	const toggleAuthentication = (isLogin: boolean) => {
		setIsAuthenticated(isLogin);
	};

	const updateUserData = (data: UserData) => {
		setUserData(data);
	};

	const contextValue: UserContextType = {
		userData,
		updateUserData,
		isAuthenticated,
		toggleAuthentication,
	};

	return (
		<UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
	);
};

export default UserProvider;
