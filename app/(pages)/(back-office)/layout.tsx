


import { AuthProvider } from "@/components/providers/AuthProvider";


interface RootLayoutProps {
    children: React.ReactNode;
}


export default function BackOfficeLayout({ children }: RootLayoutProps) {
    return (
        <AuthProvider>{children}</AuthProvider>
    );
}
