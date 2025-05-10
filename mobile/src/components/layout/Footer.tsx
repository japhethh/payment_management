// src/components/layout/Footer.tsx
export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container flex h-16 items-center px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} My Back to Normal "Add Companys"
        </p>
      </div>
    </footer>
  );
}

