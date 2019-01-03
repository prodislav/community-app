import { User } from 'interfaces/User';

export abstract class UserAuthenticationRepository {
    public abstract registerUser(newUser: User): Promise<User>;

    public abstract loginUser(newUser: User): Promise<{ success: boolean, token: string }>;

    public abstract setUserLanguage(userEmail: string, userLanguage: string): Promise<boolean>;

    public abstract getUserLanguage(userEmail: string): Promise<string>;

    public abstract checkUserEmail(userEmail: string): Promise<boolean>;

    public abstract socialNetworksLogin(email: string, name: string, language: string, accessToken: string, imageUrl: string)
        : Promise<{ success: boolean, token: string }>;

    public abstract getUserRole(id: number): Promise<number>;

    public abstract getUserLinks(id: number): Promise<string[]>;
}
