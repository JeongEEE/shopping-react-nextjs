export interface User {
	// accessToken: string;
	auth: object;
	displayName: string | null;
	email: string;
	emailVerified: boolean;
	metadata: object;
	phoneNumber: number | null;
	photoURL: string | null;
	proactiveRefresh: object;
	providerData: Array<object>;
	providerId: string;
	reloadListener: object | null;
	reloadUserInfo: object;
	stsTokenManager: object;
	tenantId: string | null;
	uid: string;
}