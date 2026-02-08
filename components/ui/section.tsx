import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ children, className, ...props }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)} {...props}>
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto mb-12 max-w-2xl text-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "font-heading text-3xl font-bold tracking-tight md:text-4xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function SectionDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-4 text-lg text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}
