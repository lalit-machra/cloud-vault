import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router-dom"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Files",
      url: "/",
      items: [
        {
          title: "All Files",
          url: "/",
        },
        {
          title: "Starred Files",
          url: "/",
        }
      ],
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="m-3">
        <Link to="/">
          <img src="../../../public/logo.png" className="p-2"></img>
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-3">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                className="group/label text-base text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                render={<CollapsibleTrigger />}>
                {item.title}{" "}
                <ChevronRightIcon
                  className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton isActive={item.isActive} render={<a href={item.url} />}>
                          {item.title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
