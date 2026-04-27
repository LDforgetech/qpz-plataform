import "./page.css";
import Navbar from "@/components/nav-bar";
import Hero from "@/components/hero";
import FeaturedCourses from "@/components/featured-courses";
import PricingPlans from "@/components/pricing-plans";
import Footer from "@/components/footer";
import PersonalizedPath from "@/components/personalized-path";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <PersonalizedPath />
      <FeaturedCourses />
      <PricingPlans />
      <Footer />
    </div>
  );
}
