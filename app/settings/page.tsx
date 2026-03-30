"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommissionSettings } from "@/components/commission-settings";
import { ServiceSettings } from "@/components/service-settings";
import { GeneralSettings } from "@/components/general-settings";
import { Settings, Percent, Server, Cog, ShieldCheck } from "lucide-react";
import { ApiSettings } from "@/components/api-settings";

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 space-y-8 bg-muted/20 min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your VTU platform configuration, commissions, and services.
              </p>
            </div>
          </div>

          <Tabs defaultValue="commissions" className="space-y-6">
            <div className="border-b pb-0 overflow-x-auto">
              <TabsList className="bg-transparent h-auto p-0 space-x-6 justify-start w-full">
                <TabsTrigger 
                  value="commissions" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span>Commissions</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>Services</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="api" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>API Settings</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="general" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                   <div className="flex items-center gap-2">
                    <Cog className="h-4 w-4" />
                    <span>General</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="commissions" className="animate-in fade-in-50 duration-300 space-y-6">
              <CommissionSettings />
            </TabsContent>

            <TabsContent value="services" className="animate-in fade-in-50 duration-300 space-y-6">
              <ServiceSettings />
            </TabsContent>

            <TabsContent value="api" className="animate-in fade-in-50 duration-300 space-y-6">
               <ApiSettings />
            </TabsContent>

            <TabsContent value="general" className="animate-in fade-in-50 duration-300 space-y-6">
              <GeneralSettings />
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
