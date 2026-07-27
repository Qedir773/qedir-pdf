import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileSidebarDrawer } from "./MobileSidebarDrawer";
import { Workspace } from "./Workspace";
import { ToastContainer } from "../common/ToastContainer";
import { SettingsModal } from "../settings/SettingsModal";

export function AppShell() {
  return (
    <div className="relative h-full flex flex-col bg-base overflow-hidden">
      <div className="glow-ambient" />
      <Header />
      <div className="relative flex flex-1 min-h-0">
        <Sidebar />
        <Workspace />
      </div>
      <MobileSidebarDrawer />
      <SettingsModal />
      <ToastContainer />
    </div>
  );
}
