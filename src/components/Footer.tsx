export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container text-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Md. Abdullah Bari. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
