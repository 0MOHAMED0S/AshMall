import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/ash/Nav";
import { HeroBanner } from "@/components/ash/HeroBanner";
import { Categories } from "@/components/ash/Categories";
import { MostOrdered } from "@/components/ash/MostOrdered";
import { Discounts } from "@/components/ash/Discounts";
import { NearbyStoresCircles } from "@/components/ash/NearbyStoresCircles";
import { RecentlyAdded } from "@/components/ash/RecentlyAdded";
import { RecentlyViewed } from "@/components/ash/RecentlyViewed";
import { FeaturedStores } from "@/components/ash/FeaturedStores";
import { ForBusiness } from "@/components/ash/ForBusiness";
import { Footer } from "@/components/ash/Footer";
import { BottomTabBar } from "@/components/ash/BottomTabBar";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "آش مول — السوق الذكي لأشمون" },
      {
        name: "description",
        content:
          "آش مول يربطك بكل متجر حقيقي موثّق في مدينة أشمون — صيدليات، مطاعم، أزياء، إلكترونيات — في تجربة سلسة مدعومة بالذكاء الاصطناعي.",
      },
      { property: "og:title", content: "آش مول — السوق الذكي لأشمون" },
      { property: "og:description", content: "السوق الذكي لمدينة أشمون، مصر." },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background pb-mobile-tabbar" dir="rtl">
      <Nav />
      {/* The Nav is 2 rows tall on mobile; push content down */}
      <main className="pt-32 sm:pt-32">
        <Categories />
        <HeroBanner />
        <MostOrdered />
        <Discounts />
        <NearbyStoresCircles />
        <FeaturedStores />
        <RecentlyAdded />
        <RecentlyViewed />
        <ForBusiness />
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}
