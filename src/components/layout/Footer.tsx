import React from 'react';
import { Heart, Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-700 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                EndlessChat
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Connect, share, and discover in our modern social platform built for meaningful
              conversations.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {['About', 'Features', 'Privacy', 'Terms', 'Support', 'Contact'].map(link => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Connect</h3>
            <div className="flex gap-3">
              {[
                { icon: Github, href: 'https://github.com/mr-deepansh', label: 'GitHub' },
                {
                  icon: Linkedin,
                  href: 'https://linkedin.com/in/deepansh-gangwar',
                  label: 'LinkedIn',
                },
                { icon: Mail, href: 'mailto:deepanshgangwar7037@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors group"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © 2025 EndlessChat. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by Deepansh Gangwar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
