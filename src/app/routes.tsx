import { createBrowserRouter } from "react-router";
import { MobileLayout } from "./components/layout/MobileLayout";
import { BattleScreen } from "./screens/BattleScreen";
import { ShopScreen } from "./screens/ShopScreen";
import { ClanScreen } from "./screens/ClanScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MobileLayout,
    children: [
      { index: true, Component: BattleScreen },
      { path: "shop", Component: ShopScreen },
      { path: "clan", Component: ClanScreen },
      { path: "profile", Component: ProfileScreen },
    ],
  },
]);
