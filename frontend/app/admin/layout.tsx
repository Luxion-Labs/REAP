
"use client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/app/admin/admin-sidebar"
import { AdminHeader } from "@/app/admin/admin-header"
import { WalletProvider } from "@/components/providers/wallet-provider"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset className="flex flex-col h-screen w-full">
        <AdminHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <AdminLayoutInner>
        {children}
      </AdminLayoutInner>
    </WalletProvider>
  )
}

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>
}
