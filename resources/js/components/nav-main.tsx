import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    
    const renderSideMenu = (children: NavItem[])=>{
        return(
            <SidebarMenu className="transition-transform duration-300 ease-in-out transform" >
                {children.map((child)=>(
                    <SidebarMenuItem key={child.title} className='py-2 pl-4'>
                    <SidebarMenuButton asChild isActive={child.url === page.url}>
                        <Link href={child.url} prefetch>
                            {child.icon && <child.icon />}
                            <span>{child.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
        );
    }
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.url === page.url}>
                            <Link href={item.url} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                        {item.url === page.url && item.children && renderSideMenu(item.children)}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
