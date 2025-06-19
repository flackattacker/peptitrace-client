import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-4">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-auto md:flex-row">
        <div className="flex flex-col items-center gap-2 px-4 md:flex-row md:gap-4 md:px-0">
          <p className="text-center text-xs leading-loose text-muted-foreground md:text-left">
            Built for the peptide research community. 
            <a href="/privacy" className="font-medium underline underline-offset-4 ml-1">
              Privacy Policy
            </a>
            {" · "}
            <a href="/terms" className="font-medium underline underline-offset-4">
              Terms
            </a>
          </p>
          <p className="text-center text-xs text-muted-foreground md:text-left font-semibold">
            Information provided is for educational purposes only. Always consult a healthcare professional before starting any peptide regimen.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;