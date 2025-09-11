import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Users,
  Clock,
  Shield,
  Award,
  Target,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/utils/colors";

// Modified hook for one-time animation
const useInViewOnce = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref || hasAnimated) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasAnimated(true);
        observer.disconnect();
      }
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, hasAnimated, options]);

  return [setRef, hasAnimated];
};

// Counter animation hook
const useCountUp = (target, isActive) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let startTime = null;
    const duration = 2000; // 2 seconds

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Ease out cubic for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easedProgress * target);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, isActive]);

  return count;
};

// Animated Section Component - animates only once
const AnimatedSection = ({ children, delay = 0, className = "" }) => {
  const [ref, hasAnimated] = useInViewOnce({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        hasAnimated 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: hasAnimated ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

// Feature Card Component - animates only once
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const [ref, hasAnimated] = useInViewOnce({ threshold: 0.1 });

  return (
    <Card 
      ref={ref}
      className={`h-full transition-all duration-700 ease-out hover:shadow-xl hover:-translate-y-2 ${
        hasAnimated 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-10 scale-95'
      }`}
      style={{ transitionDelay: hasAnimated ? `${delay}ms` : '0ms' }}
    >
      <CardContent className="p-8 text-center h-full flex flex-col">
        <div 
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.lightPrimary }}
        >
          {React.cloneElement(icon, { size: 32, color: colors.primary })}
        </div>
        <h3 className="text-xl font-bold mb-4" style={{ color: colors.dark }}>
          {title}
        </h3>
        <p className="text-gray-600 flex-grow">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

// Fixed Stats Component with proper counter animation
const StatCard = ({ number, label, delay = 0 }) => {
  const [ref, hasAnimated] = useInViewOnce({ threshold: 0.1 });
  const targetNumber = parseInt(number.replace(/[^0-9]/g, ''));
  const count = useCountUp(targetNumber, hasAnimated);

  return (
    <div 
      ref={ref}
      className={`text-center transition-all duration-700 ease-out ${
        hasAnimated 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: hasAnimated ? `${delay}ms` : '0ms' }}
    >
      <div className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
        {count.toLocaleString()}{number.includes('+') ? '+' : ''}{number.includes('%') ? '%' : ''}
      </div>
      <div className="text-gray-600 text-lg">{label}</div>
    </div>
  );
};

export default function About() {
  const features = [
    {
      icon: <CheckCircle />,
      title: "Verified Listings",
      description: "Every property is personally verified by our team to ensure quality and authenticity."
    },
    {
      icon: <Shield />,
      title: "Secure Payments",
      description: "Your transactions are protected with bank-grade security and encrypted payment processing."
    },
    {
      icon: <Clock />,
      title: "24/7 Support",
      description: "Our dedicated support team is available round the clock to assist you with any queries."
    },
    {
      icon: <Users />,
      title: "Community Focused",
      description: "Building a trusted community of property owners and tenants across major cities."
    }
  ];

  const stats = [
    { number: "10000+", label: "Happy Tenants" },
    { number: "5000+", label: "Verified Properties" },
    { number: "50+", label: "Cities Covered" },
    { number: "99%", label: "Satisfaction Rate" }
  ];

  const values = [
    {
      icon: <Target />,
      title: "Our Mission",
      description: "To revolutionize the rental experience by providing a trusted platform that connects tenants with verified, affordable accommodations while ensuring transparency and safety for all."
    },
    {
      icon: <Heart />,
      title: "Our Values",
      description: "We believe in trust, transparency, and community. Every interaction on our platform is built on these core principles, ensuring a positive experience for everyone involved."
    },
    {
      icon: <Award />,
      title: "Our Promise",
      description: "We promise to continuously innovate and improve our services, maintaining the highest standards of quality and customer satisfaction in the rental industry."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <Badge className="mb-6 px-4 py-2" style={{ backgroundColor: colors.lightPrimary }}>
              <span style={{ color: colors.primary }}>About Nest</span>
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-8" style={{ color: colors.dark }}>
              Redefining the
              <span className="block" style={{ color: colors.primary }}>
                Rental Experience
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12" style={{ color: colors.muted }}>
              We're on a mission to make finding and renting accommodations as simple, 
              safe, and transparent as possible for everyone.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <StatCard 
                  key={index} 
                  number={stat.number} 
                  label={stat.label}
                  delay={index * 100}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.dark }}>
              Why Choose Nest?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.muted }}>
              We've built our platform with cutting-edge technology and a deep understanding 
              of what renters and property owners truly need.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.dark }}>
              Our Foundation
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: colors.muted }}>
              Built on strong values and a clear mission to transform the rental industry.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <AnimatedSection key={index} delay={index * 200}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div 
                      className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.lightPrimary }}
                    >
                      {React.cloneElement(value.icon, { size: 36, color: colors.primary })}
                    </div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: colors.dark }}>
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.dark }}>
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-10" style={{ color: colors.muted }}>
            Join thousands of satisfied users who have found their perfect home through Nest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 group"
              style={{ backgroundColor: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              Find Your Home
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 hover:shadow-lg"
              style={{ borderColor: colors.primary, color: colors.primary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.primary;
              }}
            >
              List Your Property
            </Button>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}