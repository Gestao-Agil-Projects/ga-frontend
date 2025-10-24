import { create } from 'zustand';
import type { UserData } from '../services/User/user.service';

interface UserManagementState {
    users: UserData[];
    setUsers: (users: UserData[]) => void;
    addUser: (user: UserData) => void;
    updateUser: (id: string, user: UserData) => void;
    removeUser: (id: string) => void;
    clearUsers: () => void;
}

export const userManagementStore = create<UserManagementState>((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
    addUser: (user) => set((state) => ({ users: [...state.users, user] })),
    updateUser: (id, user) => set((state) => ({
        users: state.users.map(u => u.id === id ? user : u)
    })),
    removeUser: (id) => set((state) => ({
        users: state.users.filter(u => u.id !== id)
    })),
    clearUsers: () => set({ users: [] }),
}));
