import "./page.css";
import Navbar from "@/components/nav-bar";
import Hero from "@/components/hero";
import FeaturedCourses from "@/components/featured-courses";
import PricingPlans from "@/components/pricing-plans";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedCourses />
      <PricingPlans />
      <Footer />
    </div>
  );
}
