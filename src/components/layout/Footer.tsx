import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 bg-gradient-to-r from-muted/50 to-muted/30 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold gradient-text">EndlessChat</span>
          </div>
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <div className="mb-1">© 2024 EndlessChat. All rights reserved.</div>
            <div>Crafted with ❤️ by <span className="text-primary font-medium">Deepansh Gangwar</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;