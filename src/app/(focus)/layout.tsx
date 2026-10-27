/**
 * Distraction-free pages (checkout, coming soon): no store navigation, so
 * visitors stay on the task. Each page renders its own minimal header.
 */
export default function FocusLayout({ children }: LayoutProps<"/">) {
  return (
    <main id="main" className="flex flex-1 flex-col">
      {children}
    </main>
  );
}
