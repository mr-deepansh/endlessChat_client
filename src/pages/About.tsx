import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import Navbar from '../components/layout/Navbar';
import { Users, Heart, Globe, Code, Coffee, Github } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">About EndlessChat</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A social platform built with passion, designed to foster authentic connections and
            meaningful conversations.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                EndlessChat was born from a simple idea: social media should bring people together,
                not divide them. Created by{' '}
                <span className="font-semibold text-primary">Deepansh Gangwar</span>, this platform
                focuses on quality interactions over quantity metrics.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe in creating a space where every voice matters, where conversations flow
                naturally, and where genuine connections can flourish without the noise of
                algorithms and ads.
              </p>
              <div className="flex gap-4">
                <Button variant="gradient" asChild>
                  <Link to="/register">Join Us Today</Link>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://github.com/mr-deepansh"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-80 rounded-2xl bg-gradient-primary/20 flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold">Building Community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
              <p className="text-muted-foreground">
                We encourage genuine interactions and real connections, not performative social
                media.
              </p>
            </div>
            <div className="text-center p-6">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
              <p className="text-muted-foreground">
                Everyone deserves a voice. We create a welcoming space for all backgrounds and
                perspectives.
              </p>
            </div>
            <div className="text-center p-6">
              <Code className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Built with modern technology to provide the best user experience possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Coffee className="w-8 h-8 text-primary mr-2" />
            <h2 className="text-3xl font-bold">Meet the Developer</h2>
          </div>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Hi! I'm <span className="font-semibold text-primary">Deepansh Gangwar</span>, a
            passionate full-stack developer who believes in the power of technology to bring people
            together. EndlessChat is my vision of what social media can be when it's built with care
            and purpose.
          </p>
          <Button variant="gradient" asChild>
            <a href="https://github.com/mr-deepansh" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              Follow on GitHub
            </a>
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;
