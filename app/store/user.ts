import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  name: string;
  email: string;
  isAuthenticate: boolean;
  
};

type loginPromise = {
    status: boolean;
    message?: string;
}

type UseState = {
  user: User;
  userHydrated: boolean;
  addToUser: (user: User) => void;
  login: (email: string) => loginPromise;
  setUserHydrated: (state: boolean) => void;
  
};

export const useStore = create<UseState>()(
  persist(
    (set, get) => ({
      user: {
        name: "",
        email: "",
        isAuthenticate: false,
      },
      userHydrated: false,
      setUserHydrated: (state) => set({ userHydrated: state }),
      addToUser: (user: User) => set({ user }),
      login: (email: string) => {
        const user = get().user;
        if (user.name !== "" || user.email !== "")  {
          return user.email === email ? {status: true} : {status: false, message: "E-mail ou senha invalidos"};
        }

        return {
            status: false,
            message: "Usuário não existe."
        };
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setUserHydrated(true); 
      },
    }
  )
);
